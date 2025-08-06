package com.agrifinance.backend.dto.loan;

import com.agrifinance.backend.dto.user.UserDTO;
import com.agrifinance.backend.model.enums.LoanStatus;
import com.agrifinance.backend.model.loan.LoanInfo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class LoanDTO {
    private String id;
    private UserDTO user;
    private String purpose;
    private LoanStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Double paidAmount;
    
    // Loan Details
    private LoanProductDTO details;
    private LoanInfo info;
    
    
    private List<LoanPaymentDTO> payments;
}
