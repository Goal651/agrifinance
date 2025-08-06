package com.agrifinance.backend.service.admin;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agrifinance.backend.dto.admin.AdminDashboardStats;
import com.agrifinance.backend.dto.admin.AdminProjectDTO;
import com.agrifinance.backend.dto.loan.LoanDTO;
import com.agrifinance.backend.dto.loan.LoanProductDTO;
import com.agrifinance.backend.dto.project.ProjectDTO;
import com.agrifinance.backend.dto.user.UserDTO;
import com.agrifinance.backend.mapper.loan.LoanMapper;
import com.agrifinance.backend.mapper.loan.LoanProductMapper;
import com.agrifinance.backend.mapper.project.ProjectMapper;
import com.agrifinance.backend.mapper.user.UserMapper;
import com.agrifinance.backend.model.enums.LoanStatus;
import com.agrifinance.backend.model.enums.TaskStatus;
import com.agrifinance.backend.model.loan.Loan;
import com.agrifinance.backend.model.loan.LoanProduct;
import com.agrifinance.backend.model.project.Task;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.model.project.Project;
import com.agrifinance.backend.model.project.Goal;
import com.agrifinance.backend.repository.LoanRepository;
import com.agrifinance.backend.repository.ProjectRepository;
import com.agrifinance.backend.repository.UserRepository;
import com.agrifinance.backend.repository.LoanProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final LoanRepository loanRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final LoanMapper loanMapper;
    private final LoanProductRepository loanProductRepository;
    private final LoanProductMapper loanProductMapper;
    private final UserMapper userMapper;

    public List<LoanDTO> getAllLoans() {
        return loanMapper.toDTOs(loanRepository.findAll());
    }

    @Transactional(readOnly = true)
    public List<AdminProjectDTO> getAllProjects() {
        List<Project> projects = projectRepository.findAll();

        // if (!projects.isEmpty()) {
        // List<UUID> projectIds = projects.stream()
        // .map(Project::getId)
        // .collect(Collectors.toList());

        // // List<Goal> goals = projectRepository.findGoalsByProjectIds(projectIds);

        // // Map<UUID, List<Goal>> goalsByProjectId = goals.stream()
        // // .collect(Collectors.groupingBy(goal -> goal.getProject().getId()));

        // // projects.forEach(project -> {
        // // List<Goal> Goals = goalsByProjectId.get(project.getId());
        // // if (Goals != null) {
        // // project.setGoals(Goals);
        // // } else {
        // // project.setGoals(new ArrayList<>());
        // // }
        // // });
        // }

        return projects.stream()
                .map(this::mapToAdminProjectDTO)
                .collect(Collectors.toList());
    }

    private AdminProjectDTO mapToAdminProjectDTO(Project project) {
        ProjectDTO projectDTO = projectMapper.toDTO(project);

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

        adminDTO.setProgress(calculateProjectProgress(project));

        return adminDTO;
    }

    private int calculateProjectProgress(Project project) {
        List<Goal> goals = project.getGoals();
        if (goals == null || goals.isEmpty()) {
            return 0;
        }

        long totalGoals = goals.size();
        long completedGoals = goals.stream()
                .filter(goal -> isGoalCompleted(goal))
                .count();

        return totalGoals > 0 ? (int) ((completedGoals * 100) / totalGoals) : 0;
    }

    private boolean isGoalCompleted(Goal goal) {
        List<Task> tasks = goal.getTasks();
        if (tasks == null || tasks.isEmpty()) {
            return false;
        }

        return tasks.stream()
                .filter(Objects::nonNull)
                .allMatch(task -> task.getStatus() == TaskStatus.COMPLETED);
    }

    public List<UserDTO> getAllUsers() {
        return userMapper.toDTOs(userRepository.findAll());
    }

    public LoanDTO approveLoan(UUID id) {
        Loan loan = loanRepository.findById(id).orElseThrow();
        loan.setStatus(LoanStatus.APPROVED);
        loan.setUpdatedAt(LocalDateTime.now());
        Loan saved = loanRepository.save(loan);
        System.out.println("Saved \n\n\n" + saved);
        return loanMapper.toDTO(saved);
    }

    public LoanDTO rejectLoan(UUID id) {
        Loan loan = loanRepository.findById(id).orElseThrow();
        loan.setStatus(LoanStatus.REJECTED);
        loan.setUpdatedAt(LocalDateTime.now());
        return loanMapper.toDTO(loanRepository.save(loan));
    }

    public LoanProductDTO addLoanProduct(LoanProductDTO loanProductDTO) {
        LoanProduct loanProduct = loanProductMapper.toEntity(loanProductDTO);
        loanProduct = loanProductRepository.save(loanProduct);
        return loanProductMapper.toDTO(loanProduct);
    }

    public List<LoanProductDTO> getAllLoanProducts() {
        return loanProductMapper.toDTOs(loanProductRepository.findAll());
    }

    public LoanProductDTO getLoanProductById(UUID id) {
        return loanProductRepository.findById(id)
                .map(loanProductMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Loan product not found with id: " + id));
    }

    @Transactional
    public LoanProductDTO updateLoanProduct(UUID id, LoanProductDTO loanProductDTO) {
        return loanProductRepository.findById(id)
                .map(existingProduct -> {
                    // Update the existing product with new values
                    LoanProduct updatedProduct = loanProductMapper.toEntity(loanProductDTO);
                    updatedProduct.setId(id);
                    updatedProduct.setCreatedAt(existingProduct.getCreatedAt());
                    updatedProduct.setUpdatedAt(LocalDateTime.now());

                    // Save and return the updated product
                    updatedProduct = loanProductRepository.save(updatedProduct);
                    return loanProductMapper.toDTO(updatedProduct);
                })
                .orElseThrow(() -> new RuntimeException("Loan product not found with id: " + id));
    }

    @Transactional
    public void deleteLoanProduct(UUID id) {
        if (!loanProductRepository.existsById(id)) {
            throw new RuntimeException("Loan product not found with id: " + id);
        }
        loanProductRepository.deleteById(id);
    }

    public AdminDashboardStats getAdminDashboard() {
        AdminDashboardStats adminDashboardStats = new AdminDashboardStats();
        List<User> users = userRepository.findAll();
        List<Loan> loans = loanRepository.findAll();
        List<Project> projects = projectRepository.findAll();
        adminDashboardStats.setTotalUsers(users.size());
        adminDashboardStats.setTotalLoans(loans.size());
        adminDashboardStats.setTotalProjects(projects.size());

        return adminDashboardStats;
    }
}
