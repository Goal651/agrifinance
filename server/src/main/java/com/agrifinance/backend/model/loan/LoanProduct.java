package com.agrifinance.backend.model.loan;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanProduct {
    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String description;
    private Double interestRate;
    private Double maxAmount;
    private Double minAmount;
    private Integer termMonths;
}
