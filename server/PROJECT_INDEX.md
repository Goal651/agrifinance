# AgriFinance Backend - Project Index

## 📋 Project Overview

**AgriFinance Backend** is a Spring Boot application that serves as the backend for an agricultural finance mobile application. The system provides APIs for loan management, project tracking, user authentication, and administrative functions.

- **Technology Stack**: Spring Boot 3.5.4, Java 21, MySQL, JWT Authentication
- **Architecture**: RESTful API with layered architecture (Controller → Service → Repository)
- **Database**: MySQL with JPA/Hibernate
- **Documentation**: Swagger/OpenAPI integration

## 🏗️ Project Structure

```
server/
├── src/main/java/com/agrifinance/backend/
│   ├── BackendApplication.java          # Main application entry point
│   ├── config/                         # Configuration classes
│   │   └── SwaggerConfig.java         # Swagger/OpenAPI configuration
│   ├── controller/                     # REST API controllers
│   │   ├── AuthController.java        # Authentication endpoints
│   │   ├── LoanController.java        # Loan management endpoints
│   │   ├── ProjectController.java     # Project management endpoints
│   │   ├── LoanProductController.java # Loan product endpoints
│   │   ├── AdminDashboardController.java # Admin dashboard endpoints
│   │   ├── AdminLoanController.java   # Admin loan management
│   │   ├── AdminProjectController.java # Admin project management
│   │   └── AdminUserController.java   # Admin user management
│   ├── service/                       # Business logic layer
│   │   ├── LoanService.java          # Loan business logic
│   │   ├── ProjectService.java       # Project business logic
│   │   └── LoanProductService.java   # Loan product business logic
│   ├── repository/                    # Data access layer
│   │   ├── UserRepository.java       # User data access
│   │   ├── LoanRepository.java       # Loan data access
│   │   ├── ProjectRepository.java    # Project data access
│   │   ├── LoanProductRepository.java # Loan product data access
│   │   ├── LoanPaymentRepository.java # Loan payment data access
│   │   └── ProjectGoalRepository.java # Project goal data access
│   ├── model/                        # Entity classes
│   │   ├── User.java                 # User entity
│   │   ├── Loan.java                 # Loan entity
│   │   ├── Project.java              # Project entity
│   │   ├── LoanProduct.java          # Loan product entity
│   │   ├── LoanPayment.java          # Loan payment entity
│   │   ├── ProjectGoal.java          # Project goal entity
│   │   ├── Address.java              # Address entity
│   │   └── Role.java                 # Role entity
│   ├── dto/                          # Data Transfer Objects
│   │   ├── ApiResponse.java          # Standard API response wrapper
│   │   ├── AuthRequest.java          # Authentication request DTO
│   │   ├── AuthResponse.java         # Authentication response DTO
│   │   ├── LoanDTO.java              # Loan data transfer object
│   │   ├── LoanPaymentDTO.java       # Loan payment DTO
│   │   ├── LoanProductDTO.java       # Loan product DTO
│   │   ├── LoanRequest.java          # Loan request DTO
│   │   ├── ProjectDTO.java           # Project DTO
│   │   └── ProjectGoalDTO.java       # Project goal DTO
│   ├── security/                     # Security configuration
│   │   ├── SecurityConfig.java       # Spring Security configuration
│   │   ├── JwtUtil.java              # JWT utility functions
│   │   ├── JwtAuthFilter.java        # JWT authentication filter
│   │   └── CustomUserDetailsService.java # Custom user details service
│   ├── exception/                    # Exception handling
│   │   ├── GlobalExceptionHandler.java # Global exception handler
│   │   └── ErrorResponse.java        # Error response DTO
│   └── seed/                         # Database seeding
│       └── DatabaseSeeder.java       # Database initialization
├── src/main/resources/
│   └── application.properties        # Application configuration
└── pom.xml                          # Maven project configuration
```

## 🔧 Configuration

### Application Properties
- **Database**: MySQL on localhost:3306/agrifinance
- **Server Port**: 8089
- **JWT Secret**: Configured for token-based authentication
- **API Documentation**: Swagger UI available at `/swagger-ui.html`

### Key Dependencies
- **Spring Boot Starter Web**: RESTful web services
- **Spring Boot Starter Security**: Authentication and authorization
- **Spring Boot Starter Data JPA**: Database operations
- **Spring Boot Starter Validation**: Input validation
- **MySQL Connector**: Database connectivity
- **JWT Libraries**: Token-based authentication
- **Lombok**: Reduces boilerplate code
- **SpringDoc OpenAPI**: API documentation

## 🎯 Core Features

### 1. Authentication & Authorization
- JWT-based authentication
- User registration with validation
- Role-based access control
- Custom user details service
- Secure endpoints with authentication filters

### 2. Loan Management
- Create and manage loans
- Track loan payments
- Loan product catalog
- Admin loan oversight

### 3. Project Management
- Agricultural project tracking
- Project goals and milestones
- Project status monitoring

### 4. User Management
- User registration and profiles
- Address management
- Role assignment
- Admin user oversight

### 5. Administrative Functions
- Dashboard analytics
- User management
- Loan oversight
- Project management

## 🚀 Getting Started

### Prerequisites
- Java 21
- MySQL 8.0+
- Maven 3.6+

### Setup Instructions
1. **Clone the repository**
2. **Configure MySQL database**
   - Create database: `agrifinance`
   - Update credentials in `application.properties`
3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```
4. **Access the application**
   - API Base URL: `http://localhost:8089`
   - Swagger UI: `http://localhost:8089/swagger-ui.html`
   - API Docs: `http://localhost:8089/api-docs`

## 📚 API Documentation

The application includes comprehensive API documentation through Swagger/OpenAPI:
- **Interactive Documentation**: Available at `/swagger-ui.html`
- **API Specification**: Available at `/api-docs`
- **Endpoint Groups**:
  - Authentication (`/api/auth`)
    - POST `/api/auth/signup` - User registration
    - POST `/api/auth/login` - User login
    - POST `/api/auth/admin-login` - Admin login
    - POST `/api/auth/logout` - User logout
  - Loans (`/api/loans`)
  - Projects (`/api/projects`)
  - Loan Products (`/api/loan-products`)
  - Admin Dashboard (`/api/admin`)

## 🔒 Security

- **JWT Authentication**: Stateless token-based authentication
- **Role-based Access**: Different endpoints for users and admins
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Global exception handling with proper error responses

## 🗄️ Database Schema

The application uses the following main entities:
- **User**: Application users with roles and addresses
- **Loan**: Financial loans with payment tracking
- **Project**: Agricultural projects with goals
- **LoanProduct**: Available loan products
- **LoanPayment**: Payment records for loans
- **ProjectGoal**: Goals and milestones for projects

## 🧪 Testing

- **Test Framework**: Spring Boot Test
- **Test Location**: `src/test/java/com/agrifinance/backend/`
- **Main Test Class**: `BackendApplicationTests.java`

## 📝 Development Notes

- **Lombok**: Used throughout for reducing boilerplate
- **Validation**: Comprehensive input validation on DTOs
- **Exception Handling**: Global exception handler with standardized error responses
- **Database Seeding**: Initial data population through `DatabaseSeeder`

## 🔄 Build & Deployment

### Build
```bash
./mvnw clean install
```

### Run
```bash
./mvnw spring-boot:run
```

### Package
```bash
./mvnw package
```

## 📞 Support

For questions or issues related to the AgriFinance backend:
- Check the API documentation at `/swagger-ui.html`
- Review the application logs for debugging
- Ensure MySQL is running and accessible

---

*This index provides a comprehensive overview of the AgriFinance backend project structure, features, and setup instructions.* 