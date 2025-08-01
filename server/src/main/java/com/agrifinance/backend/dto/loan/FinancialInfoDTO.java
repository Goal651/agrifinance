package com.agrifinance.backend.dto.loan;

import lombok.Data;

@Data
public class FinancialInfoDTO {
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
