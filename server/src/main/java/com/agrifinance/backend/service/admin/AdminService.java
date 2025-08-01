package com.agrifinance.backend.service.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.agrifinance.backend.model.loan.Loan;
import com.agrifinance.backend.model.project.Project;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.repository.LoanRepository;
import com.agrifinance.backend.repository.ProjectRepository;
import com.agrifinance.backend.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

}
