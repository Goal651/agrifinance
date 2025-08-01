package com.agrifinance.backend.model.project;

import jakarta.persistence.*;
import lombok.*;

import com.agrifinance.backend.model.enums.GoalStatus;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    private LocalDateTime targetDate;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProjectGoal> goals = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = ProjectStatus.NOT_STARTED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void updateStatus() {
        if (goals == null || goals.isEmpty()) {
            this.status = ProjectStatus.NOT_STARTED;
            return;
        }

        boolean allGoalsCompleted = goals.stream()
            .allMatch(goal -> goal.getStatus() == GoalStatus.COMPLETED);
            
        boolean anyGoalInProgress = goals.stream()
            .anyMatch(goal -> goal.getStatus() == GoalStatus.IN_PROGRESS);
            
        if (allGoalsCompleted) {
            this.status = ProjectStatus.COMPLETED;
            this.completedAt = LocalDateTime.now();
        } else if (anyGoalInProgress || this.status == ProjectStatus.NOT_STARTED) {
            this.status = ProjectStatus.IN_PROGRESS;
        }
    }

    public void addGoal(ProjectGoal goal) {
        goals.add(goal);
        goal.setProject(this);
        updateStatus();
    }

    public void removeGoal(ProjectGoal goal) {
        goals.remove(goal);
        goal.setProject(null);
        updateStatus();
    }
}
