package com.palash.taskflow.controller;

import com.palash.taskflow.dto.PaginatedResponse;
import com.palash.taskflow.dto.TaskDTO;
import com.palash.taskflow.dto.TaskRequest;
import com.palash.taskflow.dto.TasksResponse;
import com.palash.taskflow.entity.TaskStatus;
import com.palash.taskflow.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/tasks")
    public ResponseEntity<TasksResponse> getAllTasks() {
        return ResponseEntity.ok(TasksResponse.builder()
                .tasks(taskService.getAllTasksForCurrentUser())
                .build());
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<PaginatedResponse<TaskDTO>> getTasks(
            @PathVariable UUID projectId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) UUID assigneeId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(taskService.getPaginatedTasks(projectId, status, assigneeId, page, limit));
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskDTO> createTask(
            @PathVariable UUID projectId,
            @Valid @RequestBody TaskRequest request) {
        return new ResponseEntity<>(taskService.createTask(projectId, request), HttpStatus.CREATED);
    }

    @PatchMapping("/tasks/{id}")
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable UUID id,
            @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
