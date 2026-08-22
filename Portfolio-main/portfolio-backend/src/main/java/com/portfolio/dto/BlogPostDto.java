package com.portfolio.dto;

import lombok.*;

import java.time.OffsetDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BlogPostDto {
    private Long id;
    private String slug;
    private String title;
    private String excerpt;
    private String content;
    private String coverImage;
    private String tags;
    private Integer readMinutes;
    private Boolean published;
    private OffsetDateTime publishedAt;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
