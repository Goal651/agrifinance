package com.agrifinance.backend.dto.loan;

import com.agrifinance.backend.model.enums.LoanTermType;
import lombok.Data;

@Data
public class LoanRequest {
    // Loan details
    private Double amount;
    private Double interest;
    private String type;
    private Integer term;
    private LoanTermType termType;
    private String purpose;
    
    // Additional information
    private PersonalInfoDTO personalInfo;
    private FinancialInfoDTO financialInfo;
    private DocumentUploadDTO documents;
}
