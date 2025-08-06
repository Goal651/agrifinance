package com.agrifinance.backend.repository;

import com.agrifinance.backend.model.project.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, UUID> {
   
    Worker findByEmail(String email);
}
