package com.agrifinance.backend.model.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.agrifinance.backend.model.enums.Role;
import com.agrifinance.backend.model.project.Worker;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    private Role role;
    private String status;

    private final LocalDateTime createdAt = LocalDateTime.now();
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id")  // This will create a user_id foreign key in workers table
    @Builder.Default
    private List<Worker> workers = new ArrayList<>();
}
