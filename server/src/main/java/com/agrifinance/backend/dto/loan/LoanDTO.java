package com.agrifinance.backend.dto.loan;

import com.agrifinance.backend.model.enums.LoanStatus;
import com.agrifinance.backend.model.enums.LoanTermType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class LoanDTO {
    private String id;
    private String userId;
    private LoanStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Double paidAmount;
    
    // Loan Details
    private Double amount;
    private Double interest;
    private String type;
    private Integer term;
    private LoanTermType termType;
    private String purpose;
    
    // Loan Info
    private PersonalInfoDTO personalInfo;
    private FinancialInfoDTO financialInfo;
    private DocumentUploadDTO documents;
    
    private List<LoanPaymentDTO> payments;
}
