package com.agrifinance.backend.model.loan;

import jakarta.persistence.*;
import lombok.*;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.model.loan.LoanPayment;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(indexes = @Index(name = "idx_loan_user_id", columnList = "user_id"))
public class Loan {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    private Double interest;
    private Double amount;
    private String status; // e.g., PENDING, APPROVED, REJECTED
    private String type; // e.g., SEED, EQUIPMENT, etc.
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String term; 
    private Double paidAmount;
    @OneToMany(mappedBy = "loan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LoanPayment> payments;
}
