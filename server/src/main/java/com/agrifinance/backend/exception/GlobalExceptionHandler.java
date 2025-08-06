package com.agrifinance.backend.exception;

import com.agrifinance.backend.dto.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.ok(new ApiResponse<>(false, errors, "Validation failed"));
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse<>(false, null, "Access Denied: " + ex.getMessage()));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse<>(false, null, "Authentication failed: " + ex.getMessage()));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleUsernameNotFound(UsernameNotFoundException ex) {
        return ResponseEntity.ok(new ApiResponse<>(false, null, ex.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.ok(new ApiResponse<>(false, null, "User not found: " + ex.getMessage()));
    }

    @ExceptionHandler(ProjectNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleProjectNotFound(ProjectNotFoundException ex) {
        return ResponseEntity.ok(new ApiResponse<>(false, null, "Project not found: " + ex.getMessage()));
    }

    @ExceptionHandler(GoalNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleGoalNotFound(GoalNotFoundException ex) {
        return ResponseEntity.ok(new ApiResponse<>(false, null, "Goal not found: " + ex.getMessage()));
    }

    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleTaskNotFound(TaskNotFoundException ex) {
        return ResponseEntity.ok(new ApiResponse<>(false, null, "Task not found: " + ex.getMessage()));
    }

    @ExceptionHandler(LoanNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleLoanNotFound(LoanNotFoundException ex) {
        return ResponseEntity.ok(new ApiResponse<>(false, null, "Loan not found: " + ex.getMessage()));
    }

    @ExceptionHandler(LoanProductNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleLoanProductNotFound(LoanProductNotFoundException ex) {
        return ResponseEntity.ok(new ApiResponse<>(false, null, "Loan product not found: " + ex.getMessage()));
    }

    @ExceptionHandler(SystemException.class)
    public ResponseEntity<ApiResponse<Void>> handleSystemException(SystemException ex) {
        return ResponseEntity.ok(new ApiResponse<>(false, null, "System error: " + ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        return ResponseEntity.ok(new ApiResponse<>(false, null, "An unexpected error occurred: " + ex.getMessage()));
    }
}
