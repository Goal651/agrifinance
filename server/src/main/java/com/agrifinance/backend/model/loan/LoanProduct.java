package com.agrifinance.backend.model.loan;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

import com.agrifinance.backend.model.enums.LoanTermType;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)  
    private UUID id;

    private String name;
    private String description;
    private Double interest;
    private Double amount;
    private Integer term;

    @Enumerated(EnumType.STRING)
    private LoanTermType termType;
}