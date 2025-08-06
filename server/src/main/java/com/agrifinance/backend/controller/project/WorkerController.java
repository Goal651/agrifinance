package com.agrifinance.backend.controller.project;

import com.agrifinance.backend.dto.common.ApiResponse;
import com.agrifinance.backend.dto.worker.WorkerDTO;
import com.agrifinance.backend.dto.worker.CreateWorkerRequest;
import com.agrifinance.backend.dto.worker.UpdateWorkerRequest;
import com.agrifinance.backend.service.project.WorkerService;
import com.agrifinance.backend.service.user.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
public class WorkerController {
        private final WorkerService workerService;
        private final UserService userService;

        @PostMapping
        public ResponseEntity<ApiResponse<WorkerDTO>> createWorker(
                        @Valid @RequestBody CreateWorkerRequest request,
                        Principal principal) {
                UUID userId = userService.getUserByEmail(principal.getName()).getId();
                WorkerDTO worker = workerService.createWorker(request, userId);
                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(new ApiResponse<>(true, worker, "Worker created successfully"));
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<WorkerDTO>>> getUserWorkers(
                        Principal principal) {
                UUID userId = userService.getUserByEmail(principal.getName()).getId();
                return ResponseEntity.ok(
                                new ApiResponse<>(true,
                                                workerService.getWorkersByUser(userId),
                                                "Workers retrieved successfully"));
        }

        @GetMapping("/{workerId}")
        public ResponseEntity<ApiResponse<WorkerDTO>> getWorker(
                        @PathVariable UUID workerId,
                        Principal principal) {
                UUID userId = userService.getUserByEmail(principal.getName()).getId();
                return ResponseEntity.ok(
                                new ApiResponse<>(true,
                                                workerService.getWorkerById(workerId, userId),
                                                "Worker retrieved successfully"));
        }

        @PutMapping
        public ResponseEntity<ApiResponse<WorkerDTO>> updateWorker(
                        @Valid @RequestBody UpdateWorkerRequest request,
                        Principal principal) {
                UUID userId = userService.getUserByEmail(principal.getName()).getId();
                return ResponseEntity.ok(
                                new ApiResponse<>(true,
                                                workerService.updateWorker( request, userId),
                                                "Worker updated successfully"));
        }

        @DeleteMapping("/{workerId}")
        public ResponseEntity<ApiResponse<Void>> deleteWorker(
                        @PathVariable UUID workerId,
                        Principal principal) {
                UUID userId = userService.getUserByEmail(principal.getName()).getId();
                workerService.deleteWorker(workerId, userId);
                return ResponseEntity.ok(
                                new ApiResponse<>(true, null, "Worker deleted successfully"));
        }
}
