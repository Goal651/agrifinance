package com.agrifinance.backend.model.project;

import com.agrifinance.backend.model.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = TaskStatus.NOT_STARTED;
        }
    }

    @ManyToOne
    @JoinColumn(name = "worker_id")
    private Worker worker;

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void markComplete() {
        this.status = TaskStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }
}
