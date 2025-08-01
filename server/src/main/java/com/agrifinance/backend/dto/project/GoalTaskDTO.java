package com.agrifinance.backend.dto.project;

import java.time.LocalDateTime;
import java.util.UUID;

import com.agrifinance.backend.model.enums.TaskStatus;

import lombok.Data;

@Data
public class GoalTaskDTO {
    private UUID id;
    private String title;
    private String description;
    private TaskStatus status = TaskStatus.NOT_STARTED; 
    private Integer priority;
    private LocalDateTime dueDate;
    private LocalDateTime completedAt;
}
