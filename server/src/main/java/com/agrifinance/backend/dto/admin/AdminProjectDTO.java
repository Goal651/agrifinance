package com.agrifinance.backend.dto.admin;

import com.agrifinance.backend.dto.project.ProjectDTO;

import lombok.Data;

@Data
public class AdminProjectDTO extends ProjectDTO {
    private Integer progress;
}
