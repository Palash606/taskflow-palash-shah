package com.palash.taskflow.service;

import com.palash.taskflow.dto.*;
import com.palash.taskflow.entity.Project;
import com.palash.taskflow.entity.User;
import com.palash.taskflow.repository.ProjectRepository;
import com.palash.taskflow.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final SecurityUtils securityUtils;

    @Transactional(readOnly = true)
    public PaginatedResponse<ProjectDTO> getAllProjects(int page, int limit) {
        User currentUser = securityUtils.getCurrentUser();
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Project> projectPage = projectRepository.findProjectsForUser(currentUser.getId(), pageable);

        return PaginatedResponse.<ProjectDTO>builder()
                .items(projectPage.getContent().stream().map(this::mapToDTO).collect(Collectors.toList()))
                .total(projectPage.getTotalElements())
                .page(page)
                .limit(limit)
                .build();
    }

    @Transactional
    public ProjectDTO createProject(ProjectRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(currentUser)
                .build();

        return mapToDTO(projectRepository.save(project));
    }

    @Transactional(readOnly = true)
    public ProjectStatsDTO getProjectStats(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        Map<String, Long> stats = project.getTasks().stream()
                .collect(Collectors.groupingBy(task -> task.getStatus().name(), Collectors.counting()));

        return ProjectStatsDTO.builder()
                .totalTasks(project.getTasks().size())
                .tasksByStatus(stats)
                .build();
    }

    @Transactional
    public void deleteProject(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        
        User currentUser = securityUtils.getCurrentUser();
        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden: You are not the owner of this project");
        }
        
        projectRepository.delete(project);
    }

    private ProjectDTO mapToDTO(Project project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .ownerId(project.getOwner().getId())
                .createdAt(project.getCreatedAt())
                .build();
    }
}
