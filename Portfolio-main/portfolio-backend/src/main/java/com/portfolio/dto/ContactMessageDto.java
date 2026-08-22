package com.portfolio.dto;

import lombok.*;

import java.time.OffsetDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContactMessageDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String subject;
    private String message;
    private Boolean isRead;
    private OffsetDateTime createdAt;
}
