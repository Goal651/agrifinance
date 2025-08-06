package com.agrifinance.backend.controller.auth;

import com.agrifinance.backend.dto.common.ApiResponse;
import com.agrifinance.backend.dto.auth.AuthRequest;
import com.agrifinance.backend.dto.auth.AuthResponse;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.repository.UserRepository;
import com.agrifinance.backend.security.jwt.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        System.out.println("Testing the system"+request);
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.ok(new ApiResponse<>(false, null, "Invalid credentials"));
        }
        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        System.out.println("Generated Token: " + token);
        return ResponseEntity.ok(
                new ApiResponse<>(true,
                        new AuthResponse(token, user.getRole().name(), user.getId().toString()), "Login successful"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT is stateless; logout is handled on client side by deleting token
        return ResponseEntity.ok("Logged out successfully");
    }
}
