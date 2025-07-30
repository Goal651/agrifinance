package com.agrifinance.backend.dto;

import lombok.Data;

@Data
public class ProjectGoalDTO {
    private String id;
    private String name;
    private String description;
    private String status;
    private String priority;
}
