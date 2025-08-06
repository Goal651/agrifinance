package com.agrifinance.backend.dto.worker;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class AssignWorkerRequest {
    @NotNull(message = "Worker ID is required")
    private UUID workerId;
    
    @NotNull(message = "Task ID is required")
    private UUID taskId;
}
