package com.agrifinance.backend.controller;

import com.agrifinance.backend.dto.ProjectDTO;
import com.agrifinance.backend.service.ProjectService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/projects")
@RequiredArgsConstructor
@Tag(name = "Admin Projects")
public class AdminProjectController {
    private final ProjectService projectService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ProjectDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String projectType,
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(projectService.getAllProjects(page, limit, projectType, userId, status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectDTO> update(@PathVariable UUID id, @RequestBody ProjectDTO dto) {
        return ResponseEntity.ok(projectService.updateProject(id, dto));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectDTO> updateStatus(@PathVariable UUID id, @RequestParam String status) {
        return ResponseEntity.ok(projectService.updateProjectStatus(id, status));
    }
}
