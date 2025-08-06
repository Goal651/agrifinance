package com.agrifinance.backend.service.loan;

import com.agrifinance.backend.dto.loan.*;
import com.agrifinance.backend.model.enums.LoanStatus;
import com.agrifinance.backend.model.enums.PaymentStatus;
import com.agrifinance.backend.model.loan.*;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.mapper.loan.*;
import com.agrifinance.backend.repository.LoanRepository;
import com.agrifinance.backend.repository.UserRepository;
import com.agrifinance.backend.utils.LoanUtil;

import lombok.RequiredArgsConstructor;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LoanService {
    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final LoanMapper loanMapper;
    private final FinancialInfoMapper financialInfoMapper;
    private final DocumentUploadMapper documentUploadMapper;
    private final PersonalInfoMapper personalInfoMapper;
    private final LoanProductMapper loanProductMapper;
    private final LoanUtil loanUtil;
    private final LoanPaymentService loanPaymentService;

    public LoanDTO getCurrentLoan(UUID userId) {
        List<Loan> loans = loanRepository.findByUserId(userId);
        if (loans.isEmpty())
            return null;
        Loan latestLoan = loans.stream()
                .max(Comparator.comparing(Loan::getCreatedAt))
                .orElse(null);
        LoanDTO result = loanMapper.toDTO(latestLoan);
        result.setPayments(loanPaymentService.getAllPayments(latestLoan.getId()));
        System.out.println("\n\n\n" + result);
        return result;
    }

    public List<LoanDTO> getLoanHistory(UUID userId) {
        return loanMapper.toDTOs(loanRepository.findByUserId(userId));
    }

    public Map<String, Object> getLoanAnalytics(UUID userId) {
        List<Loan> loans = loanRepository.findByUserId(userId);
        Map<String, Object> analytics = new HashMap<>();

        // Basic stats
        analytics.put("totalLoans", loans.size());
        analytics.put("activeLoans", loans.stream()
                .filter(l -> l.getStatus() == LoanStatus.APPROVED)
                .count());

        // Total amount borrowed (using LoanDetails.amount)
        double totalAmountBorrowed = loans.stream()
                .mapToDouble(loan -> loan.getDetails().getAmount())
                .sum();
        analytics.put("totalAmountBorrowed", totalAmountBorrowed);

        // Total amount repaid (sum of all payments with status 'PAID')
        double totalAmountRepaid = loans.stream()
                .flatMap(loan -> loanPaymentService.findAllPayments(loan.getId()).stream())
                .filter(payment -> PaymentStatus.PAID == payment.getStatus())
                .mapToDouble(LoanPayment::getAmount)
                .sum();
        analytics.put("totalAmountRepaid", totalAmountRepaid);

        // Total interest paid (sum of all interest paid in PAID payments)
        double totalInterestPaid = 0.0;
        for (Loan loan : loans) {
            double principal = loan.getDetails().getAmount();
            double totalPaid = loanPaymentService.findAllPayments(loan.getId()).stream()
                    .filter(p -> PaymentStatus.PAID == p.getStatus())
                    .mapToDouble(LoanPayment::getAmount)
                    .sum();
            totalInterestPaid += Math.max(0, totalPaid - principal);
        }
        analytics.put("totalInterestPaid", totalInterestPaid);

        // Next payment due (earliest non-PAID payment)
        Optional<LoanPayment> nextPayment = loans.stream()
                .flatMap(loan -> loanPaymentService.findAllPayments(loan.getId()).stream())
                .filter(payment -> PaymentStatus.PAID != payment.getStatus())
                .min(Comparator.comparing(LoanPayment::getDueDate));

        if (nextPayment.isPresent()) {
            analytics.put("nextPaymentDueDate", nextPayment.get().getDueDate().toString());
            analytics.put("nextPaymentAmount", nextPayment.get().getAmount());
            // analytics.put("nextPaymentLoanId",
            // nextPayment.get().getLoan().getId().toString());
        } else {
            analytics.put("nextPaymentDueDate", null);
            analytics.put("nextPaymentAmount", null);
            analytics.put("nextPaymentLoanId", null);
        }

        // Loan breakdown
        List<Map<String, Object>> loanBreakdown = new ArrayList<>();
        for (Loan loan : loans) {
            double repaidAmount = loanPaymentService.findAllPayments(loan.getId()).stream()
                    .filter(p -> PaymentStatus.PAID == p.getStatus())
                    .mapToDouble(LoanPayment::getAmount)
                    .sum();
            double remainingAmount = loanPaymentService.findAllPayments(loan.getId()).stream()
                    .filter(p -> PaymentStatus.PAID != p.getStatus())
                    .mapToDouble(LoanPayment::getAmount)
                    .sum();

            Map<String, Object> breakdown = new HashMap<>();
            breakdown.put("loanId", loan.getId().toString());
            breakdown.put("type", loan.getDetails());
            breakdown.put("amount", loan.getDetails().getAmount());
            breakdown.put("interest",
                    loanPaymentService.findAllPayments(loan.getId()).isEmpty() ? 0.0
                            : (loanPaymentService.findAllPayments(loan.getId()).get(0).getAmount()
                                    * loanPaymentService.findAllPayments(loan.getId()).size())
                                    - loan.getDetails().getAmount());
            breakdown.put("status", loan.getStatus().name());
            breakdown.put("createdAt", loan.getCreatedAt() != null ? loan.getCreatedAt().toString() : null);
            breakdown.put("repaidAmount", repaidAmount);
            breakdown.put("remainingAmount", remainingAmount);
            loanBreakdown.add(breakdown);
        }
        analytics.put("loanBreakdown", loanBreakdown);

        // Payment history (last 10 payments)
        List<Map<String, Object>> paymentHistory = loans.stream()
                .flatMap(loan -> loanPaymentService.findAllPayments(loan.getId()).stream()
                        .map(payment -> {
                            Map<String, Object> ph = new HashMap<>();
                            ph.put("paymentId", payment.getId().toString());
                            ph.put("loanId", loan.getId().toString());
                            ph.put("amount", payment.getAmount());
                            ph.put("dueDate", payment.getDueDate() != null ? payment.getDueDate().toString() : null);
                            ph.put("paidDate", payment.getPaidDate() != null ? payment.getPaidDate().toString() : null);

                            String status;
                            if (PaymentStatus.PAID == payment.getStatus()) {
                                status = "Paid";
                            } else if (PaymentStatus.NOT_PAID == payment.getStatus()) {
                                status = "Overdue";
                            } else {
                                status = "Upcoming";
                            }
                            ph.put("status", status);
                            ph.put("sortDate",
                                    payment.getPaidDate() != null ? payment.getPaidDate() : payment.getDueDate());
                            return ph;
                        }))
                .sorted((a, b) -> {
                    // Sort by paid date if available, otherwise by due date (descending)
                    LocalDateTime dateA = (LocalDateTime) a.get("sortDate");
                    LocalDateTime dateB = (LocalDateTime) b.get("sortDate");
                    if (dateA == null && dateB == null)
                        return 0;
                    if (dateA == null)
                        return 1;
                    if (dateB == null)
                        return -1;
                    return dateB.compareTo(dateA);
                })
                .limit(10) // Limit to last 10 payments
                .map(payment -> {
                    payment.remove("sortDate");
                    return payment;
                })
                .collect(Collectors.toList());

        analytics.put("paymentHistory", paymentHistory);

        // Summary stats
        analytics.put("outstandingBalance", totalAmountBorrowed - totalAmountRepaid);
        analytics.put("repaymentProgress",
                totalAmountBorrowed > 0 ? (totalAmountRepaid / totalAmountBorrowed) * 100 : 0);

        return analytics;
    }

    public Map<String, Object> processPayment(UUID loanId, Double paymentAmount) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
System.out.println("Testing .......\n\n\n\n"+loan);
        if (loan.getStatus() != LoanStatus.APPROVED) {
            throw new RuntimeException("Cannot process payment for a  loan that is not approved");
        }

        List<LoanPayment> pendingPayments = loanPaymentService.findAllPayments(loan.getId()).stream()
                .filter(p -> p.getStatus() == PaymentStatus.PENDING || p.getStatus() == PaymentStatus.NOT_PAID)
                .sorted(Comparator.comparing(LoanPayment::getDueDate))
                .collect(Collectors.toList());

        if (pendingPayments.isEmpty()) {
            throw new RuntimeException("No pending payments found for this loan");
        }

        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> processedPayments = new ArrayList<>();
        double remainingAmount = paymentAmount;
        boolean paymentComplete = false;

        for (LoanPayment payment : pendingPayments) {
            if (remainingAmount <= 0) {
                paymentComplete = true;
                break;
            }

            Map<String, Object> paymentResult = new HashMap<>();
            paymentResult.put("paymentId", payment.getId());
            paymentResult.put("originalDue", payment.getAmount());
            paymentResult.put("amountPaid", Math.min(payment.getAmount(), remainingAmount));

            if (remainingAmount >= payment.getAmount()) {
                // Full payment for this installment
                payment.setStatus(PaymentStatus.PAID);
                payment.setPaidDate(LocalDateTime.now());
                remainingAmount -= payment.getAmount();
                paymentResult.put("status", PaymentStatus.PAID);
            } else {
                // Partial payment
                payment.setAmount(payment.getAmount() - remainingAmount);
                paymentResult.put("status", PaymentStatus.NOT_PAID);
                paymentResult.put("remainingAmount", payment.getAmount());
                remainingAmount = 0;
            }

            processedPayments.add(paymentResult);
        }

        // Update loan's paid amount
        double totalPaid = paymentAmount - remainingAmount;
        loan.setPaidAmount((loan.getPaidAmount() != null ? loan.getPaidAmount() : 0) + totalPaid);

        // Check if loan is fully paid
        boolean isFullyPaid = loanPaymentService.findAllPayments(loan.getId()).stream()
                .allMatch(p -> p.getStatus() == PaymentStatus.PAID);

        if (isFullyPaid) {
            loan.setStatus(LoanStatus.PAID);
        }

        loanRepository.save(loan);

        result.put("processedPayments", processedPayments);
        result.put("totalPaid", totalPaid);
        result.put("remainingBalance", remainingAmount);
        result.put("isLoanFullyPaid", isFullyPaid);
        result.put("paymentComplete", paymentComplete);

        if (remainingAmount > 0) {
            result.put("message",
                    "Payment processed successfully. Remaining amount will be refunded or can be applied to future payments.");
        }

        return result;
    }

    public LoanDTO applyForLoan(UUID userId, LoanRequest request) {
        System.out.println("user id" + request.getDetails());
        User user = userRepository.findById(userId).orElseThrow();

        // Create LoanDetails
        LoanProduct details = loanProductMapper.toEntity(request.getDetails());
        // Create LoanInfo from request
        LoanInfo info = LoanInfo.builder()
                .personal(personalInfoMapper.toEntity(request.getPersonalInfo()))
                .financial(financialInfoMapper.toEntity(request.getFinancialInfo()))
                .documents(documentUploadMapper.toEntity(request.getDocuments()))
                .build();

        // Create the loan
        Loan loan = Loan.builder()
                .user(user)

                .status(LoanStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .details(details)
                .purpose(request.getPurpose())
                .info(info)
                .build();

        // Calculate monthly payment and create payment schedule
        double monthlyPayment = loanUtil.calculateMonthlyPayment(
                details.getAmount(),
                details.getInterest() != null ? details.getInterest() : 0.0,
                details.getTerm());
        loan = loanRepository.save(loan);

        List<LoanPayment> payments = new ArrayList<>();
        LocalDateTime dueDate = loan.getCreatedAt().plusMonths(1);
        for (int i = 0; i < details.getTerm(); i++) {
            LoanPayment payment = LoanPayment.builder()
                    .amount(monthlyPayment)
                    .loan(loan)
                    .dueDate(dueDate.plusMonths(i))
                    .status(PaymentStatus.NOT_PAID)
                    .build();
            payments.add(payment);
        }
        for (LoanPayment loanPayment : payments) {
            loanPaymentService.save(loanPayment);
        }
        return loanMapper.toDTO(loan);
    }

    public LoanDTO getLoanById(UUID loanId) {
        return loanMapper.toDTO(loanRepository.findById(loanId).orElseThrow());
    }

    public LoanDTO updateLoanStatus(UUID loanId, LoanStatus status) {
        Loan loan = loanRepository.findById(loanId).orElseThrow();
        loan.setStatus(status);
        loan.setUpdatedAt(LocalDateTime.now());
        return loanMapper.toDTO(loanRepository.save(loan));
    }

    public Map<String, Object> getLoanSummary() {
        List<Loan> loans = loanRepository.findAll();
        double total = loans.stream()
                .mapToDouble(loan -> loan.getDetails().getAmount())
                .sum();
        long approved = loans.stream()
                .filter(l -> l.getStatus() == LoanStatus.APPROVED)
                .count();
        long pending = loans.stream()
                .filter(l -> l.getStatus() == LoanStatus.PENDING)
                .count();
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalAmount", total);
        summary.put("approvedCount", approved);
        summary.put("pendingCount", pending);
        summary.put("totalLoans", loans.size());
        return summary;
    }

    public LoanDTO makePayment(UUID userId, double amount) {
        LoanDTO loanDTO = this.getCurrentLoan(userId);
        Loan loan = loanMapper.toEntity(loanDTO);
        if (loan == null) {
            throw new RuntimeException("No current loan found");
        }
        this.processPayment(loan.getId(), amount);
        return loanMapper.toDTO(loan);
    }

}
