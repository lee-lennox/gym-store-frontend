//package za.ac.youthVend.factory;
//
//import org.junit.jupiter.api.Test;
//import za.ac.youthVend.domain.*;
//import za.ac.youthVend.domain.enums.PaymentStatus;
//import za.ac.youthVend.domain.enums.UserRole;
//
//import java.math.BigDecimal;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//class PaymentTransactionFactoryTest {
//
//    /* =========================
//       HELPER METHODS
//       ========================= */
//
//    // Create a dummy user for the order
//    private User createTestUser() {
//        return UserFactory.createUser(
//                "John",
//                "john.doe@example.com",
//                "password123",
//                UserRole.BUYER
//        );
//    }
//
//    // Create a dummy order with at least one item
//    private Order createTestOrder() {
//        User user = createTestUser();
//
//        // Create a dummy category
//        Category category = CategoryFactory.createCategory("Fitness", "Fitness Equipment");
//
//        // Create a dummy product
//        Product product = ProductFactory.createProduct(
//                "Test Product",
//                "Test Description",
//                BigDecimal.valueOf(100),
//                "SKU123",
//                10,
//                category
//        );
//
//        // Create an empty order first (without items)
//        Order order = OrderFactory.createNewOrder(user, BigDecimal.valueOf(100));
//
//        // Create an order item linked to the order
//        OrderItem orderItem = OrderItemFactory.createOrderItem(
//                order,            // pass the order here
//                product,
//                1,
//                BigDecimal.valueOf(100)
//        );
//
//        // Add the order item to the order's items list
//        order.getItems().add(orderItem);
//
//        return order;
//    }
//
//    /* =========================
//       TEST METHODS
//       ========================= */
//
//    @Test
//    void testCreatePaymentTransaction_WithValidData() {
//        Order order = createTestOrder();
//
//        PaymentTransaction payment = PaymentTransactionFactory.createPaymentTransaction(
//                order,
//                BigDecimal.valueOf(100),
//                "Stripe",
//                PaymentStatus.PENDING
//        );
//
//        assertNotNull(payment);
//        assertEquals(order, payment.getOrder());
//        assertEquals(BigDecimal.valueOf(100), payment.getAmount());
//        assertEquals("Stripe", payment.getProvider());
//        assertEquals(PaymentStatus.PENDING, payment.getStatus());
//    }
//
//    @Test
//    void testCreateCompletedPayment_ShouldSetStatusToCompleted() {
//        Order order = createTestOrder();
//
//        PaymentTransaction payment = PaymentTransactionFactory.createCompletedPayment(
//                order,
//                BigDecimal.valueOf(150),
//                "PayPal"
//        );
//
//        assertNotNull(payment);
//        assertEquals(order, payment.getOrder());
//        assertEquals(BigDecimal.valueOf(150), payment.getAmount());
//        assertEquals("PayPal", payment.getProvider());
//        assertEquals(PaymentStatus.COMPLETED, payment.getStatus());
//    }
//
//    @Test
//    void testCreatePaymentTransaction_WithZeroAmount_ShouldThrowException() {
//        Order order = createTestOrder();
//
//        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
//            PaymentTransactionFactory.createPaymentTransaction(
//                    order,
//                    BigDecimal.ZERO,
//                    "Stripe",
//                    PaymentStatus.PENDING
//            );
//        });
//
//        assertEquals("Payment amount must be greater than zero", exception.getMessage());
//    }
//
//    @Test
//    void testCreatePaymentTransaction_WithNullProvider_ShouldThrowException() {
//        Order order = createTestOrder();
//
//        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
//            PaymentTransactionFactory.createPaymentTransaction(
//                    order,
//                    BigDecimal.valueOf(100),
//                    null,
//                    PaymentStatus.PENDING
//            );
//        });
//
//        assertEquals("Payment provider cannot be empty", exception.getMessage());
//    }
//
//    @Test
//    void testCreatePaymentTransaction_WithNullStatus_ShouldThrowException() {
//        Order order = createTestOrder();
//
//        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
//            PaymentTransactionFactory.createPaymentTransaction(
//                    order,
//                    BigDecimal.valueOf(100),
//                    "Stripe",
//                    null
//            );
//        });
//
//        assertEquals("Payment status cannot be null", exception.getMessage());
//    }
//}
