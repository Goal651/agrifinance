package com.agrifinance.backend.mapper.project;

import java.util.List;

import org.mapstruct.Mapper;

import com.agrifinance.backend.dto.worker.WorkerDTO;
import com.agrifinance.backend.model.project.Worker;

@Mapper(componentModel = "spring")
public interface WorkerMapper {
    WorkerDTO toDTO(Worker worker);

    Worker toEntity(WorkerDTO workerDTO);

    List<WorkerDTO> toDTOs(List<Worker> workers);

    List<Worker> toEntities(List<WorkerDTO> workerDTOs);

}
