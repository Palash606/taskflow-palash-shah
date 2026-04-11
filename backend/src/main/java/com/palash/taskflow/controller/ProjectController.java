package com.palash.taskflow.controller;

import com.palash.taskflow.dto.ProjectDTO;
import com.palash.taskflow.dto.ProjectRequest;
import com.palash.taskflow.dto.ProjectsResponse;
import com.palash.taskflow.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<ProjectsResponse> getAllProjects() {
        return ResponseEntity.ok(new ProjectsResponse(projectService.getAllProjects()));
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectRequest request) {
        return new ResponseEntity<>(projectService.createProject(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable UUID id,
            @RequestBody ProjectRequest request
    ) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<com.palash.taskflow.dto.ProjectStatsDTO> getProjectStats(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.getProjectStats(id));
    }
}
