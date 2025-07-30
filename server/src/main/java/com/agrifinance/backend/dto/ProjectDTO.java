package com.agrifinance.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProjectDTO {
    private String id;
    private String userId;
    private String name;
    private String description;
    private String status;
    private String type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ProjectGoalDTO> goals;
}
