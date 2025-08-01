package com.agrifinance.backend.dto.project;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.agrifinance.backend.model.enums.GoalStatus;

@Data
public class ProjectGoalDTO {
    private UUID id;
    private String name;
    private String description;
    private GoalStatus status;
    private List<GoalTaskDTO> tasks;
    private LocalDateTime dueDate;
    private LocalDateTime completedAt;
}
