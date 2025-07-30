package com.agrifinance.backend.controller;

import com.agrifinance.backend.dto.LoanDTO;
import com.agrifinance.backend.dto.LoanPaymentDTO;
import com.agrifinance.backend.dto.ApiResponse;
import com.agrifinance.backend.security.JwtUtil;
import com.agrifinance.backend.service.LoanService;
import com.agrifinance.backend.dto.LoanRequest;
import org.springframework.beans.factory.annotation.Autowired;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@Tag(name = "Loans")
public class LoanController {
    private final LoanService loanService;
    private final JwtUtil jwtUtil;

    private UUID getUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return UUID.fromString(jwtUtil.getClaims(token).get("userId", String.class));
    }

    @GetMapping("/overview")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<LoanDTO>> getOverview(HttpServletRequest request) {
        LoanDTO data = loanService.getLoanOverview(getUserId(request));
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Loan overview fetched successfully"));
    }

    @GetMapping("/payments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<LoanPaymentDTO>>> getPayments(HttpServletRequest request) {
        List<LoanPaymentDTO> data = loanService.getLoanPayments(getUserId(request));
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Loan payments fetched successfully"));
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<LoanDTO>>> getHistory(HttpServletRequest request) {
        List<LoanDTO> data = loanService.getLoanHistory(getUserId(request));
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Loan history fetched successfully"));
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics(HttpServletRequest request) {
        Map<String, Object> data = loanService.getLoanAnalytics(getUserId(request));
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Loan analytics fetched successfully"));
    }

    @PostMapping("/apply")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<LoanDTO>> apply(HttpServletRequest request, @RequestBody LoanRequest dto) {
        System.out.println("Testing"+dto);
        LoanDTO data = loanService.applyForLoan(getUserId(request), dto);
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Loan application submitted successfully"));
    }

    @GetMapping("/current")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<LoanDTO>> getCurrentLoan(HttpServletRequest request) {
        LoanDTO currentLoan = loanService.getCurrentLoan(getUserId(request));
        if (currentLoan == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, null, "No current loan found"));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, currentLoan, "Current loan fetched successfully"));
    }
}
