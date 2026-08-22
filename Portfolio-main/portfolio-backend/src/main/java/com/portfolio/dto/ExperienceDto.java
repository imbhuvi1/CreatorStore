package com.portfolio.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExperienceDto {
    private Long id;
    private String organization;
    private String role;
    private String duration;
    private String location;
    private String responsibilities;
    private String technologies;
    private String achievements;
    private Integer displayOrder;
}
