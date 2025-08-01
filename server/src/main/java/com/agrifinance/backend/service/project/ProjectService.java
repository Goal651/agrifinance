package com.agrifinance.backend.service.project;

import com.agrifinance.backend.dto.project.ProjectDTO;
import com.agrifinance.backend.mapper.project.ProjectMapper;
import com.agrifinance.backend.model.enums.ProjectStatus;
import com.agrifinance.backend.model.project.Project;
import com.agrifinance.backend.model.user.User;
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
    private final ProjectMapper projectMapper;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository, ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMapper = projectMapper;
    }


    // User Endpoints
    public ProjectDTO getProjectOverview(UUID userId) {
        List<Project> projects = projectRepository.findByUserId(userId);
        return projects.isEmpty() ? null : projectMapper.toDTO(projects.get(projects.size() - 1));
    }
    public List<ProjectDTO> getProjects(UUID userId, String status, String search) {
        List<Project> projects = projectRepository.findByUserId(userId);
        return projects.stream()
                .filter(p -> status == null || status.equals(p.getStatus()))
                .filter(p -> search == null || p.getName().toLowerCase().contains(search.toLowerCase()))
                .map(projectMapper::toDTO)
                .toList();
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
        Project project = projectMapper.toEntity(dto);
        project.setId(null);
        project.setUser(user);
        project.setStatus(ProjectStatus.NOT_STARTED);
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        project = projectRepository.save(project);
        return projectMapper.toDTO(project);
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
        return projectRepository.findAll(spec, pageable).map(projectMapper::toDTO);
    }
    public ProjectDTO getProjectById(UUID projectId) {
        return projectMapper.toDTO(projectRepository.findById(projectId).orElseThrow());
    }
    public ProjectDTO getProjectById(UUID userId, String id) {
        Project project = projectRepository.findById(UUID.fromString(id)).orElseThrow();
        if (!project.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to project");
        }
        return projectMapper.toDTO(project);
    }
    public ProjectDTO updateProject(UUID projectId, ProjectDTO dto) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setUpdatedAt(LocalDateTime.now());
        return projectMapper.toDTO(projectRepository.save(project));
    }
    public ProjectDTO updateProject(UUID userId, String id, ProjectDTO dto) {
        Project project = projectRepository.findById(UUID.fromString(id)).orElseThrow();
        if (!project.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to project");
        }
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStatus(dto.getStatus());
        project.setUpdatedAt(LocalDateTime.now());
        return projectMapper.toDTO(projectRepository.save(project));
    }
    public ProjectDTO updateProjectStatus(UUID projectId, ProjectStatus status) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        project.setStatus(status);
        project.setUpdatedAt(LocalDateTime.now());
        return projectMapper.toDTO(projectRepository.save(project));
    }
    public void deleteProject(UUID userId, String id) {
        Project project = projectRepository.findById(UUID.fromString(id)).orElseThrow();
        if (!project.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to project");
        }
        projectRepository.delete(project);
    }
}
