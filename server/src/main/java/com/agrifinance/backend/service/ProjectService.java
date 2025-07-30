package com.agrifinance.backend.service;

import com.agrifinance.backend.dto.ProjectDTO;
import com.agrifinance.backend.dto.ProjectGoalDTO;
import com.agrifinance.backend.model.Project;
import com.agrifinance.backend.model.ProjectGoal;
import com.agrifinance.backend.model.User;
import com.agrifinance.backend.repository.ProjectRepository;
import com.agrifinance.backend.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    // Manual mapping methods
    private ProjectDTO toDto(Project project) {
        if (project == null) return null;
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId() != null ? project.getId().toString() : null);
        dto.setUserId(project.getUser() != null ? project.getUser().getId().toString() : null);
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus());
        dto.setType(project.getType());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        if (project.getGoals() != null) {
            dto.setGoals(project.getGoals().stream().map(this::toDto).toList());
        }
        return dto;
    }
    public List<ProjectDTO> toDtoList(List<Project> projects) {
        return projects.stream().map(this::toDto).toList();
    }

    private Project toEntity(ProjectDTO dto) {
        if (dto == null) return null;
        Project project = new Project();
        if (dto.getId() != null) project.setId(UUID.fromString(dto.getId()));
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStatus(dto.getStatus());
        project.setType(dto.getType());
        project.setCreatedAt(dto.getCreatedAt());
        project.setUpdatedAt(dto.getUpdatedAt());
        // user and goals set elsewhere
        return project;
    }
    private ProjectGoalDTO toDto(ProjectGoal goal) {
        if (goal == null) return null;
        ProjectGoalDTO dto = new ProjectGoalDTO();
        dto.setId(goal.getId() != null ? goal.getId().toString() : null);
        dto.setName(goal.getName());
        dto.setDescription(goal.getDescription());
        dto.setStatus(goal.getStatus());
        dto.setPriority(goal.getPriority());
        return dto;
    }
    private List<ProjectGoalDTO> toDtoListGoals(List<ProjectGoal> goals) {
        return goals.stream().map(this::toDto).toList();
    }

    // User Endpoints
    public ProjectDTO getProjectOverview(UUID userId) {
        List<Project> projects = projectRepository.findByUserId(userId);
        return projects.isEmpty() ? null : toDto(projects.get(projects.size() - 1));
    }
    public List<ProjectDTO> getProjects(UUID userId, String status, String search) {
        List<Project> projects = projectRepository.findByUserId(userId);
        return projects.stream()
                .filter(p -> status == null || status.equals(p.getStatus()))
                .filter(p -> search == null || p.getName().toLowerCase().contains(search.toLowerCase()))
                .map(this::toDto)
                .toList();
    }
    public List<ProjectGoalDTO> getProjectGoals(UUID userId, String status, String priority) {
        List<Project> projects = projectRepository.findByUserId(userId);
        List<ProjectGoal> goals = projects.stream()
                .flatMap(p -> p.getGoals().stream())
                .filter(g -> (status == null || status.equals(g.getStatus())) && (priority == null || priority.equals(g.getPriority())))
                .toList();
        return toDtoListGoals(goals);
    }
    public Map<String, Object> getProjectAnalytics(UUID userId) {
        List<Project> projects = projectRepository.findByUserId(userId);
        long active = projects.stream().filter(p -> "ACTIVE".equals(p.getStatus())).count();
        long completed = projects.stream().filter(p -> "COMPLETED".equals(p.getStatus())).count();
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("activeCount", active);
        analytics.put("completedCount", completed);
        analytics.put("totalProjects", projects.size());
        return analytics;
    }
    public ProjectDTO createProject(UUID userId, ProjectDTO dto) {
        User user = userRepository.findById(userId).orElseThrow();
        Project project = toEntity(dto);
        project.setId(null);
        project.setUser(user);
        project.setStatus("ACTIVE");
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        project = projectRepository.save(project);
        return toDto(project);
    }
    // Admin Endpoints
    public Page<ProjectDTO> getAllProjects(int page, int limit, String projectType, UUID userId, String status) {
        Pageable pageable = PageRequest.of(page, limit);
        Specification<Project> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (projectType != null) predicates.add(cb.equal(root.get("type"), projectType));
            if (userId != null) predicates.add(cb.equal(root.get("user").get("id"), userId));
            if (status != null) predicates.add(cb.equal(root.get("status"), status));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return projectRepository.findAll(spec, pageable).map(this::toDto);
    }
    public ProjectDTO getProjectById(UUID projectId) {
        return toDto(projectRepository.findById(projectId).orElseThrow());
    }
    public ProjectDTO getProjectById(UUID userId, String id) {
        Project project = projectRepository.findById(UUID.fromString(id)).orElseThrow();
        if (!project.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to project");
        }
        return toDto(project);
    }
    public ProjectDTO updateProject(UUID projectId, ProjectDTO dto) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setType(dto.getType());
        project.setUpdatedAt(LocalDateTime.now());
        return toDto(projectRepository.save(project));
    }
    public ProjectDTO updateProject(UUID userId, String id, ProjectDTO dto) {
        Project project = projectRepository.findById(UUID.fromString(id)).orElseThrow();
        if (!project.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to project");
        }
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setType(dto.getType());
        project.setStatus(dto.getStatus());
        project.setUpdatedAt(LocalDateTime.now());
        return toDto(projectRepository.save(project));
    }
    public ProjectDTO updateProjectStatus(UUID projectId, String status) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        project.setStatus(status);
        project.setUpdatedAt(LocalDateTime.now());
        return toDto(projectRepository.save(project));
    }
    public void deleteProject(UUID userId, String id) {
        Project project = projectRepository.findById(UUID.fromString(id)).orElseThrow();
        if (!project.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to project");
        }
        projectRepository.delete(project);
    }
}
