package com.agrifinance.backend.dto.project;

import lombok.Data;

@Data
public class TaskRequest {

    private String name;
    private String description;
    private ProjectGoalDTO goal;
    
}
