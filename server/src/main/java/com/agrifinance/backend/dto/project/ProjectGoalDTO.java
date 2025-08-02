package com.agrifinance.backend.dto.project;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

import com.agrifinance.backend.model.enums.GoalStatus;

@Data
public class ProjectGoalDTO {
    private String id;
    private String name;
    private String description;
    private GoalStatus status;
    private List<GoalTaskDTO> tasks;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
