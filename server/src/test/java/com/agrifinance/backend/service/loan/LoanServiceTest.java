package com.agrifinance.backend.service.loan;

import com.agrifinance.backend.dto.loan.*;
import com.agrifinance.backend.model.enums.LoanStatus;
import com.agrifinance.backend.model.enums.LoanTermType;
import com.agrifinance.backend.model.loan.*;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.repository.LoanRepository;
import com.agrifinance.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoanServiceTest {

    @Mock
    private LoanRepository loanRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LoanService loanService;

    private User testUser;
    private Loan testLoan;
    private LoanRequest testLoanRequest;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("test@example.com");
        testUser.setFirstName("Test");
        testUser.setLastName("User");

        // Setup test loan
        LoanDetails details = LoanDetails.builder()
                .amount(10000.0)
                .interest(5.0)
                .type("AGRICULTURAL")
                .term(12)
                .termType(LoanTermType.MONTHS)
                .purpose("Farm equipment purchase")
                .build();

        PersonalInfo personalInfo = PersonalInfo.builder()
                .firstName("Test")
                .lastName("User")
                .idNumber("ID12345678")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .streetAddress("123 Farm St")
                .city("Farmville")
                .state("FS")
                .postalCode("12345")
                .country("Farmland")
                .build();

        FinancialInfo financialInfo = FinancialInfo.builder()
                .monthlyIncome(3000.0)
                .annualIncome(36000.0)
                .incomeSource("Farming")
                .employmentStatus("Self-Employed")
                .farmingExperience(5)
                .farmType("Crop")
                .bankName("Farmers Bank")
                .bankBranch("Main Branch")
                .accountNumber("1234567890")
                .accountHolderName("Test User")
                .build();

        DocumentUpload documents = DocumentUpload.builder()
                .idPhoto("id_photo.jpg")
                .proofOfIncome("income_proof.pdf")
                .farmOwnershipDocuments("deed.pdf")
                .cooperativeMembership("coop_membership.pdf")
                .treeImages(Arrays.asList("tree1.jpg", "tree2.jpg"))
                .build();

        LoanInfo info = LoanInfo.builder()
                .personal(personalInfo)
                .financial(financialInfo)
                .documents(documents)
                .build();

        testLoan = Loan.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .status(LoanStatus.PENDING)
                .details(details)
                .info(info)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Setup test loan request with nested DTOs
        PersonalInfoDTO personalInfoDTO = new PersonalInfoDTO();
        personalInfoDTO.setFirstName("Test");
        personalInfoDTO.setLastName("User");
        personalInfoDTO.setIdNumber("ID12345678");
        personalInfoDTO.setDateOfBirth(LocalDate.of(1990, 1, 1));
        personalInfoDTO.setStreetAddress("123 Farm St");
        personalInfoDTO.setCity("Farmville");
        personalInfoDTO.setState("FS");
        personalInfoDTO.setPostalCode("12345");
        personalInfoDTO.setCountry("Farmland");
        
        FinancialInfoDTO financialInfoDTO = new FinancialInfoDTO();
        financialInfoDTO.setMonthlyIncome(3000.0);
        financialInfoDTO.setAnnualIncome(36000.0);
        financialInfoDTO.setIncomeSource("Farming");
        financialInfoDTO.setEmploymentStatus("Self-Employed");
        financialInfoDTO.setFarmingExperience(5);
        financialInfoDTO.setFarmType("Crop");
        financialInfoDTO.setBankName("Farmers Bank");
        financialInfoDTO.setBankBranch("Main Branch");
        financialInfoDTO.setAccountNumber("1234567890");
        financialInfoDTO.setAccountHolderName("Test User");
        
        DocumentUploadDTO documentsDTO = new DocumentUploadDTO();
        documentsDTO.setIdPhoto("id_photo.jpg");
        documentsDTO.setProofOfIncome("income_proof.pdf");
        documentsDTO.setFarmOwnershipDocuments("deed.pdf");
        documentsDTO.setCooperativeMembership("coop_membership.pdf");
        documentsDTO.setTreeImages(Arrays.asList("tree1.jpg", "tree2.jpg"));
        
        testLoanRequest = new LoanRequest();
        testLoanRequest.setAmount(10000.0);
        testLoanRequest.setType("AGRICULTURAL");
        testLoanRequest.setTerm(12);
        testLoanRequest.setTermType(LoanTermType.MONTHS);
        testLoanRequest.setPurpose("Farm equipment purchase");
        testLoanRequest.setPersonalInfo(personalInfoDTO);
        testLoanRequest.setFinancialInfo(financialInfoDTO);
        testLoanRequest.setDocuments(documentsDTO);
    }

    @Test
    void applyForLoan_ShouldReturnLoanDTO_WhenValidRequest() {
        // Arrange
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(testUser));
        when(loanRepository.save(any(Loan.class))).thenReturn(testLoan);

        // Act
        LoanDTO result = loanService.applyForLoan(testUser.getId(), testLoanRequest);

        // Assert
        assertNotNull(result);
        assertEquals(testLoan.getId().toString(), result.getId());
        assertEquals(testUser.getId().toString(), result.getUserId());
        assertEquals(LoanStatus.PENDING, result.getStatus());
        assertNotNull(result.getPersonalInfo());
        assertNotNull(result.getFinancialInfo());
        assertNotNull(result.getDocuments());
        
        verify(loanRepository, times(1)).save(any(Loan.class));
    }

    @Test
    void getLoanById_ShouldReturnLoan_WhenLoanExists() {
        // Arrange
        when(loanRepository.findById(testLoan.getId())).thenReturn(Optional.of(testLoan));

        // Act
        LoanDTO result = loanService.getLoanById(testLoan.getId());

        // Assert
        assertNotNull(result);
        assertEquals(testLoan.getId().toString(), result.getId());
        verify(loanRepository, times(1)).findById(testLoan.getId());
    }

    @Test
    void updateLoanStatus_ShouldUpdateStatus_WhenValidStatus() {
        // Arrange
        LoanStatus newStatus = LoanStatus.APPROVED;
        when(loanRepository.findById(testLoan.getId())).thenReturn(Optional.of(testLoan));
        when(loanRepository.save(any(Loan.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        LoanDTO result = loanService.updateLoanStatus(testLoan.getId(), newStatus);

        // Assert
        assertNotNull(result);
        assertEquals(newStatus, result.getStatus());
        verify(loanRepository, times(1)).save(any(Loan.class));
    }

    @Test
    void getLoanOverview_ShouldReturnLatestLoan_WhenUserHasLoans() {
        // Arrange
        List<Loan> loans = Collections.singletonList(testLoan);
        when(loanRepository.findByUserId(testUser.getId())).thenReturn(loans);

        // Act
        LoanDTO result = loanService.getLoanOverview(testUser.getId());

        // Assert
        assertNotNull(result);
        assertEquals(testLoan.getId().toString(), result.getId());
        verify(loanRepository, times(1)).findByUserId(testUser.getId());
    }

    @Test
    void getLoanAnalytics_ShouldReturnAnalytics_WhenUserHasLoans() {
        // Arrange
        List<Loan> loans = Collections.singletonList(testLoan);
        when(loanRepository.findByUserId(testUser.getId())).thenReturn(loans);

        // Act
        Map<String, Object> analytics = loanService.getLoanAnalytics(testUser.getId());

        // Assert
        assertNotNull(analytics);
        assertTrue(analytics.containsKey("totalLoans"));
        assertTrue(analytics.containsKey("activeLoans"));
        assertTrue(analytics.containsKey("totalAmountBorrowed"));
        verify(loanRepository, times(1)).findByUserId(testUser.getId());
    }

    @Test
    void getLoanSummary_ShouldReturnSummary_WhenLoansExist() {
        // Arrange
        List<Loan> loans = Collections.singletonList(testLoan);
        when(loanRepository.findAll()).thenReturn(loans);

        // Act
        Map<String, Object> summary = loanService.getLoanSummary();

        // Assert
        assertNotNull(summary);
        assertTrue(summary.containsKey("totalAmount"));
        assertTrue(summary.containsKey("approvedCount"));
        assertTrue(summary.containsKey("pendingCount"));
        verify(loanRepository, times(1)).findAll();
    }

    @Test
    void calculateMonthlyPayment_ShouldReturnCorrectValue_WhenValidInput() {
        // Arrange
        double amount = 10000.0;
        double annualInterestRate = 5.0;
        int termMonths = 12;

        // Act
        double monthlyPayment = loanService.calculateMonthlyPayment(amount, annualInterestRate, termMonths);

        // Assert
        assertTrue(monthlyPayment > 0);
        // The exact value would be approximately 856.07 for these inputs
        assertEquals(856.07, monthlyPayment, 0.5);
    }
}
