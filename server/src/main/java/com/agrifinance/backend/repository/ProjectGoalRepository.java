package com.agrifinance.backend.repository;

import com.agrifinance.backend.model.ProjectGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectGoalRepository extends JpaRepository<ProjectGoal, UUID> {
    List<ProjectGoal> findByProjectId(UUID projectId);
}
