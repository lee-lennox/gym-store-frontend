package za.ac.youthVend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.youthVend.domain.CartItem;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.repository.CartItemRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartItemService implements ICartItemService {

    private final CartItemRepository cartItemRepository;

    @Override
    public CartItem save(CartItem entity) {
        if (entity == null) throw new IllegalArgumentException("CartItem cannot be null");
        return cartItemRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CartItem> findById(Integer id) {
        return cartItemRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CartItem> findAll() {
        return cartItemRepository.findAll();
    }

    @Override
    public CartItem update(CartItem entity) {
        if (entity == null) throw new IllegalArgumentException("CartItem cannot be null");
        if (!cartItemRepository.existsById(entity.getCartItemId()))
            throw new IllegalArgumentException("CartItem not found with id: " + entity.getCartItemId());
        return cartItemRepository.save(entity);
    }

    @Override
    public void deleteById(Integer id) {
        if (!cartItemRepository.existsById(id))
            throw new IllegalArgumentException("CartItem not found with id: " + id);
        cartItemRepository.deleteById(id);
    }

    @Override
    public void delete(CartItem entity) {
        cartItemRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return cartItemRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return cartItemRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CartItem> findByUser(User user) {
        return cartItemRepository.findByUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CartItem> findByUserAndProductId(User user, Integer productId) {
        return cartItemRepository.findByUserAndProduct_ProductId(user, productId);
    }

    @Override
    public void deleteByUserAndProductId(User user, Integer productId) {
        cartItemRepository.deleteByUserAndProduct_ProductId(user, productId);
    }
}
