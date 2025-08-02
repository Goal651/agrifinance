package com.agrifinance.backend.repository;

import com.agrifinance.backend.model.project.ProjectGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProjectGoalRepository extends JpaRepository<ProjectGoal, UUID> {
    
}
