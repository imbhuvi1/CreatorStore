package com.portfolio.dto;

import lombok.*;

import java.time.OffsetDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectDto {
    private Long id;
    private String title;
    private String description;
    private String problemSolved;
    private String technologies;
    private String keyFeatures;
    private String role;
    private String githubUrl;
    private String demoUrl;
    private String imageUrl;
    private String category;
    private Integer displayOrder;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
