package com.agrifinance.backend.dto.project;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class TaskUpdateRequest extends TaskRequest {
    private String id;
}
