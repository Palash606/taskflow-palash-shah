package com.palash.taskflow.repository;

import com.palash.taskflow.entity.Project;
import com.palash.taskflow.entity.Task;
import com.palash.taskflow.entity.TaskStatus;
import com.palash.taskflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    
    @Query("SELECT t FROM Task t WHERE t.project = :project " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:assignee IS NULL OR t.assignee = :assignee)")
    List<Task> findTasksByProjectWithFilters(
            @Param("project") Project project,
            @Param("status") TaskStatus status,
            @Param("assignee") User assignee
    );
}
