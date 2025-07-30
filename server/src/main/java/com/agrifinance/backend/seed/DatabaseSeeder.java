package com.agrifinance.backend.seed;

import com.agrifinance.backend.model.*;
import com.agrifinance.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.UUID;

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
            if (userRepository.count() == 0) {
                User admin = User.builder()
                        .email("admin@agrifinance.com")
                        .password(passwordEncoder.encode("admin123"))
                        .firstName("Admin")
                        .lastName("User")
                        .phone("1234567890")
                        .farmType("N/A")
                        .farmSize(0.0)
                        .location("HQ")
                        .role(Role.ADMIN)
                        .status("ACTIVE")
                        .address(Address.builder().street("1 Admin St").city("AgriCity").state("AgriState").zipCode("00000").build())
                        .build();
                User user = User.builder()
                        .email("user@agrifinance.com")
                        .password(passwordEncoder.encode("user123"))
                        .firstName("John")
                        .lastName("Farmer")
                        .phone("0987654321")
                        .farmType("CROP")
                        .farmSize(10.5)
                        .location("Village")
                        .role(Role.USER)
                        .status("ACTIVE")
                        .address(Address.builder().street("2 Farm Rd").city("AgriTown").state("AgriState").zipCode("11111").build())
                        .build();
                userRepository.saveAll(List.of(admin, user));
            }

            if (loanProductRepository.count() == 0) {
                LoanProduct lp1 = LoanProduct.builder()
                        .name("Standard Crop Loan")
                        .description("Loan for crop farmers")
                        .interestRate(8.5)
                        .maxAmount(10000.0)
                        .minAmount(500.0)
                        .termMonths(12)
                        .build();
                LoanProduct lp2 = LoanProduct.builder()
                        .name("Livestock Loan")
                        .description("Loan for livestock farmers")
                        .interestRate(10.0)
                        .maxAmount(20000.0)
                        .minAmount(1000.0)
                        .termMonths(24)
                        .build();
                loanProductRepository.saveAll(List.of(lp1, lp2));
            }

            List<User> users = userRepository.findAll();
            List<LoanProduct> products = loanProductRepository.findAll();

            if (loanRepository.count() == 0 && !users.isEmpty() && !products.isEmpty()) {
                Loan loan1 = Loan.builder()
                        .user(users.get(1))
                        .amount(5000.0)
                        .type("CROP")
                        .status("APPROVED")
                        .createdAt(java.time.LocalDateTime.now().minusMonths(6))
                        .updatedAt(java.time.LocalDateTime.now().minusMonths(1))
                        .build();
                Loan loan2 = Loan.builder()
                        .user(users.get(1))
                        .amount(12000.0)
                        .type("LIVESTOCK")
                        .status("PENDING")
                        .createdAt(java.time.LocalDateTime.now().minusMonths(2))
                        .updatedAt(java.time.LocalDateTime.now())
                        .build();
                loanRepository.saveAll(List.of(loan1, loan2));
            }

            if (projectRepository.count() == 0 && !users.isEmpty()) {
                Project project1 = Project.builder()
                        .user(users.get(1))
                        .name("Maize Expansion")
                        .description("Expanding maize farm by 5 acres.")
                        .status("ACTIVE")
                        .type("CROP")
                        .createdAt(java.time.LocalDateTime.now().minusMonths(4))
                        .updatedAt(java.time.LocalDateTime.now().minusMonths(1))
                        .build();
                Project project2 = Project.builder()
                        .user(users.get(1))
                        .name("Dairy Upgrade")
                        .description("Upgrade dairy facilities for higher yield.")
                        .status("PENDING")
                        .type("LIVESTOCK")
                        .createdAt(java.time.LocalDateTime.now().minusMonths(1))
                        .updatedAt(java.time.LocalDateTime.now())
                        .build();
                projectRepository.saveAll(List.of(project1, project2));
            }
        };
    }
}
 