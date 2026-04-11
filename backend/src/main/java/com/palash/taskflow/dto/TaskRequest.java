package com.palash.taskflow.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.palash.taskflow.entity.TaskPriority;
import com.palash.taskflow.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;

    @JsonProperty("assignee_id")
    private UUID assigneeId;

    @JsonProperty("due_date")
    private OffsetDateTime dueDate;

    // Support camelCase aliases for resilience
    @JsonProperty("assigneeId")
    public void setAssigneeIdCamel(UUID assigneeId) {
        this.assigneeId = assigneeId;
    }

    @JsonProperty("dueDate")
    public void setDueDateCamel(OffsetDateTime dueDate) {
        this.dueDate = dueDate;
    }
}
