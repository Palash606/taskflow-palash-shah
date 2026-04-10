package com.palash.taskflow.dto;

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
    private UUID project_id; // Using project_id as per mock spec requirement in appendix
    private UUID creator_id;
    private UUID assignee_id;
    private LocalDate due_date;
    private OffsetDateTime created_at;
    private OffsetDateTime updated_at;
}
