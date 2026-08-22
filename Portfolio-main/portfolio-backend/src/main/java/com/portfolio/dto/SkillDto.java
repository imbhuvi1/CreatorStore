package com.portfolio.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SkillDto {
    private Long id;
    private String name;
    private String category;
    private String level;
    private String icon;
    private Integer displayOrder;
}
