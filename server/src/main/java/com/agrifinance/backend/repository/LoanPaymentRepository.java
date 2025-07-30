package com.agrifinance.backend.repository;

import com.agrifinance.backend.model.LoanPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LoanPaymentRepository extends JpaRepository<LoanPayment, UUID> {
    List<LoanPayment> findByLoanId(UUID loanId);
}
