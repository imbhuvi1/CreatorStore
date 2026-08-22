package com.portfolio.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SocialLinkDto {
    private Long id;
    private String platform;
    private String url;
    private String icon;
    private Integer displayOrder;
}
