package za.ac.youthVend.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.OrderItem;
import za.ac.youthVend.domain.Product;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.UserRole;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class OrderItemFactoryTest {

    /* =========================
       TEST HELPERS
       ========================= */

    private User createTestUser() {
        return UserFactory.createUser("Test User", "test@example.com", "password123", UserRole.BUYER);
    }

    private Product createTestProduct() {
        return Product.builder()
                .name("Test Product")
                .description("A test product")
                .price(new BigDecimal("100.00"))
                .build();
    }

    private Order createTestOrder(User user) {
        Product product = createTestProduct();
        OrderItem item = OrderItem.builder()
                .product(product)
                .quantity(1)
                .unitPrice(product.getPrice())
                .build();
        return OrderFactory.createNewOrder(user, java.util.List.of(item), product.getPrice());
    }

    private OrderItem createTestOrderItem(Order order, Product product) {
        return OrderItemFactory.createFromProduct(order, product, 2);
    }

    /* =========================
       TEST CASES
       ========================= */

    @Test
    @org.junit.jupiter.api.Order(1)
    void testCreateFromProduct_WithValidData() {
        User user = createTestUser();
        Product product = createTestProduct();
        Order order = createTestOrder(user);

        OrderItem item = OrderItemFactory.createFromProduct(order, product, 2);

        assertNotNull(item);
        assertEquals(order, item.getOrder());
        assertEquals(product, item.getProduct());
        assertEquals(2, item.getQuantity());
        assertEquals(product.getPrice(), item.getUnitPrice());
    }

    @Test
    @org.junit.jupiter.api.Order(2)
    void testCreateOrderItem_WithInvalidQuantity_ShouldThrowException() {
        User user = createTestUser();
        Product product = createTestProduct();
        Order order = createTestOrder(user);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            OrderItemFactory.createFromProduct(order, product, 0);
        });

        assertTrue(exception.getMessage().contains("Quantity must be at least"));
    }

    @Test
    @org.junit.jupiter.api.Order(3)
    void testCreateOrderItem_WithNullProduct_ShouldThrowException() {
        User user = createTestUser();
        Order order = createTestOrder(user);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            OrderItemFactory.createFromProduct(order, null, 1);
        });

        assertTrue(exception.getMessage().contains("Product cannot be null"));
    }

    @Test
    @org.junit.jupiter.api.Order(4)
    void testCreateOrderItem_WithNullOrder_ShouldThrowException() {
        Product product = createTestProduct();

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            OrderItemFactory.createFromProduct(null, product, 1);
        });

        assertTrue(exception.getMessage().contains("Order cannot be null"));
    }

    @Test
    @org.junit.jupiter.api.Order(5)
    void testCreateOrderItem_WithInvalidUnitPrice_ShouldThrowException() {
        User user = createTestUser();
        Product product = createTestProduct();
        Order order = createTestOrder(user);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            OrderItemFactory.createOrderItem(order, product, 1, new BigDecimal("-10.00"));
        });

        assertTrue(exception.getMessage().contains("Unit price must be greater than zero"));
    }
}
