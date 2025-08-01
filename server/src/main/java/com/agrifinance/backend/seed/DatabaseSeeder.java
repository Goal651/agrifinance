package com.agrifinance.backend.seed;

import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.model.user.Role;
import com.agrifinance.backend.model.enums.LoanStatus;
import com.agrifinance.backend.model.loan.*;
import com.agrifinance.backend.model.loan.LoanInfo;
import com.agrifinance.backend.model.enums.LoanTermType;
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
                        if (userRepository.count() == 0) {
                                User admin = User.builder()
                                                .email("admin@agrifinance.com")
                                                .password(passwordEncoder.encode("admin123"))
                                                .firstName("Admin")
                                                .lastName("User")
                                                .role(Role.ADMIN)
                                                .status("ACTIVE")
                                                .build();
                                User user = User.builder()
                                                .email("user@agrifinance.com")
                                                .password(passwordEncoder.encode("user123"))
                                                .firstName("John")
                                                .lastName("Farmer")
                                                .role(Role.USER)
                                                .status("ACTIVE")
                                                .build();
                                userRepository.saveAll(List.of(admin, user));
                        }

                        if (loanProductRepository.count() == 0) {
                                LoanProduct lp1 = LoanProduct.builder()
                                                .name("Standard Crop Loan")
                                                .description("Loan for crop farmers")
                                                .interest(8.5)
                                                .amount(10000.0)
                                                .term(12)
                                                .termType(LoanTermType.MONTHS)
                                                .build();
                                LoanProduct lp2 = LoanProduct.builder()
                                                .name("Livestock Loan")
                                                .description("Loan for livestock farmers")
                                                .interest(10.0)
                                                .amount(20000.0)
                                                .term(24)
                                                .termType(LoanTermType.YEARS)
                                                .build();
                                loanProductRepository.saveAll(List.of(lp1, lp2));
                        }

                        List<User> users = userRepository.findAll();
                        List<LoanProduct> products = loanProductRepository.findAll();
                        LoanProduct cropLoan = products.get(0);
                        LoanProduct cattleLoan = products.size() > 1 ? products.get(1) : products.get(0);

                        if (loanRepository.count() == 0 && !users.isEmpty() && !products.isEmpty()) {
                                User farmer = users.get(1);

                                // Create loan 1
                                Loan loan1 = Loan.builder()
                                                .user(farmer)
                                                .status(LoanStatus.PENDING)
                                                .details(cropLoan)
                                                .info(LoanInfo.builder()
                                                                .personal(PersonalInfo.builder()
                                                                                .firstName(farmer.getFirstName())
                                                                                .lastName(farmer.getLastName())
                                                                                .idNumber("ID12345678")
                                                                                .dateOfBirth(java.time.LocalDate.now()
                                                                                                .minusYears(35))

                                                                                .build())
                                                                .financial(FinancialInfo.builder()
                                                                                .monthlyIncome(1500.0)
                                                                                .incomeSource("farming")
                                                                                .employmentStatus("self-employed")
                                                                                .farmingExperience(8)
                                                                                .farmType("crop")
                                                                                .bankName("Equity Bank")
                                                                                .bankBranch("Nairobi CBD")
                                                                                .accountNumber("1234567890")
                                                                                .accountHolderName(farmer.getFirstName()
                                                                                                + " "
                                                                                                + farmer.getLastName())
                                                                                .build())
                                                                .documents(DocumentUpload.builder()
                                                                                .idPhoto("id_photo_1.jpg")
                                                                                .proofOfIncome("income_proof_1.pdf")
                                                                                .farmOwnershipDocuments(
                                                                                                "title_deed_1.pdf")
                                                                                .cooperativeMembership(
                                                                                                "coop_cert_1.pdf")
                                                                                .treeImages(List.of("farm1.jpg",
                                                                                                "farm2.jpg"))
                                                                                .build())
                                                                .build())
                                                .paidAmount(0.0)
                                                .createdAt(java.time.LocalDateTime.now().minusMonths(6))
                                                .updatedAt(java.time.LocalDateTime.now().minusMonths(1))
                                                .build();

                                // Create loan 2
                                Loan loan2 = Loan.builder()
                                                .user(farmer)
                                                .status(LoanStatus.PENDING)
                                                .details(cattleLoan)
                                                .info(LoanInfo.builder()
                                                                .personal(PersonalInfo.builder()
                                                                                .firstName(farmer.getFirstName())
                                                                                .lastName(farmer.getLastName())
                                                                                .idNumber("ID12345678")
                                                                                .dateOfBirth(java.time.LocalDate.now()
                                                                                                .minusYears(35))
                                                                                .streetAddress("8765432")
                                                                                .city("Nairobi")
                                                                                .state("Nairobi")
                                                                                .postalCode("00100")
                                                                                .country("Kenya")
                                                                                .build())
                                                                .financial(FinancialInfo.builder()
                                                                                .monthlyIncome(2000.0)
                                                                                .incomeSource("farming")
                                                                                .employmentStatus("self-employed")
                                                                                .farmingExperience(10)
                                                                                .farmType("livestock")
                                                                                .bankName("KCB Bank")
                                                                                .bankBranch("Nairobi West")
                                                                                .accountNumber("0987654321")
                                                                                .accountHolderName(farmer.getFirstName()
                                                                                                + " "
                                                                                                + farmer.getLastName())
                                                                                .build())
                                                                .documents(DocumentUpload.builder()
                                                                                .idPhoto("id_photo_2.jpg")
                                                                                .proofOfIncome("income_proof_2.pdf")
                                                                                .farmOwnershipDocuments(
                                                                                                "title_deed_2.pdf")
                                                                                .cooperativeMembership(
                                                                                                "coop_cert_2.pdf")
                                                                                .treeImages(List.of("cattle1.jpg",
                                                                                                "cattle2.jpg"))
                                                                                .build())
                                                                .build())
                                                .paidAmount(0.0)
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
