package za.ac.youthVend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.PaymentTransaction;
import za.ac.youthVend.repository.PaymentTransactionRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentTransactionService implements IPaymentTransactionService {

    private final PaymentTransactionRepository paymentTransactionRepository;

    @Override
    public PaymentTransaction save(PaymentTransaction entity) {
        if (entity == null) throw new IllegalArgumentException("PaymentTransaction cannot be null");
        return paymentTransactionRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PaymentTransaction> findById(Integer id) {
        return paymentTransactionRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentTransaction> findAll() {
        return paymentTransactionRepository.findAll();
    }

    @Override
    public PaymentTransaction update(PaymentTransaction entity) {
        if (entity == null) throw new IllegalArgumentException("PaymentTransaction cannot be null");
        if (!paymentTransactionRepository.existsById(entity.getPaymentId()))
            throw new IllegalArgumentException("PaymentTransaction not found with id: " + entity.getPaymentId());
        return paymentTransactionRepository.save(entity);
    }

    @Override
    public void deleteById(Integer id) {
        if (!paymentTransactionRepository.existsById(id))
            throw new IllegalArgumentException("PaymentTransaction not found with id: " + id);
        paymentTransactionRepository.deleteById(id);
    }

    @Override
    public void delete(PaymentTransaction entity) {
        paymentTransactionRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return paymentTransactionRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return paymentTransactionRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PaymentTransaction> findByOrder(Order order) {
        return paymentTransactionRepository.findByOrder(order);
    }
}
