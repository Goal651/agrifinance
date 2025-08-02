package com.agrifinance.backend.controller.project;

import com.agrifinance.backend.dto.common.ApiResponse;
import com.agrifinance.backend.dto.project.GoalRequest;
import com.agrifinance.backend.dto.project.ProjectDTO;
import com.agrifinance.backend.dto.project.ProjectRequest;
import com.agrifinance.backend.dto.project.TaskRequest;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.service.project.ProjectService;
import com.agrifinance.backend.service.user.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDTO>>> getProjects(Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        List<ProjectDTO> projectDTOs = projectService.getProjects(user.getId());
        ApiResponse<List<ProjectDTO>> apiResponse = new ApiResponse<>(true, projectDTOs, "Project loaded successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDTO>> getProjectById(@PathVariable String id) {
        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, null, "Invalid project ID"));
        }
        ProjectDTO projectDTO = projectService.getProjectById(UUID.fromString(id));
        ApiResponse<ProjectDTO> apiResponse = new ApiResponse<>(true, projectDTO, "Project loaded successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDTO>> createProject(@RequestBody ProjectRequest projectDTO,
            Principal principal) {
        System.out.println(projectDTO);
        ProjectDTO savedProjectDTO = projectService.createNewProject(projectDTO, principal.getName());
        ApiResponse<ProjectDTO> apiResponse = new ApiResponse<>(true, savedProjectDTO, "Project created successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/goal")
    public ResponseEntity<ApiResponse<ProjectDTO>> createProjectGoal(@RequestBody GoalRequest goalRequest) {
        ProjectDTO savedProjectDTO = projectService.createNewGoal(goalRequest);
        ApiResponse<ProjectDTO> apiResponse = new ApiResponse<>(true, savedProjectDTO, "Project created successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/task")
    public ResponseEntity<ApiResponse<Void>> createGoalTask(@RequestBody TaskRequest taskRequest) {
        projectService.createNewTask(taskRequest);
        ApiResponse<Void> apiResponse = new ApiResponse<>(true, null, "Project created successfully");
        return ResponseEntity.ok(apiResponse);
    }

}
