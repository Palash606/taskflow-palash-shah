package com.palash.taskflow.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.palash.taskflow.entity.TaskPriority;
import com.palash.taskflow.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private TaskStatus status;
    
    private TaskPriority priority;
    
    @JsonProperty("assignee_id")
    private UUID assignee_id;
    
    @JsonProperty("due_date")
    private LocalDate due_date;
}
