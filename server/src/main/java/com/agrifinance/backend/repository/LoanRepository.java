package com.agrifinance.backend.repository;

import com.agrifinance.backend.model.enums.LoanStatus;
import com.agrifinance.backend.model.loan.Loan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface LoanRepository extends JpaRepository<Loan, UUID>, JpaSpecificationExecutor<Loan> {
    List<Loan> findByUserId(UUID userId);
    
    @Query("SELECT l FROM Loan l WHERE l.user.id = :userId AND l.status = :status")
    List<Loan> findByUserIdAndStatus(@Param("userId") UUID userId, @Param("status") LoanStatus status);
    
    @Query("SELECT l FROM Loan l WHERE l.details.name = :name")
    Page<Loan> findByName(@Param("name") String name, Pageable pageable);
    
    @Query("SELECT l FROM Loan l WHERE l.details.amount BETWEEN :minAmount AND :maxAmount")
    Page<Loan> findByAmountRange(
        @Param("minAmount") Double minAmount, 
        @Param("maxAmount") Double maxAmount, 
        Pageable pageable
    );
    
    @Query("SELECT l FROM Loan l WHERE l.status = :status AND l.createdAt BETWEEN :startDate AND :endDate")
    List<Loan> findByStatusAndDateRange(
        @Param("status") LoanStatus status,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT COALESCE(SUM(l.details.amount), 0) FROM Loan l WHERE l.status = com.agrifinance.backend.model.enums.LoanStatus.APPROVED")
    Double getTotalApprovedLoanAmount();
    
    @Query("SELECT COUNT(l) FROM Loan l WHERE l.status = :status")
    long countByStatus(@Param("status") LoanStatus status);
}
