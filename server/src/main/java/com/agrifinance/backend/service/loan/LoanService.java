package com.agrifinance.backend.service.loan;

import com.agrifinance.backend.dto.loan.LoanDTO;
import com.agrifinance.backend.dto.loan.LoanPaymentDTO;
import com.agrifinance.backend.dto.loan.LoanRequest;
import com.agrifinance.backend.model.loan.Loan;
import com.agrifinance.backend.model.loan.LoanPayment;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.repository.LoanRepository;
import com.agrifinance.backend.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
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

    public LoanService(LoanRepository loanRepository, UserRepository userRepository) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
    }

    // Manual mapping methods
    private LoanDTO toDto(Loan loan) {
        if (loan == null)
            return null;
        LoanDTO dto = new LoanDTO();
        dto.setId(loan.getId() != null ? loan.getId().toString() : null);
        dto.setUserId(loan.getUser() != null ? loan.getUser().getId().toString() : null);
        dto.setAmount(loan.getAmount());
        dto.setStatus(loan.getStatus());
        dto.setType(loan.getType());
        dto.setCreatedAt(loan.getCreatedAt());
        dto.setUpdatedAt(loan.getUpdatedAt());
        if (loan.getPayments() != null) {
            dto.setPayments(loan.getPayments().stream().map(this::toDto).toList());
        }
        return dto;
    }

    private List<LoanDTO> toDtoList(List<Loan> loans) {
        return loans.stream().map(this::toDto).toList();
    }

    private Loan toEntity(LoanDTO dto) {
        if (dto == null)
            return null;
        Loan loan = new Loan();
        if (dto.getId() != null)
            loan.setId(UUID.fromString(dto.getId()));
        loan.setAmount(dto.getAmount());
        loan.setStatus(dto.getStatus());
        loan.setType(dto.getType());
        loan.setCreatedAt(dto.getCreatedAt());
        loan.setUpdatedAt(dto.getUpdatedAt());
        // user and payments set elsewhere
        return loan;
    }

    private LoanPaymentDTO toDto(LoanPayment payment) {
        if (payment == null)
            return null;
        LoanPaymentDTO dto = new LoanPaymentDTO();
        dto.setId(payment.getId() != null ? payment.getId().toString() : null);
        dto.setAmount(payment.getAmount());
        dto.setDueDate(payment.getDueDate());
        dto.setPaidDate(payment.getPaidDate());
        dto.setStatus(payment.getStatus());
        return dto;
    }

    private List<LoanPaymentDTO> toDtoListPayments(List<LoanPayment> payments) {
        return payments.stream().map(this::toDto).toList();
    }

    // User Endpoints
    public LoanDTO getLoanOverview(UUID userId) {
        List<Loan> loans = loanRepository.findByUserId(userId);
        return loans.isEmpty() ? null : toDto(loans.get(loans.size() - 1));
    }

    public LoanDTO getCurrentLoan(UUID userId) {
        List<Loan> loans = loanRepository.findByUserId(userId);
        if (loans.isEmpty())
            return null;
        // Find the loan with the latest createdAt
        Loan latestLoan = loans.stream()
            .max(Comparator.comparing(Loan::getCreatedAt))
            .orElse(null);
        return toDto(latestLoan);
    }

    public List<LoanPaymentDTO> getLoanPayments(UUID userId) {
        List<Loan> loans = loanRepository.findByUserId(userId);
        List<LoanPayment> payments = loans.stream()
                .flatMap(loan -> loan.getPayments().stream())
                .toList();
        return toDtoListPayments(payments);
    }

    public List<LoanDTO> getLoanHistory(UUID userId) {
        return toDtoList(loanRepository.findByUserId(userId));
    }

    public Map<String, Object> getLoanAnalytics(UUID userId) {
        List<Loan> loans = loanRepository.findByUserId(userId);
        Map<String, Object> analytics = new HashMap<>();

        // Total number of loans
        int totalLoans = loans.size();
        analytics.put("totalLoans", totalLoans);

        // Total amount borrowed (sum of all principal amounts)
        double totalAmountBorrowed = loans.stream().mapToDouble(Loan::getAmount).sum();
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
            double principal = loan.getAmount();
            double paid = loan.getPayments().stream()
                    .filter(p -> "PAID".equalsIgnoreCase(p.getStatus()))
                    .mapToDouble(LoanPayment::getAmount)
                    .sum();
            double interest = paid - Math.min(principal, paid);
            totalInterestPaid += Math.max(0, interest);
        }
        analytics.put("totalInterestPaid", totalInterestPaid);

        // Active loans (status == APPROVED)
        long activeLoans = loans.stream().filter(l -> "APPROVED".equalsIgnoreCase(l.getStatus())).count();
        analytics.put("activeLoans", activeLoans);

        // Overdue payments (status == OVERDUE)
        long overduePayments = loans.stream()
                .flatMap(loan -> loan.getPayments().stream())
                .filter(payment -> "OVERDUE".equalsIgnoreCase(payment.getStatus()))
                .count();
        analytics.put("overduePayments", overduePayments);

        // Next payment due (earliest PENDING payment)
        Optional<LoanPayment> nextPayment = loans.stream()
                .flatMap(loan -> loan.getPayments().stream())
                .filter(payment -> "PENDING".equalsIgnoreCase(payment.getStatus()))
                .sorted(Comparator.comparing(LoanPayment::getDueDate))
                .findFirst();
        analytics.put("nextPaymentDueDate", nextPayment.map(p -> p.getDueDate().toString()).orElse(null));
        analytics.put("nextPaymentAmount", nextPayment.map(LoanPayment::getAmount).orElse(null));

        // Repayment progress (percentage of total repaid vs. total to be repaid)
        double totalToBeRepaid = loans.stream()
                .flatMap(loan -> loan.getPayments().stream())
                .mapToDouble(LoanPayment::getAmount)
                .sum();
        double repaymentProgress = totalToBeRepaid == 0 ? 0 : (totalAmountRepaid / totalToBeRepaid) * 100.0;
        analytics.put("repaymentProgress", repaymentProgress);

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
            breakdown.put("type", loan.getType());
            breakdown.put("amount", loan.getAmount());
            breakdown.put("interest", loan.getPayments().isEmpty() ? 0.0 : loan.getPayments().get(0).getAmount() * loan.getPayments().size() - loan.getAmount());
            breakdown.put("status", loan.getStatus());
            breakdown.put("createdAt", loan.getCreatedAt() != null ? loan.getCreatedAt().toString() : null);
            breakdown.put("repaidAmount", repaidAmount);
            breakdown.put("remainingAmount", remainingAmount);
            loanBreakdown.add(breakdown);
        }
        analytics.put("loanBreakdown", loanBreakdown);

        // Payment history
        List<Map<String, Object>> paymentHistory = new ArrayList<>();
        loans.stream()
                .flatMap(loan -> loan.getPayments().stream())
                .sorted(Comparator.comparing(LoanPayment::getDueDate))
                .forEach(payment -> {
                    Map<String, Object> ph = new HashMap<>();
                    ph.put("paymentId", payment.getId().toString());
                    ph.put("loanId", payment.getLoan().getId().toString());
                    ph.put("amount", payment.getAmount());
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
                    paymentHistory.add(ph);
                });
        analytics.put("paymentHistory", paymentHistory);

        return analytics;
    }

    public LoanDTO applyForLoan(UUID userId, LoanRequest dto) {
        User user = userRepository.findById(userId).orElseThrow();
        Loan loan = new Loan();
        loan.setId(null);
        loan.setUser(user);
        loan.setAmount(dto.getAmount());
        loan.setType(dto.getType());
        loan.setStatus("PENDING");
        loan.setCreatedAt(LocalDateTime.now());
        loan.setUpdatedAt(LocalDateTime.now());
        // Save loan first to get its ID
        loan = loanRepository.save(loan);

        // Calculate term in months
        int termMonths = 12; // default
        if (dto.getTerm() != null) {
            try {
                termMonths = Integer.parseInt(dto.getTerm());
            } catch (NumberFormatException e) {
                termMonths = 12; // fallback to default
            }
        }
        if ("years".equalsIgnoreCase(dto.getTermType())) {
            termMonths = termMonths * 12;
        }
        double interest = dto.getInterest() != null ? dto.getInterest() : 0.0;
        double monthlyPayment = calculateMonthlyPayment(dto.getAmount(), interest, termMonths);

        List<LoanPayment> payments = new ArrayList<>();
        LocalDateTime dueDate = loan.getCreatedAt().plusMonths(1);
        for (int i = 0; i < termMonths; i++) {
            LoanPayment payment = LoanPayment.builder()
                    .loan(loan)
                    .amount(monthlyPayment)
                    .dueDate(dueDate.plusMonths(i))
                    .status("PENDING")
                    .build();
            payments.add(payment);
        }
        loan.setPayments(payments);
        loan = loanRepository.save(loan);
        return toDto(loan);
    }

    // Admin Endpoints
    public Page<LoanDTO> getAllLoans(int page, int limit, String status, String type, Double minAmount,
            Double maxAmount) {
        Pageable pageable = PageRequest.of(page, limit);
        Specification<Loan> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null)
                predicates.add(cb.equal(root.get("status"), status));
            if (type != null)
                predicates.add(cb.equal(root.get("type"), type));
            if (minAmount != null)
                predicates.add(cb.ge(root.get("amount"), minAmount));
            if (maxAmount != null)
                predicates.add(cb.le(root.get("amount"), maxAmount));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return loanRepository.findAll(spec, pageable).map(this::toDto);
    }

    public LoanDTO getLoanById(UUID loanId) {
        return toDto(loanRepository.findById(loanId).orElseThrow());
    }

    public LoanDTO updateLoanStatus(UUID loanId, String status) {
        Loan loan = loanRepository.findById(loanId).orElseThrow();
        loan.setStatus(status);
        loan.setUpdatedAt(LocalDateTime.now());
        return toDto(loanRepository.save(loan));
    }

    public Map<String, Object> getLoanSummary() {
        List<Loan> loans = loanRepository.findAll();
        double total = loans.stream().mapToDouble(Loan::getAmount).sum();
        long approved = loans.stream().filter(l -> "APPROVED".equals(l.getStatus())).count();
        long pending = loans.stream().filter(l -> "PENDING".equals(l.getStatus())).count();
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
