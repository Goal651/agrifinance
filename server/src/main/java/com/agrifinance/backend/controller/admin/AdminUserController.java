package com.agrifinance.backend.controller.admin;

import com.agrifinance.backend.dto.common.ApiResponse;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.repository.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin Users")
public class AdminUserController {
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status
    ) {
        Map<String, Object> resp = new HashMap<>();
        Map<String, Object> meta = new HashMap<>();
        meta.put("page", page);
        meta.put("limit", limit);
        resp.put("meta", meta);
        return ResponseEntity.ok(new ApiResponse<>(true, resp, "Users fetched successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> getById(@PathVariable UUID id) {
        return ResponseEntity.of(userRepository.findById(id).map(user -> new ApiResponse<>(true, user, "User fetched successfully")));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> create(@RequestBody User user) {
        return ResponseEntity.ok(new ApiResponse<>(true, userRepository.save(user), "User created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> update(@PathVariable UUID id, @RequestBody User user) {
        Optional<User> existing = userRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();
        user.setId(id);
        return ResponseEntity.ok(new ApiResponse<>(true, userRepository.save(user), "User updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> updateStatus(@PathVariable UUID id, @RequestParam String status) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        User user = userOpt.get();
        user.setStatus(status);
        return ResponseEntity.ok(new ApiResponse<>(true, userRepository.save(user), "User status updated successfully"));
    }
}
