package com.agrifinance.backend.dto;

import lombok.Data;

@Data
public class LoanRequest {
    private Double amount;
    private String type; // e.g., SEED, EQUIPMENT, etc.
    private Double interest;
    private Integer term; // now an integer
    private String termType; // 'months' or 'years'
    private String purpose;
}
