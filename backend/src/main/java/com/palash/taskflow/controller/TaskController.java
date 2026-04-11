package com.palash.taskflow.controller;

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

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/tasks")
    public ResponseEntity<TasksResponse> getAllTasks() {
        return ResponseEntity.ok(new TasksResponse(taskService.getAllTasksForCurrentUser()));
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TasksResponse> getTasks(
            @PathVariable UUID projectId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) UUID assignee
    ) {
        return ResponseEntity.ok(new TasksResponse(taskService.getTasksByProjectWithFilters(projectId, status, assignee)));
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskDTO> createTask(
            @PathVariable UUID projectId,
            @Valid @RequestBody TaskRequest request
    ) {
        return new ResponseEntity<>(taskService.createTask(projectId, request), HttpStatus.CREATED);
    }

    @PatchMapping("/tasks/{id}")
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable UUID id,
            @RequestBody TaskRequest request
    ) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
