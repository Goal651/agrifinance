package com.agrifinance.backend.dto.admin;

import lombok.Data;

@Data
public class AdminDashboardStats {
    private Integer totalUsers;
    private Integer totalProjects;
    private Integer totalLoans;
    private Double pendingLoans;
    private Double approvedLoans;
    private Double rejectedLoans;
    private Double totalLoanAmount;
    private Double totalRepaid;
    private LoanStatusDistribution loanStatusDistribution;
}