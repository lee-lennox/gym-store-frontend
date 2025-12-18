package za.ac.youthVend.service;

import za.ac.youthVend.domain.CartItem;
import za.ac.youthVend.domain.User;

import java.util.List;
import java.util.Optional;

public interface ICartItemService extends IService<CartItem, Integer> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProductId(User user, Integer productId);

    void deleteByUserAndProductId(User user, Integer productId);
}
