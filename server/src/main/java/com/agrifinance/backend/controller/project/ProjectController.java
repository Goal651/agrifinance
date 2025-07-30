package com.agrifinance.backend.controller.project;

import com.agrifinance.backend.dto.common.ApiResponse;
import com.agrifinance.backend.dto.project.ProjectDTO;
import com.agrifinance.backend.dto.project.ProjectGoalDTO;
import com.agrifinance.backend.security.jwt.JwtUtil;
import com.agrifinance.backend.service.project.ProjectService;
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
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects")
public class ProjectController {
    private final ProjectService projectService;
    private final JwtUtil jwtUtil;

    private UUID getUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return UUID.fromString(jwtUtil.getClaims(token).get("userId", String.class));
    }

    @GetMapping("/overview")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<ProjectDTO>> getOverview(HttpServletRequest request) {
        ProjectDTO data = projectService.getProjectOverview(getUserId(request));
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Project overview fetched successfully"));
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<ProjectDTO>>> getProjects(HttpServletRequest request,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String search) {
        List<ProjectDTO> data = projectService.getProjects(getUserId(request), status, search);
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Projects fetched successfully"));
    }

    @GetMapping("/goals")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<ProjectGoalDTO>>> getGoals(HttpServletRequest request,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String priority) {
        List<ProjectGoalDTO> data = projectService.getProjectGoals(getUserId(request), status, priority);
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Project goals fetched successfully"));
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics(HttpServletRequest request) {
        Map<String, Object> data = projectService.getProjectAnalytics(getUserId(request));
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Project analytics fetched successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<ProjectDTO>> getProjectById(HttpServletRequest request, @PathVariable("id") String id) {
        ProjectDTO data = projectService.getProjectById(getUserId(request), id);
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Project fetched successfully"));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<ProjectDTO>> create(HttpServletRequest request, @RequestBody ProjectDTO dto) {
        ProjectDTO data = projectService.createProject(getUserId(request), dto);
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Project created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<ProjectDTO>> update(HttpServletRequest request, @PathVariable("id") String id, @RequestBody ProjectDTO dto) {
        ProjectDTO data = projectService.updateProject(getUserId(request), id, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, data, "Project updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Void>> delete(HttpServletRequest request, @PathVariable("id") String id) {
        projectService.deleteProject(getUserId(request), id);
        return ResponseEntity.ok(new ApiResponse<>(true, null, "Project deleted successfully"));
    }
}
