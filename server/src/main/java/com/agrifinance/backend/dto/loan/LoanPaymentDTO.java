package com.agrifinance.backend.dto.loan;

import lombok.Data;
import java.time.LocalDateTime;

import com.agrifinance.backend.model.enums.PaymentStatus;

@Data
public class LoanPaymentDTO {
    private String id;
    private Double amount;
    private LocalDateTime dueDate;
    private LocalDateTime paidDate;
    private PaymentStatus status;
    private LoanDTO loan;
}
