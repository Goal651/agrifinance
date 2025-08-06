package com.agrifinance.backend.dto.project;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ProjectDashboardDTO {
    private Integer active = 0;
    private Integer total = 0;
    private Integer completed = 0;
    private List<ProjectDTO> activeProjects = new ArrayList<>();
}
