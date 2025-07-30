package com.agrifinance.backend.controller.loan;

import com.agrifinance.backend.dto.common.ApiResponse;
import com.agrifinance.backend.dto.loan.LoanDTO;
import com.agrifinance.backend.service.loan.LoanService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/loans")
@RequiredArgsConstructor
@Tag(name = "Admin Loans")
public class AdminLoanController {
    private final LoanService loanService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<LoanDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Double minAmount,
            @RequestParam(required = false) Double maxAmount
    ) {
        Page<LoanDTO> data = loanService.getAllLoans(page, limit, status, type, minAmount, maxAmount);
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Loans fetched successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LoanDTO>> getById(@PathVariable UUID id) {
        LoanDTO data = loanService.getLoanById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Loan fetched successfully"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanDTO> updateStatus(@PathVariable UUID id, @RequestParam String status) {
        return ResponseEntity.ok(loanService.updateLoanStatus(id, status));
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(loanService.getLoanSummary());
    }
}
