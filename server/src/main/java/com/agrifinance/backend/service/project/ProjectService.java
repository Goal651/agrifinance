package com.agrifinance.backend.service.project;

import com.agrifinance.backend.dto.project.GoalRequest;
import com.agrifinance.backend.dto.project.ProjectDTO;
import com.agrifinance.backend.dto.project.ProjectRequest;
import com.agrifinance.backend.dto.project.TaskRequest;
import com.agrifinance.backend.mapper.project.ProjectMapper;
import com.agrifinance.backend.model.enums.GoalStatus;
import com.agrifinance.backend.model.enums.ProjectStatus;
import com.agrifinance.backend.model.enums.TaskStatus;
import com.agrifinance.backend.model.project.GoalTask;
import com.agrifinance.backend.model.project.Project;
import com.agrifinance.backend.model.project.ProjectGoal;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.repository.GoalTaskRepository;
import com.agrifinance.backend.repository.ProjectGoalRepository;
import com.agrifinance.backend.repository.ProjectRepository;
import com.agrifinance.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectMapper projectMapper;

    @Autowired
    private ProjectGoalRepository projectGoalRepository;

    @Autowired
    private GoalTaskRepository goalTaskRepository;

    public List<ProjectDTO> getProjects(UUID userId) {
        List<Project> projects = projectRepository.findByUserId(userId);
        return projectMapper.toDTOs(projects);
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
        ProjectGoal projectGoal = new ProjectGoal();
        projectGoal.setName(goalRequest.getName());
        projectGoal.setDescription(goalRequest.getDescription());
        projectGoal.setStatus(GoalStatus.NOT_STARTED);
        ProjectGoal newGoal = projectGoalRepository.save(projectGoal);
        project.getGoals().add(newGoal);
        projectRepository.save(project);
        return projectMapper.toDTO(project);
    }

    public void createNewTask(TaskRequest taskRequest) {
        ProjectGoal projectGoal = projectGoalRepository.findById(UUID.fromString(taskRequest.getGoal().getId()))
                .orElseThrow();
        GoalTask goalTask = new GoalTask();
        goalTask.setName(taskRequest.getName());
        goalTask.setDescription(taskRequest.getDescription());
        goalTask.setStatus(TaskStatus.NOT_STARTED);
        goalTaskRepository.save(goalTask);
        projectGoal.getTasks().add(goalTask);
        projectGoalRepository.save(projectGoal);
        System.out.println(projectGoal);
    }
}
