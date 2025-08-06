package com.agrifinance.backend.controller.loan;

import com.agrifinance.backend.dto.common.ApiResponse;
import com.agrifinance.backend.dto.loan.LoanDTO;
import com.agrifinance.backend.dto.loan.LoanRequest;
import com.agrifinance.backend.dto.loan.PaymentRequest;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.service.loan.LoanService;
import com.agrifinance.backend.service.user.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {
    private final LoanService loanService;
    private final UserService userService;

    private UUID getUserId(Principal principal) {
        String token = principal.getName();
        User user = userService.getUserByEmail(token);
        System.out.println(user);
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LoanDTO>>> getHistory(Principal principal) {
        List<LoanDTO> data = loanService.getLoanHistory(getUserId(principal));
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Loan history fetched successfully"));
    }

    @GetMapping("/analytics")   
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics(Principal principal) {
        Map<String, Object> data = loanService.getLoanAnalytics(getUserId(principal));
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Loan analytics fetched successfully"));
    }

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<LoanDTO>> apply(Principal principal,@Valid @RequestBody LoanRequest dto) {
        LoanDTO data = loanService.applyForLoan(getUserId(principal), dto);
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Loan application submitted successfully"));
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<LoanDTO>> getCurrentLoan(Principal principal) {
        System.out.println("This si test"+getUserId(principal));
        LoanDTO currentLoan = loanService.getCurrentLoan(getUserId(principal));
        if (currentLoan == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, null, "No current loan found"));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, currentLoan, "Current loan fetched successfully"));
    }

    @PostMapping("/payment")
    public ResponseEntity<ApiResponse<LoanDTO>> makePayment(Principal principal,@Valid @RequestBody PaymentRequest paymentRequest) {
        LoanDTO data = loanService.makePayment(getUserId(principal), paymentRequest.getAmount());
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Payment processed successfully"));
    }
}
