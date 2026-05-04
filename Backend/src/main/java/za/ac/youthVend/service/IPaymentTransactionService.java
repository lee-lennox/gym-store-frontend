package za.ac.youthVend.service;

import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.PaymentTransaction;

import java.util.Optional;

public interface IPaymentTransactionService extends IService<PaymentTransaction, Integer> {

    Optional<PaymentTransaction> findByOrder(Order order);
}
