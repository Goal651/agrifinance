package com.agrifinance.backend.dto.user;

import java.util.UUID;

import com.agrifinance.backend.model.enums.Role;

import lombok.Data;

@Data
public class UserDTO {
    private UUID id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Role role;
    private String status;
    
}
