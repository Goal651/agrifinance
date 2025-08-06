package com.agrifinance.backend.service.project;

import com.agrifinance.backend.dto.project.GoalRequest;
import com.agrifinance.backend.dto.project.GoalUpdateRequest;
import com.agrifinance.backend.dto.project.ProjectDTO;
import com.agrifinance.backend.dto.project.ProjectDashboardDTO;
import com.agrifinance.backend.dto.project.ProjectRequest;
import com.agrifinance.backend.dto.project.TaskRequest;
import com.agrifinance.backend.dto.project.TaskUpdateRequest;
import com.agrifinance.backend.mapper.project.ProjectMapper;
import com.agrifinance.backend.mapper.project.WorkerMapper;
import com.agrifinance.backend.model.enums.GoalStatus;
import com.agrifinance.backend.model.enums.ProjectStatus;
import com.agrifinance.backend.model.enums.TaskStatus;
import com.agrifinance.backend.model.project.Task;
import com.agrifinance.backend.model.project.Worker;
import com.agrifinance.backend.model.project.Project;
import com.agrifinance.backend.model.project.Goal;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.repository.TaskRepository;
import com.agrifinance.backend.repository.GoalRepository;
import com.agrifinance.backend.repository.ProjectRepository;
import com.agrifinance.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;
    private final GoalRepository goalRepository;
    private final TaskRepository taskRepository;
    private final WorkerMapper workerMapper;

    public List<ProjectDTO> getProjects(UUID userId) {
        List<Project> projects = projectRepository.findByUserId(userId);
        return projectMapper.toDTOs(projects);
    }

    public ProjectDashboardDTO getProjectDash(UUID userId) {
        List<Project> projects = projectRepository.findByUserId(userId);
        ProjectDashboardDTO projectDashboardDTO = new ProjectDashboardDTO();
        List<Project> activeProjects = new ArrayList<>();
        for (Project project : projects) {
            if (project.getStatus() == ProjectStatus.COMPLETED) {
                projectDashboardDTO.setCompleted(projectDashboardDTO.getCompleted() + 1);
            }
            if (project.getStatus() == ProjectStatus.IN_PROGRESS) {
                projectDashboardDTO.setActive(projectDashboardDTO.getActive() + 1);
                activeProjects.add(project);
            }

        }
        projectDashboardDTO.setActiveProjects(projectMapper.toDTOs(activeProjects));
        return projectDashboardDTO;
    }

    public ProjectDTO getProjectById(UUID id) {
        Project project = projectRepository.findById(id).orElse(null);
        System.out.println(project);
        return projectMapper.toDTO(project);
    }

    public ProjectDTO createNewProject(ProjectRequest projectRequest, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Project project = new Project();
        project.setUser(user);
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        project.setTargetDate(projectRequest.getTargetDate());
        project.setStatus(ProjectStatus.NOT_STARTED);
        projectRepository.save(project);
        return projectMapper.toDTO(project);
    }

    @Transactional
    public ProjectDTO createNewGoal(GoalRequest goalRequest) {
        Project project = projectRepository.findById(UUID.fromString(goalRequest.getProject().getId()))
                .orElseThrow();
                
        // Update project status if it was completed
        if (project.getStatus() == ProjectStatus.COMPLETED) {
            project.setStatus(ProjectStatus.IN_PROGRESS);
            project.setCompletedAt(null);
        }
        
        // Create and save the new goal
        Goal goal = new Goal();
        goal.setName(goalRequest.getName());
        goal.setDescription(goalRequest.getDescription());
        goal.setStatus(GoalStatus.NOT_STARTED);
        
        // Save the goal first to generate ID
        Goal newGoal = goalRepository.save(goal);
        
        // Add goal to project and save
        project.getGoals().add(newGoal);
        projectRepository.save(project);
        
        return projectMapper.toDTO(project);
    }

    @Transactional
    public void createNewTask(TaskRequest taskRequest) {
        Goal goal = goalRepository.findById(UUID.fromString(taskRequest.getGoal().getId()))
                .orElseThrow();
        Worker worker = workerMapper.toEntity(taskRequest.getWorker());
        
        Task goalTask = new Task();
        goalTask.setName(taskRequest.getName());
        goalTask.setDescription(taskRequest.getDescription());
        goalTask.setStatus(TaskStatus.NOT_STARTED);
        goalTask.setWorker(worker);
        
        // Save task first
        taskRepository.save(goalTask);
        
        // Add task to goal and update goal status
        goal.getTasks().add(goalTask);
        if (goal.getStatus() == GoalStatus.COMPLETED) {
            goal.setStatus(GoalStatus.IN_PROGRESS);
            goal.setCompletedAt(null);
        }
        goalRepository.save(goal);
        
        // Update project status
        Project project = projectRepository.findByGoalId(goal.getId());
        if (project != null && project.getStatus() == ProjectStatus.COMPLETED) {
            project.setStatus(ProjectStatus.IN_PROGRESS);
            project.setCompletedAt(null);
            projectRepository.save(project);
        }
    }

    public void updateProject(ProjectDTO projectDTO) {
        Project project = projectRepository.findById(UUID.fromString(projectDTO.getId())).orElseThrow();
        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDescription());
        project.setTargetDate(projectDTO.getTargetDate());
        project.setStatus(projectDTO.getStatus());
        projectRepository.save(project);
    }

    public void updateGoal(GoalUpdateRequest goalRequest) {
        Goal Goal = goalRepository.findById(UUID.fromString(goalRequest.getId())).orElseThrow();
        Goal.setName(goalRequest.getName());
        Goal.setDescription(goalRequest.getDescription());
        goalRepository.save(Goal);
    }

    public void updateTask(TaskUpdateRequest taskRequest) {
        Task goalTask = taskRepository.findById(UUID.fromString(taskRequest.getId())).orElseThrow();
        goalTask.setName(taskRequest.getName());
        goalTask.setDescription(taskRequest.getDescription());
        taskRepository.save(goalTask);
    }

    @Transactional
    public void finishTask(UUID id) {
        // Find and update the task
        Task goalTask = taskRepository.findById(id).orElseThrow();
        goalTask.markComplete();
        taskRepository.save(goalTask);

        // Find and update the goal
        Goal goal = goalRepository.findByTaskId(id);
        goal.updateStatus();
        goalRepository.save(goal);

        // Find and update the project
        Project project = projectRepository.findByGoalId(goal.getId());
        updateProjectStatus(project);
        projectRepository.save(project);
    }

    private void updateProjectStatus(Project project) {
        if ( project.getGoals() == null || project.getGoals().isEmpty()) {
            project.setStatus(ProjectStatus.NOT_STARTED);
            return;
        }

        boolean allGoalsCompleted = project.getGoals().stream()
                .allMatch(goal -> goal.getStatus() == GoalStatus.COMPLETED);

        boolean anyGoalInProgress = project.getGoals().stream()
                .anyMatch(goal -> goal.getStatus() == GoalStatus.IN_PROGRESS);

        if (allGoalsCompleted) {
            project.setStatus(ProjectStatus.COMPLETED);
            project.setCompletedAt(LocalDateTime.now());
        } else if (anyGoalInProgress || project.getStatus() == ProjectStatus.NOT_STARTED) {
            project.setStatus(ProjectStatus.IN_PROGRESS);
        }
    }

    public void deleteProject(UUID id) {
        projectRepository.deleteById(id);
    }

    public void deleteGoal(UUID id) {
        goalRepository.deleteById(id);
    }

    public void deleteTask(UUID id) {
        taskRepository.deleteById(id);
    }
}
