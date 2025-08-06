package com.agrifinance.backend.dto.admin;

import lombok.Data;

@Data
public class UserCreationRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;
}
