package com.agrifinance.backend.model.loan;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

import com.agrifinance.backend.model.enums.PaymentStatus;

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
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
}
