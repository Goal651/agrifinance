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
    private String incomeSource;
    private String employmentStatus;
    private Integer farmingExperience;
    private String farmType;
    private String bankName;
    private String bankBranch;
    private String accountNumber;
    private String accountHolderName;
}
