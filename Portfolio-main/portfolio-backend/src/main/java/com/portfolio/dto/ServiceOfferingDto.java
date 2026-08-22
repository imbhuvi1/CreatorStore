package com.portfolio.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ServiceOfferingDto {
    private Long id;
    private String name;
    private String description;
    private String tools;
    private String startingPrice;
    private String icon;
    private Integer displayOrder;
}
