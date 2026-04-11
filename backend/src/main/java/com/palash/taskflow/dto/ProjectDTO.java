package com.palash.taskflow.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private UUID id;
    private String name;
    private String description;
    
    @JsonProperty("owner_id")
    private UUID ownerId;
    
    @JsonProperty("created_at")
    private OffsetDateTime createdAt;
    
    private List<TaskDTO> tasks;
}
