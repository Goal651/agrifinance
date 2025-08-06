package com.agrifinance.backend.mapper.project;

import java.util.List;

import org.mapstruct.Mapper;

import com.agrifinance.backend.dto.project.TaskDTO;
import com.agrifinance.backend.model.project.Task;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    TaskDTO toDTO(Task task);
    Task toEntity(TaskDTO taskDTO);

    List<TaskDTO> toDTOs(List<Task> tasks);
    List<Task> toEntities(List<TaskDTO> taskDTOs);
    
}
