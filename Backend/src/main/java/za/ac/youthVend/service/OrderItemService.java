package za.ac.youthVend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.youthVend.domain.OrderItem;
import za.ac.youthVend.repository.OrderItemRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderItemService implements IOrderItemService {

    private final OrderItemRepository orderItemRepository;

    @Override
    public OrderItem save(OrderItem entity) {
        if (entity == null) throw new IllegalArgumentException("OrderItem cannot be null");
        return orderItemRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrderItem> findById(Integer id) {
        return orderItemRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderItem> findAll() {
        return orderItemRepository.findAll();
    }

    @Override
    public OrderItem update(OrderItem entity) {
        if (entity == null) throw new IllegalArgumentException("OrderItem cannot be null");
        if (!orderItemRepository.existsById(entity.getOrderItemId()))
            throw new IllegalArgumentException("OrderItem not found with id: " + entity.getOrderItemId());
        return orderItemRepository.save(entity);
    }

    @Override
    public void deleteById(Integer id) {
        if (!orderItemRepository.existsById(id))
            throw new IllegalArgumentException("OrderItem not found with id: " + id);
        orderItemRepository.deleteById(id);
    }

    @Override
    public void delete(OrderItem entity) {
        orderItemRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return orderItemRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return orderItemRepository.count();
    }
}
