package com.palash.taskflow.repository;

import com.palash.taskflow.entity.Project;
import com.palash.taskflow.entity.Task;
import com.palash.taskflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    
    @Query(value = "SELECT * FROM tasks t WHERE t.project_id = :#{#project.id} " +
           "AND (cast(:status as text) IS NULL OR t.status = cast(:status as task_status)) " +
           "AND (cast(:assigneeId as uuid) IS NULL OR t.assignee_id = cast(:assigneeId as uuid))",
           countQuery = "SELECT count(*) FROM tasks t WHERE t.project_id = :#{#project.id} " +
                        "AND (cast(:status as text) IS NULL OR t.status = cast(:status as task_status)) " +
                        "AND (cast(:assigneeId as uuid) IS NULL OR t.assignee_id = cast(:assigneeId as uuid))",
           nativeQuery = true)
    Page<Task> findTasksByProjectWithFilters(
            @Param("project") Project project,
            @Param("status") String status,
            @Param("assigneeId") UUID assigneeId,
            Pageable pageable
    );

    @Query("SELECT t FROM Task t WHERE t.project.owner = :user " +
           "OR t.creator = :user OR t.assignee = :user")
    Page<Task> findAllByUser(@Param("user") User user, Pageable pageable);
}
