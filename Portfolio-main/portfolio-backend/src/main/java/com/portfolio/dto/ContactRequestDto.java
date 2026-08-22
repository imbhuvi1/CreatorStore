package com.portfolio.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContactRequestDto {

    @NotBlank(message = "Name is required")
    @Size(max = 160, message = "Name too long")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    @Size(max = 200)
    private String email;

    @Pattern(regexp = "^$|^[+0-9()\\-\\s]{7,20}$", message = "Invalid phone number")
    private String phone;

    @NotBlank(message = "Subject is required")
    @Size(max = 200)
    private String subject;

    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 5000, message = "Message must be 10-5000 characters")
    private String message;
}
