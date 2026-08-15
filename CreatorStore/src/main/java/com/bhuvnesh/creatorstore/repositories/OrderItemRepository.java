package com.bhuvnesh.creatorstore.repositories;

import com.bhuvnesh.creatorstore.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
