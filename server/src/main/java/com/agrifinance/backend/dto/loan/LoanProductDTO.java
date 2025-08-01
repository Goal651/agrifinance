package com.agrifinance.backend.dto.loan;

import com.agrifinance.backend.model.enums.LoanTermType;

import lombok.Data;

@Data
public class LoanProductDTO {
    private String id;
    private String name;
    private String description;
    private Double interest;
    private Double amount;
    private Integer term;
    private LoanTermType termType;
}
