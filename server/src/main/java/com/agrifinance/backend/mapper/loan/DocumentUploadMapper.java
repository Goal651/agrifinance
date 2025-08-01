package com.agrifinance.backend.mapper.loan;

import org.mapstruct.Mapper;

import com.agrifinance.backend.dto.loan.DocumentUploadDTO;
import com.agrifinance.backend.model.loan.DocumentUpload;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DocumentUploadMapper {
    DocumentUploadDTO toDTO(DocumentUpload documentUpload);

    DocumentUpload toEntity(DocumentUploadDTO documentUploadDTO);

    List<DocumentUploadDTO> toDTOs(List<DocumentUpload> documentUploads);

    List<DocumentUpload> toEntities(List<DocumentUploadDTO> documentUploadDTOs);

}
