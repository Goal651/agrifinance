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

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

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
        System.out.println(projects);
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
        System.out.println(projectDashboardDTO);
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

    public ProjectDTO createNewGoal(GoalRequest goalRequest) {

        Project project = projectRepository.findById(UUID.fromString(goalRequest.getProject().getId()))
                .orElseThrow();
        Goal Goal = new Goal();
        Goal.setName(goalRequest.getName());
        Goal.setDescription(goalRequest.getDescription());
        Goal.setStatus(GoalStatus.NOT_STARTED);
        Goal newGoal = goalRepository.save(Goal);
        project.getGoals().add(newGoal);
        projectRepository.save(project);
        return projectMapper.toDTO(project);
    }

    public void createNewTask(TaskRequest taskRequest) {
        Goal Goal = goalRepository.findById(UUID.fromString(taskRequest.getGoal().getId()))
                .orElseThrow();
        Worker worker = workerMapper.toEntity(taskRequest.getWorker());
        System.out.println(worker);
        Task goalTask = new Task();
        goalTask.setName(taskRequest.getName());
        goalTask.setDescription(taskRequest.getDescription());
        goalTask.setStatus(TaskStatus.NOT_STARTED);
        goalTask.setWorker(worker);
        taskRepository.save(goalTask);
        Goal.getTasks().add(goalTask);
        goalRepository.save(Goal);
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

    public void finishTask(UUID id) {
        Task goalTask = taskRepository.findById(id).orElseThrow();
        Goal Goal = goalRepository.findByTaskId(id);
        goalTask.markComplete();
        Goal.updateStatus();
        taskRepository.save(goalTask);
        goalRepository.save(Goal);
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
