package com.agrifinance.backend.mapper.project;

import java.util.List;

import org.mapstruct.Mapper;

import com.agrifinance.backend.dto.project.GoalDTO;
import com.agrifinance.backend.model.project.Goal;

@Mapper(componentModel = "spring")
public interface GoalMapper {
    GoalDTO toDTO(Goal goal);
    Goal toEntity(GoalDTO goalDTO);
    
    List<GoalDTO> toDTOs(List<Goal> goals);
    List<Goal> toEntities(List<GoalDTO> goalDTOs);
    
}
