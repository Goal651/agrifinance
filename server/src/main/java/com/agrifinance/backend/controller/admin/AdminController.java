package com.agrifinance.backend.controller.admin;

import com.agrifinance.backend.dto.admin.AdminProjectDTO;
import com.agrifinance.backend.dto.common.ApiResponse;
import com.agrifinance.backend.dto.loan.LoanDTO;
import com.agrifinance.backend.dto.loan.LoanProductDTO;
import com.agrifinance.backend.dto.user.UserDTO;
import com.agrifinance.backend.service.admin.AdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = adminService.getAllUsers();
        ApiResponse<List<UserDTO>> apiResponse = new ApiResponse<>(true, users, "User loaded successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<AdminProjectDTO>>> getAllProjects() {
        List<AdminProjectDTO> projects = adminService.getAllProjects();
        ApiResponse<List<AdminProjectDTO>> apiResponse = new ApiResponse<>(true, projects, "User loaded successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/loans")
    public ResponseEntity<ApiResponse<List<LoanDTO>>> getAllLoans() {
        List<LoanDTO> loans = adminService.getAllLoans();
        ApiResponse<List<LoanDTO>> apiResponse = new ApiResponse<>(true, loans, "Loans loaded successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/loan-products")
    public ResponseEntity<ApiResponse<List<LoanProductDTO>>> getAllLoanProducts() {
        List<LoanProductDTO> products = adminService.getAllLoanProducts();
        ApiResponse<List<LoanProductDTO>> apiResponse = new ApiResponse<>(true, products, "Loan products loaded successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/loan-products/{id}")
    public ResponseEntity<ApiResponse<LoanProductDTO>> getLoanProductById(@PathVariable String id) {
        LoanProductDTO product = adminService.getLoanProductById(UUID.fromString(id));
        ApiResponse<LoanProductDTO> apiResponse = new ApiResponse<>(true, product, "Loan product loaded successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/loan-products")
    public ResponseEntity<ApiResponse<LoanProductDTO>> addLoanProduct(@Valid @RequestBody LoanProductDTO loanProductDTO) {
        LoanProductDTO savedLoanProduct = adminService.addLoanProduct(loanProductDTO);
        ApiResponse<LoanProductDTO> apiResponse = new ApiResponse<>(true, savedLoanProduct, "Loan product added successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/loans/approve/{id}")
    public ResponseEntity<ApiResponse<LoanDTO>> approveLoan(@PathVariable String id) {
        LoanDTO updatedLoan = adminService.approveLoan(UUID.fromString(id));
        ApiResponse<LoanDTO> apiResponse = new ApiResponse<>(true, updatedLoan, "Loan updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/loans/reject/{id}")
    public ResponseEntity<ApiResponse<LoanDTO>> rejectLoan(@PathVariable String id) {
        LoanDTO updatedLoan = adminService.rejectLoan(UUID.fromString(id));
        ApiResponse<LoanDTO> apiResponse = new ApiResponse<>(true, updatedLoan, "Loan rejected successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/loan-products/{id}")
    public ResponseEntity<ApiResponse<LoanProductDTO>> updateLoanProduct(
            @PathVariable String id,
            @RequestBody LoanProductDTO loanProductDTO) {
        LoanProductDTO updatedProduct = adminService.updateLoanProduct(UUID.fromString(id), loanProductDTO);
        ApiResponse<LoanProductDTO> apiResponse = new ApiResponse<>(true, updatedProduct, "Loan product updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/loan-products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLoanProduct(@PathVariable String id) {
        adminService.deleteLoanProduct(UUID.fromString(id));
        ApiResponse<Void> apiResponse = new ApiResponse<>(true, null, "Loan product deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
