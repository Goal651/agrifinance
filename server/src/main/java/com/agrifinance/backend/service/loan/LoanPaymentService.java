package com.agrifinance.backend.service.loan;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.agrifinance.backend.dto.loan.LoanPaymentDTO;
import com.agrifinance.backend.mapper.loan.LoanPaymentMapper;
import com.agrifinance.backend.model.loan.LoanPayment;
import com.agrifinance.backend.repository.LoanPaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoanPaymentService {
    private final LoanPaymentRepository loanPaymentRepository;
    private final LoanPaymentMapper loanPaymentMapper;

    public List<LoanPayment> findAllPayments(UUID loanId) {

        return loanPaymentRepository.findByLoanId(loanId);
    }

    public List<LoanPaymentDTO> getAllPayments(UUID loanId) {
        return loanPaymentMapper.toDTOs(loanPaymentRepository.findByLoanId(loanId));
    }

    public LoanPayment save(LoanPayment loanPayment) {
        return loanPaymentRepository.save(loanPayment);
    }
}
