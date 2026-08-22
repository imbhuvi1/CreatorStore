package com.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "education")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Education {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String degree;

    @Column(nullable = false, length = 200)
    private String institution;

    @Column(length = 160)
    private String location;

    @Column(name = "start_year", length = 10)
    private String startYear;

    @Column(name = "end_year", length = 10)
    private String endYear;

    @Column(length = 60)
    private String grade;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}
