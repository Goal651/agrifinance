package com.agrifinance.backend.dto.project;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ProjectRequest {
    private String name;
    private String description;
    private LocalDateTime targetDate;
}
