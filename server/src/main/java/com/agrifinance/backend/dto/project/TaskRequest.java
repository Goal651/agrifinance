package com.agrifinance.backend.dto.project;

import com.agrifinance.backend.dto.worker.WorkerDTO;

import lombok.Data;

@Data
public class TaskRequest {
    private String name;
    private String description;
    private GoalDTO goal;   
    private WorkerDTO worker;
}
