package com.agrifinance.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler({org.springframework.security.access.AccessDeniedException.class})
    public ResponseEntity<?> handleAccessDenied(Exception ex) {
        ErrorResponse error = new ErrorResponse(403, "Forbidden", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler({org.springframework.security.core.userdetails.UsernameNotFoundException.class})
    public ResponseEntity<?> handleUserNotFound(Exception ex) {
        ErrorResponse error = new ErrorResponse(404, "Not Found", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneric(Exception ex) {
        ErrorResponse error = new ErrorResponse(500, "Internal Server Error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
