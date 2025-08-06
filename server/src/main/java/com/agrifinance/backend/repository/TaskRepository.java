package com.agrifinance.backend.repository;

import com.agrifinance.backend.model.project.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

}