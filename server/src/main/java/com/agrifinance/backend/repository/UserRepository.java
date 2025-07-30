package com.agrifinance.backend.repository;

import com.agrifinance.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE (:status IS NULL OR u.status = :status) AND (:farmType IS NULL OR u.farmType = :farmType) AND (:search IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.phone) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> searchUsers(@Param("status") String status, @Param("farmType") String farmType, @Param("search") String search, Pageable pageable);
}
