package com.agrifinance.backend.dto.project;

import lombok.Data;

@Data
public class GoalRequest {
    private String name;
    private String description;
    private ProjectDTO project;

}
