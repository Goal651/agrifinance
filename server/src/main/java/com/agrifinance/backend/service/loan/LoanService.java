package com.agrifinance.backend.service.loan;

import com.agrifinance.backend.dto.loan.*;
import com.agrifinance.backend.model.enums.LoanStatus;
import com.agrifinance.backend.model.loan.*;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.mapper.loan.*;
import com.agrifinance.backend.repository.LoanRepository;
import com.agrifinance.backend.repository.UserRepository;
import jakarta.persistence.criteria.*;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class LoanService {
    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final LoanMapper loanMapper;
    private final FinancialInfoMapper financialInfoMapper;
    private final DocumentUploadMapper documentUploadMapper;
    private final PersonalInfoMapper personalInfoMapper;
    private final LoanProductMapper loanProductMapper;
    private final LoanPaymentMapper loanPaymentMapper;

    public LoanService(LoanRepository loanRepository, UserRepository userRepository, LoanMapper loanMapper,
            FinancialInfoMapper financialInfoMapper, DocumentUploadMapper documentUploadMapper,
            PersonalInfoMapper personalInfoMapper, LoanProductMapper loanProductMapper,
            LoanPaymentMapper loanPaymentMapper) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
        this.loanMapper = loanMapper;
        this.financialInfoMapper = financialInfoMapper;
        this.documentUploadMapper = documentUploadMapper;
        this.personalInfoMapper = personalInfoMapper;
        this.loanProductMapper = loanProductMapper;
        this.loanPaymentMapper = loanPaymentMapper;
    }

    // User Endpoints
    public LoanDTO getLoanOverview(UUID userId) {
        List<Loan> loans = loanRepository.findByUserId(userId);
        return loans.isEmpty() ? null : loanMapper.toDTO(loans.get(loans.size() - 1));
    }

    public LoanDTO getCurrentLoan(UUID userId) {
        List<Loan> loans = loanRepository.findByUserId(userId);
        if (loans.isEmpty())
            return null;
        // Find the loan with the latest createdAt
        Loan latestLoan = loans.stream()
                .max(Comparator.comparing(Loan::getCreatedAt))
                .orElse(null);
        return loanMapper.toDTO(latestLoan);
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
                .flatMap(loan -> loan.getPayments().stream())
                .filter(payment -> "PAID".equalsIgnoreCase(payment.getStatus()))
                .mapToDouble(LoanPayment::getAmount)
                .sum();
        analytics.put("totalAmountRepaid", totalAmountRepaid);

        // Total interest paid (sum of all interest paid in PAID payments)
        double totalInterestPaid = 0.0;
        for (Loan loan : loans) {
            double principal = loan.getDetails().getAmount();
            double totalPaid = loan.getPayments().stream()
                    .filter(p -> "PAID".equalsIgnoreCase(p.getStatus()))
                    .mapToDouble(LoanPayment::getAmount)
                    .sum();
            totalInterestPaid += Math.max(0, totalPaid - principal);
        }
        analytics.put("totalInterestPaid", totalInterestPaid);

        // Next payment due (earliest non-PAID payment)
        Optional<LoanPayment> nextPayment = loans.stream()
                .flatMap(loan -> loan.getPayments().stream())
                .filter(payment -> !"PAID".equalsIgnoreCase(payment.getStatus()))
                .min(Comparator.comparing(LoanPayment::getDueDate));

        if (nextPayment.isPresent()) {
            analytics.put("nextPaymentDueDate", nextPayment.get().getDueDate().toString());
            analytics.put("nextPaymentAmount", nextPayment.get().getAmount());
            analytics.put("nextPaymentLoanId", nextPayment.get().getLoan().getId().toString());
        } else {
            analytics.put("nextPaymentDueDate", null);
            analytics.put("nextPaymentAmount", null);
            analytics.put("nextPaymentLoanId", null);
        }

        // Loan breakdown
        List<Map<String, Object>> loanBreakdown = new ArrayList<>();
        for (Loan loan : loans) {
            double repaidAmount = loan.getPayments().stream()
                    .filter(p -> "PAID".equalsIgnoreCase(p.getStatus()))
                    .mapToDouble(LoanPayment::getAmount)
                    .sum();
            double remainingAmount = loan.getPayments().stream()
                    .filter(p -> !"PAID".equalsIgnoreCase(p.getStatus()))
                    .mapToDouble(LoanPayment::getAmount)
                    .sum();

            Map<String, Object> breakdown = new HashMap<>();
            breakdown.put("loanId", loan.getId().toString());
            breakdown.put("type", loan.getDetails());
            breakdown.put("amount", loan.getDetails().getAmount());
            breakdown.put("interest",
                    loan.getPayments().isEmpty() ? 0.0
                            : (loan.getPayments().get(0).getAmount() * loan.getPayments().size())
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
                .flatMap(loan -> loan.getPayments().stream()
                        .map(payment -> {
                            Map<String, Object> ph = new HashMap<>();
                            ph.put("paymentId", payment.getId().toString());
                            ph.put("loanId", loan.getId().toString());
                            ph.put("amount", payment.getAmount());
                            ph.put("dueDate", payment.getDueDate() != null ? payment.getDueDate().toString() : null);
                            ph.put("paidDate", payment.getPaidDate() != null ? payment.getPaidDate().toString() : null);

                            String status;
                            if ("PAID".equalsIgnoreCase(payment.getStatus())) {
                                status = "Paid";
                            } else if ("OVERDUE".equalsIgnoreCase(payment.getStatus())) {
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

    public LoanDTO applyForLoan(UUID userId, LoanRequest request) {
        System.out.println("user id"+request.getDetails());
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
        double monthlyPayment = calculateMonthlyPayment(
                details.getAmount(),
                details.getInterest() != null ? details.getInterest() : 0.0,
                details.getTerm());

        List<LoanPayment> payments = new ArrayList<>();
        LocalDateTime dueDate = loan.getCreatedAt().plusMonths(1);
        for (int i = 0; i < details.getTerm(); i++) {
            LoanPayment payment = LoanPayment.builder()
                    .loan(loan)
                    .amount(monthlyPayment)
                    .dueDate(dueDate.plusMonths(i))
                    .status("PENDING")
                    .build();
            payments.add(payment);
        }
        loan.setPayments(payments);

        // Save the loan with all its relationships
        loan = loanRepository.save(loan);
        return loanMapper.toDTO(loan);
    }

    // Admin Endpoints
    public Page<LoanDTO> getAllLoans(int page, int limit, String status, String type, Double minAmount,
            Double maxAmount) {
        Pageable pageable = PageRequest.of(page, limit);

        Specification<Loan> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Join with details for amount and type filtering
            Join<Loan, LoanDetails> details = root.join("details", JoinType.INNER);

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), LoanStatus.valueOf(status.toUpperCase())));
            }

            if (type != null) {
                predicates.add(cb.equal(details.get("type"), type));
            }

            if (minAmount != null) {
                predicates.add(cb.ge(details.get("amount"), minAmount));
            }

            if (maxAmount != null) {
                predicates.add(cb.le(details.get("amount"), maxAmount));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return loanRepository.findAll(spec, pageable).map(loanMapper::toDTO);
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

    // Calculate fixed monthly payment for a loan
    public double calculateMonthlyPayment(double amount, double annualInterestRate, int termMonths) {
        double monthlyRate = annualInterestRate / 12.0 / 100.0;
        if (monthlyRate == 0) {
            return amount / termMonths;
        }
        return (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
                (Math.pow(1 + monthlyRate, termMonths) - 1);
    }

    // Example: Generate a payment schedule (list of monthly payments)
    public List<Double> generatePaymentSchedule(double amount, double annualInterestRate, int termMonths) {
        double monthlyPayment = calculateMonthlyPayment(amount, annualInterestRate, termMonths);
        List<Double> schedule = new ArrayList<>();
        for (int i = 0; i < termMonths; i++) {
            schedule.add(monthlyPayment);
        }
        return schedule;
    }
}
