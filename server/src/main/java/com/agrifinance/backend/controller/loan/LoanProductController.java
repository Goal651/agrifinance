package com.agrifinance.backend.controller.loan;

import com.agrifinance.backend.model.loan.LoanProduct;
import com.agrifinance.backend.service.loan.LoanProductService;
import com.agrifinance.backend.dto.common.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/loan-products")
public class LoanProductController {
    @Autowired
    private LoanProductService loanProductService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LoanProduct>>> getAllLoanProducts() {
        List<LoanProduct> data = loanProductService.getAllLoanProducts();
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Loan products fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanProduct>> getLoanProductById(@PathVariable UUID id) {
        Optional<LoanProduct> loanProduct = loanProductService.getLoanProductById(id);
        if (loanProduct.isPresent()) {
            return ResponseEntity.ok(new ApiResponse<>(true, loanProduct.get(), "Loan product found"));
        } else {
            return ResponseEntity.ok(new ApiResponse<>(false, null, "Loan product not found"));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LoanProduct>> createLoanProduct(@RequestBody LoanProduct loanProduct) {
        LoanProduct data = loanProductService.createLoanProduct(loanProduct);
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Loan product created successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLoanProduct(@PathVariable UUID id) {
        loanProductService.deleteLoanProduct(id);
        return ResponseEntity.ok(new ApiResponse<>(true, null, "Loan product deleted successfully"));
    }
}
