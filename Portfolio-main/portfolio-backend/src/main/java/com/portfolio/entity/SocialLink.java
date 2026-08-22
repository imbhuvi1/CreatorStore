package com.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "social_link")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SocialLink {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String platform;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(length = 120)
    private String icon;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}
