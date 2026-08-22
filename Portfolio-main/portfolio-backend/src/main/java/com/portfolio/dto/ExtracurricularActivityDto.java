package com.portfolio.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExtracurricularActivityDto {
    private Long id;
    private String title;
    private String description;
    private String activityDate;
    private String organization;
    private String proofUrl;
    private String icon;
    private Integer displayOrder;
}
