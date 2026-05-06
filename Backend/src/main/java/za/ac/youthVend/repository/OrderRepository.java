package za.ac.youthVend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.OrderStatus;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByUser(User user);

    List<Order> findByStatus(OrderStatus status);

    @Query("SELECT o FROM Order o WHERE o.user.email = :email")
    List<Order> findByUserEmail(@Param("email") String email);

    /**
     * Find all orders for a specific user by their user ID.
     * Used for user-specific order retrieval via JWT authentication.
     */
    @Query("SELECT o FROM Order o WHERE o.user.userId = :userId")
    List<Order> findByUserId(@Param("userId") Integer userId);
}
