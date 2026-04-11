package com.palash.taskflow.service;

import com.palash.taskflow.dto.ProjectDTO;
import com.palash.taskflow.dto.ProjectRequest;
import com.palash.taskflow.dto.TaskDTO;
import com.palash.taskflow.entity.Project;
import com.palash.taskflow.entity.User;
import com.palash.taskflow.repository.ProjectRepository;
import com.palash.taskflow.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final SecurityUtils securityUtils;

    @Transactional(readOnly = true)
    public List<ProjectDTO> getAllProjects() {
        User currentUser = securityUtils.getCurrentUser();
        return projectRepository.findProjectsForUser(currentUser).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
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
    public ProjectDTO getProjectById(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        return mapToDTO(project);
    }

    @Transactional
    public ProjectDTO updateProject(UUID id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        
        checkOwnership(project);

        if (request.getName() != null) {
            project.setName(request.getName());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }

        return mapToDTO(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        
        checkOwnership(project);
        projectRepository.delete(project);
    }

    @Transactional(readOnly = true)
    public com.palash.taskflow.dto.ProjectStatsDTO getProjectStats(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        
        // Count by status
        Map<String, Long> tasksByStatus = project.getTasks().stream()
                .collect(Collectors.groupingBy(task -> task.getStatus().name(), Collectors.counting()));
        
        // Count by assignee (use email or name as key)
        Map<String, Long> tasksByAssignee = project.getTasks().stream()
                .filter(task -> task.getAssignee() != null)
                .collect(Collectors.groupingBy(task -> task.getAssignee().getName(), Collectors.counting()));
        
        return com.palash.taskflow.dto.ProjectStatsDTO.builder()
                .tasksByStatus(tasksByStatus)
                .tasksByAssignee(tasksByAssignee)
                .build();
    }

    private void checkOwnership(Project project) {
        User currentUser = securityUtils.getCurrentUser();
        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden: You do not own this project");
        }
    }

    private ProjectDTO mapToDTO(Project project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .ownerId(project.getOwner().getId())
                .createdAt(project.getCreatedAt())
                .tasks(project.getTasks() != null ? project.getTasks().stream()
                        .map(task -> TaskDTO.builder()
                                .id(task.getId())
                                .title(task.getTitle())
                                .description(task.getDescription())
                                .status(task.getStatus())
                                .priority(task.getPriority())
                                .projectId(project.getId())
                                .creatorId(task.getCreator().getId())
                                .assigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null)
                                .dueDate(task.getDueDate())
                                .createdAt(task.getCreatedAt())
                                .updatedAt(task.getUpdatedAt())
                                .build())
                        .collect(Collectors.toList()) : null)
                .build();
    }
}
