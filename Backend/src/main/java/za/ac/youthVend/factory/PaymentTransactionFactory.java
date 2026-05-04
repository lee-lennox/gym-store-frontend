package za.ac.youthVend.factory;

import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.PaymentTransaction;
import za.ac.youthVend.domain.enums.PaymentStatus;

import java.math.BigDecimal;

public class PaymentTransactionFactory {

    private PaymentTransactionFactory() {
        // prevent instantiation
    }

    /* =========================
       FACTORY METHODS
       ========================= */

    public static PaymentTransaction createPaymentTransaction(Order order,
                                                              BigDecimal amount,
                                                              String provider,
                                                              PaymentStatus status) {

        validateOrder(order);
        validateAmount(amount);
        validateProvider(provider);
        validateStatus(status);

        return PaymentTransaction.builder()
                .order(order)
                .amount(amount)
                .provider(provider)
                .status(status)
                .build();
    }

    public static PaymentTransaction createCompletedPayment(Order order,
                                                            BigDecimal amount,
                                                            String provider) {
        return createPaymentTransaction(order, amount, provider, PaymentStatus.COMPLETED);
    }

    /* =========================
       VALIDATION METHODS
       ========================= */

    private static void validateOrder(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null for payment");
        }
    }

    private static void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero");
        }
    }

    private static void validateProvider(String provider) {
        if (provider == null || provider.trim().isEmpty()) {
            throw new IllegalArgumentException("Payment provider cannot be empty");
        }
    }

    private static void validateStatus(PaymentStatus status) {
        if (status == null) {
            throw new IllegalArgumentException("Payment status cannot be null");
        }
    }
}
