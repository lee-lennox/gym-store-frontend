package za.ac.youthVend.service;

import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.OrderStatus;

import java.util.List;

public interface IOrderService extends IService<Order, Integer> {

    List<Order> findByUser(User user);

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByUserEmail(String email);

    /**
     * Find all orders for a specific user by their user ID.
     * Used for user-specific order retrieval via JWT authentication.
     *
     * @param userId The ID of the logged-in user
     * @return List of orders belonging to the specified user
     */
    List<Order> findByUserId(Integer userId);
}
