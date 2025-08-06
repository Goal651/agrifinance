package com.agrifinance.backend.repository;

import com.agrifinance.backend.model.project.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface GoalRepository extends JpaRepository<Goal, UUID> {
    @Query("SELECT g FROM Goal g JOIN g.tasks t WHERE t.id = :taskId")
    Goal findByTaskId(@Param("taskId") UUID taskId);
}
