package com.agrifinance.backend.model.loan;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialInfo {
    private Double monthlyIncome;
    private Double annualIncome;
    private String incomeSource; // Consider creating an enum
    private String employmentStatus; // Consider creating an enum
    private Integer farmingExperience; // in years
    private String farmType; // Consider creating an enum
    private String bankName;
    private String bankBranch;
    private String accountNumber;
    private String accountHolderName;
}
