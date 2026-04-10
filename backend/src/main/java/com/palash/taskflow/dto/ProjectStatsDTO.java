package com.palash.taskflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectStatsDTO {
    private Map<String, Long> tasksByStatus;
    private Map<String, Long> tasksByAssignee;
}
