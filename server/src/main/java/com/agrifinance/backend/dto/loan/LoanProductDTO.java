package com.agrifinance.backend.dto.loan;

import lombok.Data;

@Data
public class LoanProductDTO {
    private String id;
    private String name;
    private String description;
    private Double interestRate;
    private Integer term;
}
