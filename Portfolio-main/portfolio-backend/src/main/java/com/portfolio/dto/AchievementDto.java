package com.portfolio.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AchievementDto {
    private Long id;
    private String title;
    private String description;
    private String achievedOn;
    private String proofUrl;
    private String icon;
    private Integer displayOrder;
}
