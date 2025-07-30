package com.agrifinance.backend.dto.loan;

import lombok.Data;

@Data
public class LoanRequest {
    private Double amount;
    private String type;
    private String term;
    private String termType;
    private Double interest;
    private String purpose;
}
