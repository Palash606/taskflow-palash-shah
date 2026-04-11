package com.palash.taskflow.service;

import com.palash.taskflow.dto.*;
import com.palash.taskflow.entity.Project;
import com.palash.taskflow.entity.Task;
import com.palash.taskflow.entity.TaskPriority;
import com.palash.taskflow.entity.TaskStatus;
import com.palash.taskflow.entity.User;
import com.palash.taskflow.repository.ProjectRepository;
import com.palash.taskflow.repository.TaskRepository;
import com.palash.taskflow.repository.UserRepository;
import com.palash.taskflow.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    @Transactional(readOnly = true)
    public List<TaskDTO> getAllTasksForCurrentUser() {
        User currentUser = securityUtils.getCurrentUser();
        return taskRepository.findAllByUser(currentUser, org.springframework.data.domain.Pageable.unpaged())
                .getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<TaskDTO> getPaginatedTasks(UUID projectId, TaskStatus status, UUID assigneeId, int page,
            int limit) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        Pageable pageable = PageRequest.of(page - 1, limit);
        String statusStr = status != null ? status.name() : null;
        Page<Task> taskPage = taskRepository.findTasksByProjectWithFilters(project, statusStr, assigneeId, pageable);

        return PaginatedResponse.<TaskDTO>builder()
                .items(taskPage.getContent().stream().map(this::mapToDTO).collect(Collectors.toList()))
                .total(taskPage.getTotalElements())
                .page(page)
                .limit(limit)
                .build();
    }

    @Transactional
    public TaskDTO createTask(UUID projectId, TaskRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        User currentUser = securityUtils.getCurrentUser();

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignee not found"));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.todo)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.medium)
                .project(project)
                .creator(currentUser)
                .assignee(assignee)
                .dueDate(request.getDueDate())
                .build();

        return mapToDTO(taskRepository.save(task));
    }

    @Transactional
    public TaskDTO updateTask(UUID id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (request.getTitle() != null)
            task.setTitle(request.getTitle());
        if (request.getDescription() != null)
            task.setDescription(request.getDescription());
        if (request.getStatus() != null)
            task.setStatus(request.getStatus());
        if (request.getPriority() != null)
            task.setPriority(request.getPriority());
        if (request.getDueDate() != null)
            task.setDueDate(request.getDueDate());

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignee not found"));
            task.setAssignee(assignee);
        }

        return mapToDTO(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        User currentUser = securityUtils.getCurrentUser();

        // Project owner or Task creator only
        boolean isOwner = task.getProject().getOwner().getId().equals(currentUser.getId());
        boolean isCreator = task.getCreator().getId().equals(currentUser.getId());

        if (!isOwner && !isCreator) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Forbidden: You do not have permission to delete this task");
        }

        taskRepository.delete(task);
    }

    private TaskDTO mapToDTO(Task task) {
        return TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .projectId(task.getProject().getId())
                .creatorId(task.getCreator().getId())
                .assigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null)
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
