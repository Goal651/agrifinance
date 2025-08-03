package com.agrifinance.backend.service.admin;

import java.util.*;
import java.util.stream.Collectors;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agrifinance.backend.dto.admin.AdminProjectDTO;
import com.agrifinance.backend.dto.project.ProjectDTO;
import com.agrifinance.backend.mapper.project.ProjectMapper;
import com.agrifinance.backend.model.enums.TaskStatus;
import com.agrifinance.backend.model.loan.Loan;
import com.agrifinance.backend.model.project.GoalTask;
import com.agrifinance.backend.model.project.Project;
import com.agrifinance.backend.model.project.ProjectGoal;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.repository.LoanRepository;
import com.agrifinance.backend.repository.ProjectRepository;
import com.agrifinance.backend.repository.UserRepository;
import com.agrifinance.backend.repository.GoalTaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final LoanRepository loanRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final GoalTaskRepository goalTaskRepository;

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<AdminProjectDTO> getAllProjects() {
        // First fetch all projects (without relationships)
        List<Project> projects = projectRepository.findAll();
        
        if (!projects.isEmpty()) {
            List<UUID> projectIds = projects.stream()
                .map(Project::getId)
                .collect(Collectors.toList());
            
            // Fetch goals for these projects
            List<ProjectGoal> goals = projectRepository.findGoalsByProjectIds(projectIds);
            
            // Group goals by project ID
            Map<UUID, List<ProjectGoal>> goalsByProjectId = goals.stream()
                .collect(Collectors.groupingBy(goal -> goal.getProject().getId()));
            
            // Set the goals for each project
            projects.forEach(project -> {
                List<ProjectGoal> projectGoals = goalsByProjectId.get(project.getId());
                if (projectGoals != null) {
                    project.setGoals(projectGoals);
                } else {
                    project.setGoals(new ArrayList<>());
                }
            });
        }
        
        return projects.stream()
            .map(this::mapToAdminProjectDTO)
            .collect(Collectors.toList());
    }
    
    private AdminProjectDTO mapToAdminProjectDTO(Project project) {
        // First map to ProjectDTO using the existing mapper
        ProjectDTO projectDTO = projectMapper.toDTO(project);
        
        // Create AdminProjectDTO and copy all fields from ProjectDTO
        AdminProjectDTO adminDTO = new AdminProjectDTO();
        adminDTO.setId(projectDTO.getId());
        adminDTO.setUser(projectDTO.getUser());
        adminDTO.setName(projectDTO.getName());
        adminDTO.setDescription(projectDTO.getDescription());
        adminDTO.setStatus(projectDTO.getStatus());
        adminDTO.setGoals(projectDTO.getGoals());
        adminDTO.setCreatedAt(projectDTO.getCreatedAt());
        adminDTO.setUpdatedAt(projectDTO.getUpdatedAt());
        adminDTO.setTargetDate(projectDTO.getTargetDate());
        adminDTO.setCompletedAt(projectDTO.getCompletedAt());
        
        // Calculate and set progress
        adminDTO.setProgress(calculateProjectProgress(project));
        
        return adminDTO;
    }
    
    private int calculateProjectProgress(Project project) {
        List<ProjectGoal> goals = project.getGoals();
        if (goals == null || goals.isEmpty()) {
            return 0;
        }
        
        long totalGoals = goals.size();
        long completedGoals = goals.stream()
            .filter(goal -> isGoalCompleted(goal))
            .count();
            
        return totalGoals > 0 ? (int) ((completedGoals * 100) / totalGoals) : 0;
    }
    
    private boolean isGoalCompleted(ProjectGoal goal) {
        List<GoalTask> tasks = goal.getTasks();
        if (tasks == null || tasks.isEmpty()) {
            return false;
        }
        
        return tasks.stream()
            .filter(Objects::nonNull)
            .allMatch(task -> task.getStatus() == TaskStatus.COMPLETED);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

}
