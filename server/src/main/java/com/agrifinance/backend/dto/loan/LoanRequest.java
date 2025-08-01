package com.agrifinance.backend.dto.loan;

import lombok.Data;

@Data
public class LoanRequest {
   private String purpose;
   private LoanProductDTO details;
   private PersonalInfoDTO personalInfo;
   private FinancialInfoDTO financialInfo;
   private DocumentUploadDTO documents;
}
