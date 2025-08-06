package com.agrifinance.backend.service.loan;

import com.agrifinance.backend.dto.loan.LoanProductDTO;
import com.agrifinance.backend.mapper.loan.LoanProductMapper;
import com.agrifinance.backend.model.loan.LoanProduct;
import com.agrifinance.backend.repository.LoanProductRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LoanProductService {
    private final LoanProductRepository loanProductRepository;
    private final LoanProductMapper loanProductMapper;

    public List<LoanProductDTO> getAllLoanProducts() {
        return loanProductMapper.toDTOs(loanProductRepository.findAll());
    }

    public LoanProductDTO getLoanProductById(UUID id) {
        return loanProductMapper.toDTO(loanProductRepository.findById(id).orElseThrow());
    }

    public LoanProductDTO createLoanProduct(LoanProductDTO loanProduct) {
        LoanProduct result = loanProductMapper.toEntity(loanProduct);
        return loanProductMapper.toDTO(loanProductRepository.save(result));
    }

    public void deleteLoanProduct(UUID id) {
        loanProductRepository.deleteById(id);
    }
}
