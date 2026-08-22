package com.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "experience")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Experience {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String organization;

    @Column(nullable = false, length = 160)
    private String role;

    @Column(nullable = false, length = 120)
    private String duration;

    @Column(length = 160)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    @Column(columnDefinition = "TEXT")
    private String technologies;

    @Column(columnDefinition = "TEXT")
    private String achievements;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}
