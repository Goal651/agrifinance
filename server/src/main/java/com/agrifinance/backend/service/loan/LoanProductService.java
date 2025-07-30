package com.agrifinance.backend.service.loan;

import com.agrifinance.backend.model.loan.LoanProduct;
import com.agrifinance.backend.repository.LoanProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LoanProductService {
    @Autowired
    private LoanProductRepository loanProductRepository;

    public List<LoanProduct> getAllLoanProducts() {
        return loanProductRepository.findAll();
    }

    public Optional<LoanProduct> getLoanProductById(UUID id) {
        return loanProductRepository.findById(id);
    }

    public LoanProduct createLoanProduct(LoanProduct loanProduct) {
        return loanProductRepository.save(loanProduct);
    }

    public void deleteLoanProduct(UUID id) {
        loanProductRepository.deleteById(id);
    }
}
