package com.agrifinance.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectGoal {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    private String name;
    private String description;
    private String status; // e.g., PENDING, IN_PROGRESS, COMPLETED
    private String priority; // e.g., HIGH, MEDIUM, LOW
}
