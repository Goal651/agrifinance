package com.agrifinance.backend.repository;

import com.agrifinance.backend.model.project.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID>, JpaSpecificationExecutor<Project> {
       List<Project> findByUserId(UUID userId);

       @Query("SELECT DISTINCT p FROM Project p " +
                     "LEFT JOIN FETCH p.goals " +
                     "LEFT JOIN FETCH p.user u")
       List<Project> findAllWithGoals();

   
       @Query("SELECT p FROM Project p " +
                     "LEFT JOIN FETCH p.goals g " +
                     "LEFT JOIN FETCH g.tasks " +
                     "WHERE p.id IN :projectIds")
       List<Project> findProjectsWithGoalsAndTasks(@Param("projectIds") List<UUID> projectIds);

       @Query("SELECT p FROM Project p " +
              "LEFT JOIN FETCH p.goals g " +
              "WHERE g.id = :goalId")
    Project findByGoalId(@Param("goalId") UUID goalId);
}
