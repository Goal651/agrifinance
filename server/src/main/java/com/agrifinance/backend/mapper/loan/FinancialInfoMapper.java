package com.agrifinance.backend.mapper.loan;

import org.mapstruct.Mapper;

import com.agrifinance.backend.dto.loan.FinancialInfoDTO;
import com.agrifinance.backend.model.loan.FinancialInfo;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FinancialInfoMapper {
    FinancialInfoDTO toDTO(FinancialInfo financialInfo);

    FinancialInfo toEntity(FinancialInfoDTO financialInfoDTO);

    List<FinancialInfoDTO> toDTOs(List<FinancialInfo> financialInfos);

    List<FinancialInfo> toEntities(List<FinancialInfoDTO> financialInfoDTOs);

}