package com.bhuvnesh.creatorstore.controllers;

import com.bhuvnesh.creatorstore.dto.OrderRequest;
import com.bhuvnesh.creatorstore.entities.Order;
import com.bhuvnesh.creatorstore.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public Order createOrder(@Valid @RequestBody OrderRequest orderRequest){
        return orderService.createOrder(orderRequest);
    }

    //Get all orders
    public List<Order> getAllOrders(){
        //TODO: to be implemented
        return null;
    }

    //Get order by id
    public Order getOrderById(){
        //TODO: to be implemented
        return null;
    }

    //Get order by id

}
