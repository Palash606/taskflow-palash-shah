package com.palash.taskflow.repository;

import com.palash.taskflow.entity.Project;
import com.palash.taskflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    
    @Query("SELECT p FROM Project p " +
           "WHERE p.owner.id = :userId " +
           "OR EXISTS (SELECT t FROM Task t WHERE t.project = p AND t.assignee.id = :userId)")
    Page<Project> findProjectsForUser(@Param("userId") UUID userId, Pageable pageable);
}
