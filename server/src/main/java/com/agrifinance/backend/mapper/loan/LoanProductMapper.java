package com.agrifinance.backend.mapper.loan;

import org.mapstruct.Mapper;

import com.agrifinance.backend.dto.loan.LoanProductDTO;
import com.agrifinance.backend.model.loan.LoanProduct;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LoanProductMapper {
    LoanProductDTO toDTO(LoanProduct loanProduct);

    LoanProduct toEntity(LoanProductDTO loanProductDTO);

    List<LoanProductDTO> toDTOs(List<LoanProduct> loanProducts);

    List<LoanProduct> toEntities(List<LoanProductDTO> loanProductDTOs);

}