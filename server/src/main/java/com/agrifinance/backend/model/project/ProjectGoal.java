package com.agrifinance.backend.model.project;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.agrifinance.backend.model.enums.GoalStatus;
import com.agrifinance.backend.model.enums.TaskStatus;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "project_goals")
public class ProjectGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToMany( cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "project_goal_id") 
    private List<GoalTask> tasks;

    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    private GoalStatus status;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.tasks = new ArrayList<>();
        if (this.status == null) {
            this.status = GoalStatus.NOT_STARTED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void updateStatus() {
        if (tasks == null || tasks.isEmpty()) {
            this.status = GoalStatus.NOT_STARTED;
            return;
        }

        boolean allTasksCompleted = tasks.stream()
                .allMatch(task -> task.getStatus() == TaskStatus.COMPLETED);

        boolean anyTaskInProgress = tasks.stream()
                .anyMatch(task -> task.getStatus() == TaskStatus.IN_PROGRESS);

        if (allTasksCompleted) {
            this.status = GoalStatus.COMPLETED;
            this.completedAt = LocalDateTime.now();
        } else if (anyTaskInProgress || this.status == GoalStatus.NOT_STARTED) {
            this.status = GoalStatus.IN_PROGRESS;
        }
    }

}
