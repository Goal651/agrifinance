package com.agrifinance.backend.service.loan;

import com.agrifinance.backend.dto.loan.*;
import com.agrifinance.backend.model.enums.LoanStatus;
import com.agrifinance.backend.model.enums.LoanTermType;
import com.agrifinance.backend.model.loan.*;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.dto.loan.FinancialInfoDTO;
import com.agrifinance.backend.dto.loan.PersonalInfoDTO;
import com.agrifinance.backend.dto.loan.DocumentUploadDTO;
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

    public LoanService(LoanRepository loanRepository, UserRepository userRepository) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
    }

    // Manual mapping methods
    private LoanDTO toDto(Loan loan) {
        if (loan == null) return null;
        
        LoanDTO dto = new LoanDTO();
        dto.setId(loan.getId() != null ? loan.getId().toString() : null);
        dto.setUserId(loan.getUser() != null ? loan.getUser().getId().toString() : null);
        dto.setStatus(loan.getStatus());
        dto.setCreatedAt(loan.getCreatedAt());
        dto.setUpdatedAt(loan.getUpdatedAt());
        
        // Map LoanDetails
        if (loan.getDetails() != null) {
            dto.setAmount(loan.getDetails().getAmount());
            dto.setInterest(loan.getDetails().getInterest());
            dto.setType(loan.getDetails().getType());
            dto.setTerm(loan.getDetails().getTerm());
            dto.setTermType(loan.getDetails().getTermType());
            dto.setPurpose(loan.getDetails().getPurpose());
        }
        
        // Map LoanInfo
        if (loan.getInfo() != null) {
            dto.setPersonalInfo(mapToPersonalInfoDTO(loan.getInfo().getPersonal()));
            dto.setFinancialInfo(mapToFinancialInfoDTO(loan.getInfo().getFinancial()));
            dto.setDocuments(mapToDocumentUploadDTO(loan.getInfo().getDocuments()));
        }
        
        // Map payments
        if (loan.getPayments() != null) {
            dto.setPayments(loan.getPayments().stream()
                .map(this::toDto)
                .toList());
        }
        
        return dto;
    }

    private List<LoanDTO> toDtoList(List<Loan> loans) {
        return loans.stream().map(this::toDto).toList();
    }

    // Mapping methods for PersonalInfo
    private PersonalInfoDTO mapToPersonalInfoDTO(PersonalInfo personalInfo) {
        if (personalInfo == null) return null;
        
        PersonalInfoDTO dto = new PersonalInfoDTO();
        dto.setFirstName(personalInfo.getFirstName());
        dto.setLastName(personalInfo.getLastName());
        dto.setIdNumber(personalInfo.getIdNumber());
        dto.setDateOfBirth(personalInfo.getDateOfBirth());
        dto.setStreetAddress(personalInfo.getStreetAddress());
        dto.setCity(personalInfo.getCity());
        dto.setState(personalInfo.getState());
        dto.setPostalCode(personalInfo.getPostalCode());
        dto.setCountry(personalInfo.getCountry());
        return dto;
    }
    
    private PersonalInfo mapToPersonalInfo(PersonalInfoDTO dto) {
        if (dto == null) return null;
        
        return PersonalInfo.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .idNumber(dto.getIdNumber())
                .dateOfBirth(dto.getDateOfBirth())
                .streetAddress(dto.getStreetAddress())
                .city(dto.getCity())
                .state(dto.getState())
                .postalCode(dto.getPostalCode())
                .country(dto.getCountry())
                .build();
    }
    
    // Mapping methods for FinancialInfo
    private FinancialInfoDTO mapToFinancialInfoDTO(FinancialInfo financialInfo) {
        if (financialInfo == null) return null;
        
        FinancialInfoDTO dto = new FinancialInfoDTO();
        dto.setMonthlyIncome(financialInfo.getMonthlyIncome());
        dto.setAnnualIncome(financialInfo.getAnnualIncome());
        dto.setIncomeSource(financialInfo.getIncomeSource());
        dto.setEmploymentStatus(financialInfo.getEmploymentStatus());
        dto.setFarmingExperience(financialInfo.getFarmingExperience());
        dto.setFarmType(financialInfo.getFarmType());
        dto.setBankName(financialInfo.getBankName());
        dto.setBankBranch(financialInfo.getBankBranch());
        dto.setAccountNumber(financialInfo.getAccountNumber());
        dto.setAccountHolderName(financialInfo.getAccountHolderName());
        return dto;
    }
    
    private FinancialInfo mapToFinancialInfo(FinancialInfoDTO dto) {
        if (dto == null) return null;
        
        return FinancialInfo.builder()
                .monthlyIncome(dto.getMonthlyIncome())
                .annualIncome(dto.getAnnualIncome())
                .incomeSource(dto.getIncomeSource())
                .employmentStatus(dto.getEmploymentStatus())
                .farmingExperience(dto.getFarmingExperience())
                .farmType(dto.getFarmType())
                .bankName(dto.getBankName())
                .bankBranch(dto.getBankBranch())
                .accountNumber(dto.getAccountNumber())
                .accountHolderName(dto.getAccountHolderName())
                .build();
    }
    
    // Mapping methods for DocumentUpload
    private DocumentUploadDTO mapToDocumentUploadDTO(DocumentUpload documentUpload) {
        if (documentUpload == null) return null;
        
        DocumentUploadDTO dto = new DocumentUploadDTO();
        dto.setIdPhoto(documentUpload.getIdPhoto());
        dto.setProofOfIncome(documentUpload.getProofOfIncome());
        dto.setFarmOwnershipDocuments(documentUpload.getFarmOwnershipDocuments());
        dto.setCooperativeMembership(documentUpload.getCooperativeMembership());
        dto.setTreeImages(new ArrayList<>(documentUpload.getTreeImages()));
        return dto;
    }
    
    private DocumentUpload mapToDocumentUpload(DocumentUploadDTO dto) {
        if (dto == null) return null;
        
        return DocumentUpload.builder()
                .idPhoto(dto.getIdPhoto())
                .proofOfIncome(dto.getProofOfIncome())
                .farmOwnershipDocuments(dto.getFarmOwnershipDocuments())
                .cooperativeMembership(dto.getCooperativeMembership())
                .treeImages(dto.getTreeImages() != null ? new ArrayList<>(dto.getTreeImages()) : new ArrayList<>())
                .build();
    }
    
    private Loan toEntity(LoanDTO dto) {
        if (dto == null) return null;
        
        Loan loan = new Loan();
        if (dto.getId() != null) {
            loan.setId(UUID.fromString(dto.getId()));
        }
        
        // Set basic fields
        loan.setStatus(dto.getStatus());
        loan.setCreatedAt(dto.getCreatedAt());
        loan.setUpdatedAt(dto.getUpdatedAt() != null ? dto.getUpdatedAt() : LocalDateTime.now());
        
        // Set LoanDetails
        LoanDetails details = new LoanDetails();
        details.setAmount(dto.getAmount());
        details.setInterest(dto.getInterest());
        details.setType(dto.getType());
        details.setTerm(dto.getTerm());
        details.setTermType(dto.getTermType());
        details.setPurpose(dto.getPurpose());
        loan.setDetails(details);
        
        // Set LoanInfo if available
        if (dto.getPersonalInfo() != null || dto.getFinancialInfo() != null || dto.getDocuments() != null) {
            LoanInfo info = LoanInfo.builder()
                .personal(mapToPersonalInfo(dto.getPersonalInfo()))
                .financial(mapToFinancialInfo(dto.getFinancialInfo()))
                .documents(mapToDocumentUpload(dto.getDocuments()))
                .build();
            loan.setInfo(info);
        }
        
        // Note: user and payments should be set by the calling method
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
            breakdown.put("type", loan.getDetails().getType());
            breakdown.put("amount", loan.getDetails().getAmount());
            breakdown.put("interest", loan.getPayments().isEmpty() ? 0.0 : 
                (loan.getPayments().get(0).getAmount() * loan.getPayments().size()) - loan.getDetails().getAmount());
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
                            ph.put("sortDate", payment.getPaidDate() != null ? payment.getPaidDate() : payment.getDueDate());
                            return ph;
                        }))
                .sorted((a, b) -> {
                    // Sort by paid date if available, otherwise by due date (descending)
                    LocalDateTime dateA = (LocalDateTime) a.get("sortDate");
                    LocalDateTime dateB = (LocalDateTime) b.get("sortDate");
                    if (dateA == null && dateB == null) return 0;
                    if (dateA == null) return 1;
                    if (dateB == null) return -1;
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
        analytics.put("repaymentProgress", totalAmountBorrowed > 0 ? 
                (totalAmountRepaid / totalAmountBorrowed) * 100 : 0);

        return analytics;
    }

    public LoanDTO applyForLoan(UUID userId, LoanRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        
        // Create LoanDetails
        LoanDetails details = LoanDetails.builder()
            .amount(request.getAmount())
            .interest(request.getInterest() != null ? request.getInterest() : 0.0)
            .type(request.getType())
            .term(request.getTerm())
            .termType(request.getTermType())
            .purpose(request.getPurpose())
            .build();
            
        // Create LoanInfo from request
        LoanInfo info = LoanInfo.builder()
            .personal(mapToPersonalInfo(request.getPersonalInfo()))
            .financial(mapToFinancialInfo(request.getFinancialInfo()))
            .documents(mapToDocumentUpload(request.getDocuments()))
            .build();
            
        // Create the loan
        Loan loan = Loan.builder()
            .user(user)
            .status(LoanStatus.PENDING)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .details(details)
            .info(info)
            .build();
            
        // Calculate term in months
        int termMonths = request.getTerm() != null ? request.getTerm() : 12;
        if (request.getTermType() == LoanTermType.YEARS) {
            termMonths = termMonths * 12;
        }
        
        // Calculate monthly payment and create payment schedule
        double monthlyPayment = calculateMonthlyPayment(
            request.getAmount(), 
            request.getInterest() != null ? request.getInterest() : 0.0, 
            termMonths
        );
        
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
        
        // Save the loan with all its relationships
        loan = loanRepository.save(loan);
        return toDto(loan);
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
        
        return loanRepository.findAll(spec, pageable).map(this::toDto);
    }

    public LoanDTO getLoanById(UUID loanId) {
        return toDto(loanRepository.findById(loanId).orElseThrow());
    }

    public LoanDTO updateLoanStatus(UUID loanId, LoanStatus status) {
        Loan loan = loanRepository.findById(loanId).orElseThrow();
        loan.setStatus(status);
        loan.setUpdatedAt(LocalDateTime.now());
        return toDto(loanRepository.save(loan));
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
