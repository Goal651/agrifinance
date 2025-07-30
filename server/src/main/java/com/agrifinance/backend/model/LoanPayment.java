package com.agrifinance.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanPayment {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id")
    private Loan loan;

    private Double amount;
    private LocalDateTime dueDate;
    private LocalDateTime paidDate;
    private String status; // e.g., PENDING, PAID, OVERDUE
}
