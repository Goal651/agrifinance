package com.agrifinance.backend.model.loan;

import com.agrifinance.backend.model.enums.LoanTermType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanDetails {
    private Double amount;
    private Double interest;
    private String type;
    private Integer term;
    
    @Enumerated(EnumType.STRING)
    private LoanTermType termType;
    
    private String purpose;
}
