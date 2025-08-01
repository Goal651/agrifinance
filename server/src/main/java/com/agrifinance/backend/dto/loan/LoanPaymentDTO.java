package com.agrifinance.backend.dto.loan;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class LoanPaymentDTO {
    private UUID id;
    private Double amount;
    private LocalDateTime dueDate;
    private LocalDateTime paidDate;
    private String status;
    private LoanDTO loan;
}
