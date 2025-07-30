#!/bin/bash

# Fix import statements for the reorganized package structure

echo "Fixing import statements..."

# Update all files to use correct imports
find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.model\.User/import com.agrifinance.backend.model.user.User/g' {} \;
find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.model\.Role/import com.agrifinance.backend.model.user.Role/g' {} \;
find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.model\.Address/import com.agrifinance.backend.model.user.Address/g' {} \;

find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.model\.Loan/import com.agrifinance.backend.model.loan.Loan/g' {} \;
find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.model\.LoanProduct/import com.agrifinance.backend.model.loan.LoanProduct/g' {} \;
find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.model\.LoanPayment/import com.agrifinance.backend.model.loan.LoanPayment/g' {} \;

find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.model\.Project/import com.agrifinance.backend.model.project.Project/g' {} \;
find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.model\.ProjectGoal/import com.agrifinance.backend.model.project.ProjectGoal/g' {} \;

find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.dto\.ApiResponse/import com.agrifinance.backend.dto.common.ApiResponse/g' {} \;
find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.dto\.AuthRequest/import com.agrifinance.backend.dto.auth.AuthRequest/g' {} \;
find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.dto\.AuthResponse/import com.agrifinance.backend.dto.auth.AuthResponse/g' {} \;
find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.dto\.SignupRequest/import com.agrifinance.backend.dto.auth.SignupRequest/g' {} \;

find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.dto\.LoanDTO/import com.agrifinance.backend.dto.loan.LoanDTO/g' {} \;
find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.dto\.LoanRequest/import com.agrifinance.backend.dto.loan.LoanRequest/g' {} \;
find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.dto\.LoanProductDTO/import com.agrifinance.backend.dto.loan.LoanProductDTO/g' {} \;
find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.dto\.LoanPaymentDTO/import com.agrifinance.backend.dto.loan.LoanPaymentDTO/g' {} \;

find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.dto\.ProjectDTO/import com.agrifinance.backend.dto.project.ProjectDTO/g' {} \;
find src/main/java/com/agrifinance/backend -name "*.java" -exec sed -i 's/import com.agrifinance.backend.dto\.ProjectGoalDTO/import com.agrifinance.backend.dto.project.ProjectGoalDTO/g' {} \;

echo "Import statements updated!" 