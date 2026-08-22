package com.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_offering")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ServiceOffering {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(length = 300)
    private String tools;

    @Column(name = "starting_price", length = 80)
    private String startingPrice;

    @Column(length = 120)
    private String icon;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}
