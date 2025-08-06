package com.agrifinance.backend.dto.worker;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for {@link com.agrifinance.backend.model.project.Worker}
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerDTO {
    private String id;
    private String names;
    private String email;
    private String phoneNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
}
