package com.agrifinance.backend.controller;

import com.agrifinance.backend.service.LoanService;
import com.agrifinance.backend.service.ProjectService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Dashboard")
public class AdminDashboardController {
    private final LoanService loanService;
    private final ProjectService projectService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> dashboard = Map.of(
            "loanSummary", loanService.getLoanSummary(),
            "projectSummary", projectService.getProjectAnalytics(null)
        );
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/analytics/loans")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getLoanAnalytics() {
        return ResponseEntity.ok(loanService.getLoanSummary());
    }

    @GetMapping("/analytics/projects")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getProjectAnalytics() {
        return ResponseEntity.ok(projectService.getProjectAnalytics(null));
    }
}
