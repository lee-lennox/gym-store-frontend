package za.ac.youthVend.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.youthVend.domain.CartItem;
import za.ac.youthVend.domain.Product;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.UserRole;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CartItemFactoryTest {

    private final User testUser = UserFactory.createUser(
            "John Doe",
            "john.doe@example.com",
            "password123",
            UserRole.BUYER
    );

    private final Product testProduct = Product.builder()

            .name("Dumbbell")
            .description("A 5kg dumbbell")
            .price(new BigDecimal("199.99"))
            .build();

    @Test
    @Order(1)
    void createCartItem_WithAllFields() {
        CartItem item = CartItemFactory.createCartItem(
                testUser,
                testProduct,
                2,
                new BigDecimal("199.99")
        );

        assertNotNull(item);
        assertEquals(testUser, item.getUser());
        assertEquals(testProduct, item.getProduct());
        assertEquals(2, item.getQuantity());
        assertEquals(new BigDecimal("199.99"), item.getUnitPrice());
    }

    @Test
    @Order(2)
    void createFromProduct_WithoutUnitPrice() {
        CartItem item = CartItemFactory.createFromProduct(
                testUser,
                testProduct,
                3
        );

        assertNotNull(item);
        assertEquals(testUser, item.getUser());
        assertEquals(testProduct, item.getProduct());
        assertEquals(3, item.getQuantity());
        assertEquals(testProduct.getPrice(), item.getUnitPrice());
    }

    @Test
    @Order(3)
    void createCartItem_WithNullUser_ShouldThrowException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            CartItemFactory.createCartItem(
                    null,
                    testProduct,
                    1,
                    new BigDecimal("199.99")
            );
        });

        assertTrue(exception.getMessage().contains("User cannot be null"));
    }

    @Test
    @Order(4)
    void createCartItem_WithNullProduct_ShouldThrowException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            CartItemFactory.createCartItem(
                    testUser,
                    null,
                    1,
                    new BigDecimal("199.99")
            );
        });

        assertTrue(exception.getMessage().contains("Product cannot be null"));
    }

    @Test
    @Order(5)
    void createCartItem_WithInvalidQuantity_ShouldThrowException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            CartItemFactory.createCartItem(
                    testUser,
                    testProduct,
                    0,
                    new BigDecimal("199.99")
            );
        });

        assertTrue(exception.getMessage().contains("Quantity must be at least"));
    }

    @Test
    @Order(6)
    void createCartItem_WithNullUnitPrice_ShouldThrowException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            CartItemFactory.createCartItem(
                    testUser,
                    testProduct,
                    1,
                    null
            );
        });

        assertTrue(exception.getMessage().contains("Unit price must be greater than zero"));
    }

    @Test
    @Order(7)
    void createCartItem_WithZeroUnitPrice_ShouldThrowException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            CartItemFactory.createCartItem(
                    testUser,
                    testProduct,
                    1,
                    BigDecimal.ZERO
            );
        });

        assertTrue(exception.getMessage().contains("Unit price must be greater than zero"));
    }

    @Test
    @Order(8)
    void createCartItem_WithNegativeUnitPrice_ShouldThrowException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            CartItemFactory.createCartItem(
                    testUser,
                    testProduct,
                    1,
                    new BigDecimal("-10.00")
            );
        });

        assertTrue(exception.getMessage().contains("Unit price must be greater than zero"));
    }
}
