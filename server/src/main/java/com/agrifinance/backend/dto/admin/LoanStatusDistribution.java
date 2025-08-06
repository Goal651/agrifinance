package com.agrifinance.backend.dto.admin;

import com.agrifinance.backend.model.enums.LoanStatus;

import lombok.Data;

@Data
public class LoanStatusDistribution {
    private LoanStatus status;
    private Double count;
    private Double amount;
}
