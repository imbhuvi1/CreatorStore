package com.portfolio.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EducationDto {
    private Long id;
    private String degree;
    private String institution;
    private String location;
    private String startYear;
    private String endYear;
    private String grade;
    private String description;
    private Integer displayOrder;
}
