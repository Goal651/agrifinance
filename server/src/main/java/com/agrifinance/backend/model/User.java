package com.agrifinance.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "`user`")
public class User {
    @Id
    private UUID id;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private String farmType;
    private Double farmSize;
    private String location;
    @Enumerated(EnumType.STRING)
    private Role role;
    private String status;
    @Embedded
    private Address address;
}
