# 🌾 AgriFinance Backend

A comprehensive Spring Boot backend application for agricultural finance management, providing loan services, project tracking, and user management for farmers and agricultural businesses.

## 🚀 **Features**

### **Authentication & Authorization**

- ✅ **User Registration** - Secure signup with validation
- ✅ **User Login** - JWT-based authentication
- ✅ **Admin Login** - Separate admin authentication
- ✅ **Role-based Access Control** - USER and ADMIN roles
- ✅ **Password Hashing** - BCrypt encryption

### **Loan Management**

- ✅ **Loan Applications** - Farmers can apply for loans
- ✅ **Loan Products** - Different loan types (Crop, Equipment, etc.)
- ✅ **Payment Tracking** - Monthly payment schedules
- ✅ **Loan Analytics** - Payment history and statistics
- ✅ **Admin Loan Management** - Approve/reject loans

### **Project Management**

- ✅ **Project Creation** - Farmers can create agricultural projects
- ✅ **Project Goals** - Track project milestones
- ✅ **Project Analytics** - Progress tracking and reporting
- ✅ **Admin Project Management** - Monitor all projects

### **User Management**

- ✅ **User Profiles** - Complete farmer profiles
- ✅ **Address Management** - Location tracking
- ✅ **Farm Information** - Farm type, size, location
- ✅ **Admin User Management** - User administration

## 🏗️ **Architecture**

### **Technology Stack**

- **Framework**: Spring Boot 3.2.0
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security
- **Documentation**: SpringDoc OpenAPI 3
- **Build Tool**: Maven
- **Java Version**: 21

### **Package Structure**

```
src/main/java/com/agrifinance/backend/
├── BackendApplication.java
├── config/                          # Configuration classes
├── controller/                      # REST API controllers
│   ├── auth/                       # Authentication controllers
│   ├── loan/                       # Loan management
│   ├── project/                    # Project management
│   └── admin/                      # Admin functionality
├── service/                        # Business logic layer
│   ├── auth/                       # Authentication services
│   ├── loan/                       # Loan business logic
│   └── project/                    # Project business logic
├── repository/                     # Data access layer
├── model/                          # Entity classes
│   ├── user/                       # User-related entities
│   ├── loan/                       # Loan-related entities
│   └── project/                    # Project-related entities
├── dto/                            # Data Transfer Objects
│   ├── common/                     # Common DTOs
│   ├── auth/                       # Authentication DTOs
│   ├── loan/                       # Loan DTOs
│   └── project/                    # Project DTOs
├── security/                       # Security configuration
│   ├── config/                     # Security config
│   ├── jwt/                        # JWT utilities
│   └── service/                    # Security services
├── exception/                      # Exception handling
└── util/                           # Utility classes
```

## 🚀 **Getting Started**

### **Prerequisites**

- Java 21 or higher
- MySQL 8.0 or higher
- Maven 3.6+

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Configure Database**
   - Create MySQL database: `agrifinance_db`
   - Update `application.properties` with your database credentials

3. **Run the Application**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

4. **Access the Application**
   - **API Base URL**: `http://localhost:8089`
   - **Swagger UI**: `http://localhost:8089/swagger-ui.html`
   - **API Documentation**: `http://localhost:8089/v3/api-docs`

## 📚 **API Documentation**

### **Authentication Endpoints**

#### **POST /api/auth/signup**

Register a new user account.
```json
{
  "firstName": "John",
  "lastName": "Farmer",
  "email": "john@example.com",
  "password": "password123"
}
```

#### **POST /api/auth/login**

Authenticate user and get JWT token.
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### **POST /api/auth/admin-login**

Admin authentication.
```json
{
  "email": "admin@agrifinance.com",
  "password": "admin123"
}
```

### **Loan Endpoints**

#### **GET /api/loans/overview**

Get user's loan overview.

#### **POST /api/loans/apply**

Apply for a new loan.
```json
{
  "amount": 5000.0,
  "type": "CROP",
  "term": "12",
  "termType": "months",
  "interest": 8.5,
  "purpose": "Maize farming"
}
```

#### **GET /api/loans/payments**

Get loan payment schedule.

### **Project Endpoints**

#### **GET /api/projects**

Get user's projects.

#### **POST /api/projects**

Create a new project.
```json
{
  "name": "Maize Expansion",
  "description": "Expanding maize farm by 5 acres",
  "type": "CROP",
  "goals": [
    {
      "name": "Land Preparation",
      "description": "Prepare 5 acres for planting",
      "priority": "HIGH",
      "targetDate": "2024-03-01T00:00:00"
    }
  ]
}
```

### **Admin Endpoints**

#### **GET /api/admin/dashboard**

Get admin dashboard statistics.

#### **GET /api/admin/users**

Get all users (admin only).

#### **GET /api/admin/loans**

Get all loans (admin only).

## 🔧 **Configuration**

### **Database Configuration**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/agrifinance_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### **JWT Configuration**

```properties
jwt.secret=your_jwt_secret_key_here
jwt.expiration=86400000
```

### **Server Configuration**

```properties
server.port=8089
```

## 🛡️ **Security Features**

- **JWT Authentication** - Stateless authentication
- **Password Hashing** - BCrypt encryption
- **Role-based Authorization** - USER and ADMIN roles
- **Input Validation** - Comprehensive request validation
- **CORS Configuration** - Cross-origin resource sharing
- **Global Exception Handling** - Consistent error responses

## 📊 **Database Schema**

### **User Entity**

- `id` (UUID) - Primary key
- `email` (String) - Unique email address
- `password` (String) - Hashed password
- `firstName` (String) - User's first name
- `lastName` (String) - User's last name
- `phone` (String) - Contact number
- `farmType` (String) - Type of farming
- `farmSize` (Double) - Farm size in acres
- `location` (String) - Farm location
- `role` (Role) - USER or ADMIN
- `status` (String) - ACTIVE or INACTIVE
- `address` (Address) - Embedded address

### **Loan Entity**

- `id` (UUID) - Primary key
- `user` (User) - Loan applicant
- `amount` (Double) - Loan amount
- `interest` (Double) - Interest rate
- `status` (String) - PENDING, APPROVED, REJECTED
- `type` (String) - SEED, EQUIPMENT, etc.
- `term` (String) - Loan term
- `createdAt` (LocalDateTime) - Application date
- `updatedAt` (LocalDateTime) - Last update
- `payments` (List<LoanPayment>) - Payment schedule

### **Project Entity**

- `id` (UUID) - Primary key
- `user` (User) - Project owner
- `name` (String) - Project name
- `description` (String) - Project description
- `status` (String) - ACTIVE, COMPLETED, ON_HOLD
- `type` (String) - CROP, LIVESTOCK, etc.
- `createdAt` (LocalDateTime) - Creation date
- `updatedAt` (LocalDateTime) - Last update
- `goals` (List<ProjectGoal>) - Project goals

## 🧪 **Testing**

### **Run Tests**

```bash
./mvnw test
```

### **API Testing**

Use the Swagger UI at `http://localhost:8089/swagger-ui.html` to test all endpoints.

## 🚀 **Deployment**

### **Build JAR**

```bash
./mvnw clean package
```

### **Run JAR**

```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### **Docker Deployment**

```dockerfile
FROM openjdk:21-jdk-slim
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8089
ENTRYPOINT ["java","-jar","/app.jar"]
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 **Support**

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

## 🔄 **Changelog**

### **v1.0.0** (Current)

- ✅ User authentication and authorization
- ✅ Loan management system
- ✅ Project tracking
- ✅ Admin dashboard
- ✅ Comprehensive API documentation
- ✅ Security implementation
- ✅ Database integration

---

**Built with ❤️ for the agricultural community**
