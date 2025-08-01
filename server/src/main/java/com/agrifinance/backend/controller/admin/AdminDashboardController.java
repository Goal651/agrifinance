package com.agrifinance.backend.controller.admin;

import com.agrifinance.backend.dto.common.ApiResponse;
import com.agrifinance.backend.dto.loan.LoanDTO;
import com.agrifinance.backend.dto.project.ProjectDTO;
import com.agrifinance.backend.dto.user.UserDTO;
import com.agrifinance.backend.mapper.loan.LoanMapper;
import com.agrifinance.backend.mapper.project.ProjectMapper;
import com.agrifinance.backend.mapper.user.UserMapper;
import com.agrifinance.backend.model.loan.Loan;
import com.agrifinance.backend.model.project.Project;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.service.admin.AdminService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final AdminService adminService;
    private final LoanMapper loanMapper;
    private final UserMapper userMapper;
    private final ProjectMapper projectMapper;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        List<UserDTO> userDTOs = userMapper.toDTOs(users);

        ApiResponse<List<UserDTO>> apiResponse = new ApiResponse<>(true, userDTOs, "User loaded successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<ProjectDTO>>> getAllProjects() {
        List<Project> projects = adminService.getAllProjects();
        List<ProjectDTO> projectDTOs = projectMapper.toDTOs(projects);

        ApiResponse<List<ProjectDTO>> apiResponse = new ApiResponse<>(true, projectDTOs, "User loaded successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/loans")
    public ResponseEntity<ApiResponse<List<LoanDTO>>> getAllLoans() {
        List<Loan> loans = adminService.getAllLoans();
        List<LoanDTO> loanDTOs = loanMapper.toDTOs(loans);

        ApiResponse<List<LoanDTO>> apiResponse = new ApiResponse<>(true, loanDTOs, "User loaded successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
