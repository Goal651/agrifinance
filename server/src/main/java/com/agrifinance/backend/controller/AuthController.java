package com.agrifinance.backend.controller;

import com.agrifinance.backend.dto.ApiResponse;
import com.agrifinance.backend.dto.AuthRequest;
import com.agrifinance.backend.dto.AuthResponse;
import com.agrifinance.backend.model.Role;
import com.agrifinance.backend.model.User;
import com.agrifinance.backend.repository.UserRepository;
import com.agrifinance.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody AuthRequest request) {
        System.out.println("Testing the system");
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())
                || userOpt.get().getRole() != Role.USER) {
            return ResponseEntity.ok(new ApiResponse<>(false, null, "Invalid credentials"));
        }
        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        System.out.println("Generated Token: " + token);
        return ResponseEntity.ok(
                new ApiResponse<>(true,
                        new AuthResponse(token, user.getRole().name(), user.getId().toString()), "Login successful"));
    }

    @PostMapping("/admin-login")
    public ResponseEntity<?> adminLogin(@RequestBody AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())
                || userOpt.get().getRole() != Role.ADMIN) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), user.getId().toString()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT is stateless; logout is handled on client side by deleting token
        return ResponseEntity.ok("Logged out successfully");
    }
}
