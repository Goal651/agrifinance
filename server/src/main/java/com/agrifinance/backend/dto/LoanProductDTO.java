package com.agrifinance.backend.dto;

import lombok.*;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanProductDTO {
    private UUID id;
    private String title;
    private String description;
    private Double interestRate;
    private Double maxAmount;
    private String term;
}
