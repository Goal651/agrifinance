package com.agrifinance.backend.dto.project;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProjectGoalDTO {
    private String id;
    private String name;
    private String description;
    private String status;
    private String priority;
    private LocalDateTime targetDate;
}
