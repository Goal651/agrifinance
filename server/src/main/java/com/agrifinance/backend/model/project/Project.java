package com.agrifinance.backend.model.project;

import jakarta.persistence.*;
import lombok.*;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.model.project.ProjectGoal;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(indexes = @Index(name = "idx_project_user_id", columnList = "user_id"))
public class Project {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String name;
    private String description;
    private String status; // e.g., ACTIVE, COMPLETED, ON_HOLD
    private String type;   // e.g., CROP, LIVESTOCK, etc.
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectGoal> goals;
}
