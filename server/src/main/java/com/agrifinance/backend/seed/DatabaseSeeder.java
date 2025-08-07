package com.agrifinance.backend.seed;

import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.model.enums.LoanStatus;
import com.agrifinance.backend.model.loan.*;
import com.agrifinance.backend.model.loan.LoanInfo;
import com.agrifinance.backend.model.enums.LoanTermType;
import com.agrifinance.backend.model.enums.ProjectStatus;
import com.agrifinance.backend.model.enums.Role;
import com.agrifinance.backend.model.project.Project;
import com.agrifinance.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DatabaseSeeder {
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final LoanProductRepository loanProductRepository;
        private final LoanRepository loanRepository;
        private final ProjectRepository projectRepository;

        @Bean
        public CommandLineRunner seedData() {
                return args -> {
                        // First, create users if they don't exist
                        userRepository.findByEmail("admin@agrifinance.com")
                                        .orElseGet(() -> {
                                                User newAdmin = User.builder()
                                                                .email("admin@agrifinance.com")
                                                                .password(passwordEncoder.encode("admin123"))
                                                                .firstName("Admin")
                                                                .lastName("User")
                                                                .role(Role.ADMIN)
                                                                .status("ACTIVE")
                                                                .build();
                                                return userRepository.save(newAdmin);
                                        });

                        userRepository.findByEmail("user@agrifinance.com")
                                        .orElseGet(() -> {
                                                User newUser = User.builder()
                                                                .email("user@agrifinance.com")
                                                                .password(passwordEncoder.encode("user123"))
                                                                .firstName("John")
                                                                .lastName("Farmer")
                                                                .role(Role.USER)
                                                                .status("ACTIVE")
                                                                .build();
                                                return userRepository.save(newUser);
                                        });
                };
        };
}
