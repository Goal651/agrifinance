package com.agrifinance.backend.mapper.loan;

import org.mapstruct.Mapper;

import com.agrifinance.backend.dto.loan.LoanPaymentDTO;
import com.agrifinance.backend.model.loan.LoanPayment;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LoanPaymentMapper { 
    LoanPaymentDTO toDTO(LoanPayment loanPayment);
    LoanPayment toEntity(LoanPaymentDTO loanPaymentDTO);

    List<LoanPaymentDTO> toDTOs(List<LoanPayment> loanPayments);
    List<LoanPayment> toEntities(List<LoanPaymentDTO> loanPaymentDTOs);

}