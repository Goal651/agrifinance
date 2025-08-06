package com.agrifinance.backend.dto.admin;

import com.agrifinance.backend.dto.project.ProjectDTO;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class AdminProjectDTO extends ProjectDTO {
    private Integer progress;
}
