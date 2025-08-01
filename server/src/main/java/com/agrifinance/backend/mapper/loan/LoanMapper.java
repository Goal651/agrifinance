package com.agrifinance.backend.mapper.loan;

import org.mapstruct.Mapper;

import com.agrifinance.backend.dto.loan.LoanDTO;
import com.agrifinance.backend.model.loan.Loan;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LoanMapper {
    LoanDTO toDTO(Loan loan);

    Loan toEntity(LoanDTO loanDTO);

    List<LoanDTO> toDTOs(List<Loan> loans);

    List<Loan> toEntities(List<LoanDTO> loanDTOs);

}