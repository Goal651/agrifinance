package com.agrifinance.backend.mapper.loan;

import org.mapstruct.Mapper;

import com.agrifinance.backend.dto.loan.PersonalInfoDTO;
import com.agrifinance.backend.model.loan.PersonalInfo;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PersonalInfoMapper {
    PersonalInfoDTO toDTO(PersonalInfo personalInfo);

    PersonalInfo toEntity(PersonalInfoDTO personalInfoDTO);

    List<PersonalInfoDTO> toDTOs(List<PersonalInfo> personalInfos);

    List<PersonalInfo> toEntities(List<PersonalInfoDTO> personalInfoDTOs);

}