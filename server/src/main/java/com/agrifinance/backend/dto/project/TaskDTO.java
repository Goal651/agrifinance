package com.agrifinance.backend.dto.project;

import java.time.LocalDateTime;

import com.agrifinance.backend.dto.worker.WorkerDTO;
import com.agrifinance.backend.model.enums.TaskStatus;

import lombok.Data;

@Data
public class TaskDTO {
    private String id;
    private String name;
    private String description;
    private TaskStatus status;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private WorkerDTO worker;
}
