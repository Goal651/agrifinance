package com.agrifinance.backend.controller.loan;

import com.agrifinance.backend.service.loan.LoanProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import com.agrifinance.backend.dto.common.ApiResponse;
import com.agrifinance.backend.dto.loan.LoanProductDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/loan-products")
@RequiredArgsConstructor
public class LoanProductController {
    private final LoanProductService loanProductService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LoanProductDTO>>> getAllLoanProducts() {
        List<LoanProductDTO> data = loanProductService.getAllLoanProducts();
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Loan products fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanProductDTO>> getLoanProductById(@PathVariable UUID id) {
        LoanProductDTO loanProduct = loanProductService.getLoanProductById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, loanProduct, "Loan product found"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LoanProductDTO>> createLoanProduct(@Valid @RequestBody LoanProductDTO loanProduct) {
        LoanProductDTO data = loanProductService.createLoanProduct(loanProduct);
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Loan product created successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLoanProduct(@PathVariable UUID id) {
        loanProductService.deleteLoanProduct(id);
        return ResponseEntity.ok(new ApiResponse<>(true, null, "Loan product deleted successfully"));
    }
}
