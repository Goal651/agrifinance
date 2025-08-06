package com.agrifinance.backend.dto.worker;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateWorkerRequest {
    @NotBlank(message = "Name is required")
    private String names;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    private String phoneNumber;
}
