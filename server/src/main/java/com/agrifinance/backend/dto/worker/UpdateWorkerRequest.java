package com.agrifinance.backend.dto.worker;

import lombok.Data;

@Data
public class    UpdateWorkerRequest {
    private String id;
    private String names;
    private String email;
    private String phoneNumber;
}
