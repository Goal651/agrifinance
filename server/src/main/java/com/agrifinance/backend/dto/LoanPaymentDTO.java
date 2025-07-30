package com.agrifinance.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LoanPaymentDTO {
    private String id;
    private Double amount;
    private LocalDateTime dueDate;
    private LocalDateTime paidDate;
    private String status;
}
