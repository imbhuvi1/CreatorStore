package com.bhuvnesh.creatorstore.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {
    @NotNull(message = "Customer name is required")
    private String customerName;

    @Email(message = "Enter a valid email")
    @NotBlank(message = "Customer email is required")
    private String customerEmail;

    @Valid
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemRequest> items;
}
