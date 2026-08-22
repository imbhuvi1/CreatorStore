package com.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "achievement")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Achievement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "achieved_on", length = 40)
    private String achievedOn;

    @Column(name = "proof_url", length = 500)
    private String proofUrl;

    @Column(length = 120)
    private String icon;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}
