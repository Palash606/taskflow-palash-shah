package com.palash.taskflow.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.palash.taskflow.entity.TaskPriority;
import com.palash.taskflow.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private UUID id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    
    @JsonProperty("project_id")
    private UUID projectId;
    
    @JsonProperty("creator_id")
    private UUID creatorId;
    
    @JsonProperty("assignee_id")
    private UUID assigneeId;
    
    @JsonProperty("due_date")
    private LocalDate dueDate;
    
    @JsonProperty("created_at")
    private OffsetDateTime createdAt;
    
    @JsonProperty("updated_at")
    private OffsetDateTime updatedAt;
}
