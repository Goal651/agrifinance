package com.agrifinance.backend.controller.auth;

import com.agrifinance.backend.dto.common.ApiResponse;
import com.agrifinance.backend.dto.auth.AuthRequest;
import com.agrifinance.backend.dto.auth.AuthResponse;
import com.agrifinance.backend.dto.auth.SignupRequest;
import com.agrifinance.backend.model.user.Role;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.repository.UserRepository;
import com.agrifinance.backend.security.jwt.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

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
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
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
    public ResponseEntity<?> adminLogin(@Valid @RequestBody AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())
                || userOpt.get().getRole() != Role.ADMIN) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), user.getId().toString()));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody SignupRequest request) {

        
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, "Email address is already registered"));
        }
        
        // Create new user
        User newUser = User.builder()
                .id(UUID.randomUUID())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .status("ACTIVE")
                .build();
        
        // Save user to database
        User savedUser = userRepository.save(newUser);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole().name(), savedUser.getId());
        
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                new AuthResponse(token, savedUser.getRole().name(), savedUser.getId().toString()),
                "User registered successfully"
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT is stateless; logout is handled on client side by deleting token
        return ResponseEntity.ok("Logged out successfully");
    }
}
