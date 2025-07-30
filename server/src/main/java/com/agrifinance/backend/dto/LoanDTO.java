package com.agrifinance.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class LoanDTO {
    private String id;
    private String userId;
    private Double amount;
    private String status;
    private String type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<LoanPaymentDTO> payments;
}
