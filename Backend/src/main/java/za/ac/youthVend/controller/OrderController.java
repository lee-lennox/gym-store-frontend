package za.ac.youthVend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import za.ac.youthVend.domain.Address;
import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.OrderStatus;
import za.ac.youthVend.service.AddressService;
import za.ac.youthVend.service.EmailService;
import za.ac.youthVend.service.OrderService;
import za.ac.youthVend.service.UserService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final AddressService addressService;
    private final UserService userService;
    private final EmailService emailService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.findAll();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Integer id) {
        Optional<Order> orderOpt = orderService.findById(id);
        return orderOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Integer userId) {
        // More efficient: fetch user first, then get their orders
        User user = new User();
        user.setUserId(userId);
        List<Order> orders = orderService.findByUser(user);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/user/email/{email}")
    public ResponseEntity<List<Order>> getOrdersByUserEmail(@PathVariable String email) {
        List<Order> orders = orderService.findByUserEmail(email);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        OrderStatus orderStatus;
        try {
            orderStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        List<Order> orders = orderService.findByStatus(orderStatus);
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        // Fetch the address from database if it has an ID to avoid detached entity issue
        if (order.getShippingAddress() != null && order.getShippingAddress().getAddressId() != null) {
            Address address = addressService.findById(order.getShippingAddress().getAddressId())
                    .orElseThrow(() -> new RuntimeException("Address not found"));
            order.setShippingAddress(address);
        }
        
        // Ensure user is attached (fetch from DB if needed)
        if (order.getUser() != null && order.getUser().getUserId() != null) {
            User user = userService.getUserById(order.getUser().getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + order.getUser().getUserId()));
            order.setUser(user);
        }
        
        Order created = orderService.save(order);
        
        // Send order receipt email
        try {
            if (created.getUser() != null && created.getUser().getEmail() != null) {
                emailService.sendOrderReceiptEmail(created);
            }
        } catch (Exception e) {
            // Log error but don't fail the order creation
            System.err.println("Failed to send order receipt email: " + e.getMessage());
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Integer id, @RequestBody Order order) {
        order.setOrderId(id);
        Order updated = orderService.update(order);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> statusUpdate) {
        Optional<Order> orderOpt = orderService.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        String newStatus = statusUpdate.get("status");
        if (newStatus == null) return ResponseEntity.badRequest().build();

        try {
            order.setStatus(OrderStatus.valueOf(newStatus.toUpperCase()));
            Order updated = orderService.update(order);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable Integer id) {
        Optional<Order> orderOpt = orderService.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        order.setStatus(OrderStatus.CANCELLED);
        Order updated = orderService.update(order);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        if (!orderService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        orderService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/total")
    public ResponseEntity<Map<String, Object>> getOrderTotal(@PathVariable Integer id) {
        Optional<Order> orderOpt = orderService.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        return ResponseEntity.ok(Map.of(
                "orderId", order.getOrderId(),
                "totalAmount", order.getTotalAmount(),
                "orderStatus", order.getStatus()
        ));
    }

    /**
     * Get all orders for the currently authenticated user.
     * The user is identified via JWT token from the Authorization header.
     * Users can only see their own orders - no userId or email needs to be passed.
     *
     * @return List of orders belonging to the logged-in user
     */
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || 
            !(authentication.getPrincipal() instanceof UserDetails userDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = userDetails.getUsername();
        
        // Look up the user by email from the database to get their userId
        Optional<User> userOpt = userService.getUserByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        }

        Integer userId = userOpt.get().getUserId();
        List<Order> orders = orderService.findByUserId(userId);
        return ResponseEntity.ok(orders);
    }
}
