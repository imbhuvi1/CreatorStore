package com.bhuvnesh.creatorstore.repositories;

import com.bhuvnesh.creatorstore.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
