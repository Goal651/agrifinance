package com.agrifinance.backend.dto.loan;

import lombok.Data;

@Data
public class FinancialInfoDTO {
    private Double monthlyIncome;
    private Double annualIncome;
    private String incomeSource; // Consider using an enum: 'farming', 'employment', 'business', 'other'
    private String employmentStatus; // Consider using an enum: 'employed', 'self-employed', 'unemployed', 'retired'
    private Integer farmingExperience; // in years
    private String farmType; // Consider using an enum: 'crop', 'livestock', 'mixed', 'other'
    private String bankName;
    private String bankBranch;
    private String accountNumber;
    private String accountHolderName;
}
