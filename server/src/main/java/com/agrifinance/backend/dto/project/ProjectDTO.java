package com.agrifinance.backend.dto.project;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

import com.agrifinance.backend.dto.user.UserDTO;
import com.agrifinance.backend.model.enums.ProjectStatus;

@Data
public class ProjectDTO {
    private String id;
    private UserDTO user;
    private String name;
    private String description;
    private ProjectStatus status;
    private List<GoalDTO> goals;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime targetDate;
    private LocalDateTime completedAt;
}
