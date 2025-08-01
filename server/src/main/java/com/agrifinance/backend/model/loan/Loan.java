package com.agrifinance.backend.model.loan;

import com.agrifinance.backend.model.enums.LoanStatus;
import com.agrifinance.backend.model.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(indexes = {
        @Index(name = "idx_loan_user_id", columnList = "user_id"),
        @Index(name = "idx_loan_status", columnList = "status"),
        @Index(name = "idx_loan_created_at", columnList = "createdAt"),
        @Index(name = "idx_loan_product_id", columnList = "loan_product_id")
})
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String purpose;

    @Enumerated(EnumType.STRING)
    private LoanStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_product_id")
    private LoanProduct details;

    @Embedded
    private LoanInfo info;

    private Double paidAmount;
    
    @OneToMany(mappedBy = "loan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<LoanPayment> payments = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
