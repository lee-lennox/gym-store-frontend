package za.ac.youthVend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.youthVend.domain.CartItem;
import za.ac.youthVend.domain.User;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProduct_ProductId(User user, Integer productId);

    void deleteByUserAndProduct_ProductId(User user, Integer productId);
}
