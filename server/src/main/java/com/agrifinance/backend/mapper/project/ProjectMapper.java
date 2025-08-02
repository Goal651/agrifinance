package com.agrifinance.backend.mapper.project;

import java.util.List;

import org.mapstruct.Mapper;

import com.agrifinance.backend.dto.project.ProjectDTO;
import com.agrifinance.backend.model.project.Project;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    ProjectDTO toDTO(Project project);
    Project toEntity(ProjectDTO projectDTO);

    List<ProjectDTO> toDTOs(List<Project> projects);
    List<Project> toEntities(List<ProjectDTO> projectDTOs);    
}
