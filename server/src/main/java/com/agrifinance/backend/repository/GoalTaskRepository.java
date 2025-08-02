package com.agrifinance.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agrifinance.backend.model.project.GoalTask;

public interface GoalTaskRepository extends JpaRepository<GoalTask, UUID> {

}