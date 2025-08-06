package com.agrifinance.backend.model.project;

import jakarta.persistence.*;
import lombok.*;

import com.agrifinance.backend.model.enums.ProjectStatus;
import com.agrifinance.backend.model.user.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    private LocalDateTime targetDate;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany( cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "project_id") 
    private List<Goal> goals;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.goals = new ArrayList<>();
        if (this.status == null) {
            this.status = ProjectStatus.NOT_STARTED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }


}
