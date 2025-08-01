package com.agrifinance.backend.dto.project;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.agrifinance.backend.dto.user.UserDTO;
import com.agrifinance.backend.model.enums.ProjectStatus;

@Data
public class ProjectDTO {
    private UUID id;
    private UserDTO user;
    private String name;
    private String description;
    private ProjectStatus status;
    private List<ProjectGoalDTO> goals;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime targetDate;
    private LocalDateTime completedAt;
}
