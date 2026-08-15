package com.bhuvnesh.creatorstore.repositories;

import com.bhuvnesh.creatorstore.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
