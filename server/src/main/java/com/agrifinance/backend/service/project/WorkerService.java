package com.agrifinance.backend.service.project;

import com.agrifinance.backend.dto.worker.WorkerDTO;
import com.agrifinance.backend.dto.worker.CreateWorkerRequest;
import com.agrifinance.backend.dto.worker.UpdateWorkerRequest;
import com.agrifinance.backend.exception.ResourceNotFoundException;
import com.agrifinance.backend.exception.WorkerNotFoundException;
import com.agrifinance.backend.mapper.project.WorkerMapper;
import com.agrifinance.backend.model.project.Worker;
import com.agrifinance.backend.model.user.User;
import com.agrifinance.backend.repository.WorkerRepository;
import com.agrifinance.backend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class WorkerService {
    private final WorkerRepository workerRepository;
    private final UserService userService;
    private final WorkerMapper workerMapper;

    @Transactional
    public WorkerDTO createWorker(CreateWorkerRequest request, UUID userId) {
        // Get the user entity
        User user = userService.getUserById(userId);
        List<Worker> existingWorkers=user.getWorkers();
        Worker existingWorker = workerRepository.findByEmail(request.getEmail());

        // Check if email is already in use by this user
        if (existingWorker != null) {
            throw new IllegalArgumentException("Email already in use");
        }

        // Create and save the new worker
        Worker worker = new Worker();
        worker.setNames(request.getNames());
        worker.setEmail(request.getEmail());
        worker.setPhoneNumber(request.getPhoneNumber());
        worker.setCreatedAt(LocalDateTime.now());
        worker.setUpdatedAt(LocalDateTime.now());

        Worker savedWorker = workerRepository.save(worker);
        existingWorkers.add(savedWorker);
        user.setWorkers(existingWorkers);
        userService.saveUser(user);
        return workerMapper.toDTO(savedWorker);
    }

    @Transactional(readOnly = true)
    public List<WorkerDTO> getAllWorkers() {
        return workerMapper.toDTOs(workerRepository.findAll());
    }

    public List<WorkerDTO> getWorkersByUser(UUID userId) {
        User user = userService.getUserById(userId);
        return workerMapper.toDTOs(user.getWorkers());
    }

    @Transactional(readOnly = true)
    public WorkerDTO getWorkerById(UUID id, UUID userId) {
        // Find the worker for this user
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker", "id", id));

        return workerMapper.toDTO(worker);
    }

    @Transactional
    public WorkerDTO updateWorker(UpdateWorkerRequest request, UUID userId) {
        // Find the existing worker
        Worker worker = workerRepository.findById(UUID.fromString(request.getId()))
                .orElseThrow(() -> new WorkerNotFoundException());

        // Check if email is already in use by another worker of this user
        if (request.getEmail() != null &&
                !request.getEmail().equals(worker.getEmail()) &&
                workerRepository.findByEmail(request.getEmail()) != null) {
            throw new IllegalArgumentException("Email already in use by another worker");
        }

        // Update fields if they are provided in the request
        if (request.getNames() != null) {
            worker.setNames(request.getNames());
        }
        if (request.getEmail() != null) {
            worker.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            worker.setPhoneNumber(request.getPhoneNumber());
        }

        worker.setUpdatedAt(LocalDateTime.now());
        Worker updatedWorker = workerRepository.save(worker);
        return workerMapper.toDTO(updatedWorker);
    }

    @Transactional
    public void deleteWorker(UUID id, UUID userId) {
        // Find and delete the worker
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new WorkerNotFoundException());

        workerRepository.delete(worker);
    }
}
