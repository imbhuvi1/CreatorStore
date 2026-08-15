package com.bhuvnesh.creatorstore.services;

import com.bhuvnesh.creatorstore.dto.OrderItemRequest;
import com.bhuvnesh.creatorstore.dto.OrderRequest;
import com.bhuvnesh.creatorstore.entities.Order;
import com.bhuvnesh.creatorstore.entities.OrderItem;
import com.bhuvnesh.creatorstore.entities.Product;
import com.bhuvnesh.creatorstore.repositories.OrderRepository;
import com.bhuvnesh.creatorstore.repositories.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.Permissions;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Order createOrder(OrderRequest orderRequest){
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        //Create an object for Order
        Order order = new Order();
        order.setCustomerEmail(orderRequest.getCustomerEmail());
        order.setCustomerName(orderRequest.getCustomerName());
        order.setStatus("CONFIRMED");


        for (OrderItemRequest itemRequest : orderRequest.getItems()){
            //Product(s) available or not
            Product product = productRepository.findById(
                    itemRequest.getProductId()
            ).orElseThrow(()-> new RuntimeException(
                    "Product not found with id: "+itemRequest.getProductId()
            ));

            //check the product stock
            if (product.getStockQuantity() < itemRequest.getQuantity()){
                throw new RuntimeException("Not enough stock for "+itemRequest.getProductId());
            }

            //calculating priceOfItem
            BigDecimal priceOfItem = product.getPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            //calculate total price
            totalPrice = totalPrice.add(priceOfItem);

            //update the product table with latest stock quantity
            product.setStockQuantity(
                    product.getStockQuantity() - itemRequest.getQuantity()
            );
            productRepository.save(product);

            //Builder pattern to make objects
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .build();

            System.out.println("It prints: "+orderItem.getQuantity());

            orderItems.add(orderItem);
        }

        //update the order object
        order.setTotalPrice(totalPrice);
        order.setOrderItems(orderItems);

        System.out.println("Prints from the list: "+orderItems.get(0).getQuantity());

        return orderRepository.save(order);
    }
}
