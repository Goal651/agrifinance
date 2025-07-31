package com.agrifinance.backend.model.loan;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanInfo {
    @Embedded
    private PersonalInfo personal;
    
    @Embedded
    private FinancialInfo financial;
    
    @Embedded
    private DocumentUpload documents;
}
