package com.palash.taskflow.repository;

import com.palash.taskflow.entity.Project;
import com.palash.taskflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    
    // List projects the current user owns or has tasks in
    @Query("SELECT DISTINCT p FROM Project p " +
           "LEFT JOIN p.tasks t " +
           "WHERE p.owner = :user OR t.assignee = :user")
    List<Project> findProjectsForUser(@Param("user") User user);
}
