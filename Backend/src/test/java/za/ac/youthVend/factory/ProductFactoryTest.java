package za.ac.youthVend.factory;

import org.junit.jupiter.api.Test;
import za.ac.youthVend.domain.Category;
import za.ac.youthVend.domain.Product;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class ProductFactoryTest {

    /* =========================
       HELPER METHODS
       ========================= */

    private Category createTestCategory() {
        return CategoryFactory.createCategory("Fitness", "Fitness Equipment");
    }

    /* =========================
       TEST METHODS
       ========================= */

    @Test
    void testCreateProduct_WithValidData_ShouldCreateProduct() {
        Category category = createTestCategory();

        Product product = ProductFactory.createProduct(
                "Treadmill",
                "High quality treadmill",
                BigDecimal.valueOf(1200),
                "SKU001",
                10,
                category
        );

        assertNotNull(product);
        assertEquals("Treadmill", product.getName());
        assertEquals("High quality treadmill", product.getDescription());
        assertEquals(BigDecimal.valueOf(1200), product.getPrice());
        assertEquals("SKU001", product.getSku());
        assertEquals(10, product.getStock());
        assertEquals(category, product.getCategory());
    }

    @Test
    void testCreateProduct_WithNullDescription_ShouldCreateProduct() {
        Category category = createTestCategory();

        Product product = ProductFactory.createProduct(
                "Dumbbell",
                null,
                BigDecimal.valueOf(50),
                "SKU002",
                5,
                category
        );

        assertNotNull(product);
        assertEquals("Dumbbell", product.getName());
        assertNull(product.getDescription());
        assertEquals(BigDecimal.valueOf(50), product.getPrice());
    }

    @Test
    void testCreateProduct_WithEmptyName_ShouldThrowException() {
        Category category = createTestCategory();

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ProductFactory.createProduct(
                    "",
                    "Some description",
                    BigDecimal.valueOf(100),
                    "SKU003",
                    5,
                    category
            );
        });

        assertEquals("Product name cannot be empty", exception.getMessage());
    }

    @Test
    void testCreateProduct_WithNullPrice_ShouldThrowException() {
        Category category = createTestCategory();

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ProductFactory.createProduct(
                    "Bench Press",
                    "Description",
                    null,
                    "SKU004",
                    5,
                    category
            );
        });

        assertEquals("Price must be greater than zero", exception.getMessage());
    }

    @Test
    void testCreateProduct_WithNegativeStock_ShouldThrowException() {
        Category category = createTestCategory();

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ProductFactory.createProduct(
                    "Yoga Mat",
                    "Comfortable mat",
                    BigDecimal.valueOf(20),
                    "SKU005",
                    -1,
                    category
            );
        });

        assertEquals("Stock cannot be negative", exception.getMessage());
    }

    @Test
    void testCreateProduct_WithEmptySku_ShouldThrowException() {
        Category category = createTestCategory();

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ProductFactory.createProduct(
                    "Kettlebell",
                    "Weight training",
                    BigDecimal.valueOf(60),
                    "",
                    5,
                    category
            );
        });

        assertEquals("SKU cannot be empty", exception.getMessage());
    }

    @Test
    void testCreateProduct_WithLongName_ShouldThrowException() {
        Category category = createTestCategory();
        String longName = "A".repeat(151); // longer than 150 chars

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ProductFactory.createProduct(
                    longName,
                    "Description",
                    BigDecimal.valueOf(100),
                    "SKU006",
                    5,
                    category
            );
        });

        assertEquals("Product name too long", exception.getMessage());
    }

    @Test
    void testCreateProduct_WithLongSku_ShouldThrowException() {
        Category category = createTestCategory();
        String longSku = "S".repeat(51); // longer than 50 chars

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ProductFactory.createProduct(
                    "Product",
                    "Description",
                    BigDecimal.valueOf(100),
                    longSku,
                    5,
                    category
            );
        });

        assertEquals("SKU too long", exception.getMessage());
    }

}
