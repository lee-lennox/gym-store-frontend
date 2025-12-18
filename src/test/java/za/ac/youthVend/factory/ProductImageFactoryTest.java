package za.ac.youthVend.factory;

import org.junit.jupiter.api.Test;
import za.ac.youthVend.domain.Product;
import za.ac.youthVend.domain.ProductImage;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class ProductImageFactoryTest {

    // Helper method to create a simple test product
    private Product createTestProduct() {
        return Product.builder()
                .name("Test Product")
                .description("Test Description")
                .price(BigDecimal.valueOf(100))
                .sku("SKU123")
                .stock(10)
                .build();
    }

    @Test
    void testCreateProductImage_WithValidData_ShouldCreateSuccessfully() {
        Product product = createTestProduct();
        String url = "http://example.com/image.jpg";
        String altText = "Test image";
        int priority = 1;

        ProductImage productImage = ProductImageFactory.createProductImage(product, url, altText, priority);

        assertNotNull(productImage);
        assertEquals(product, productImage.getProduct());
        assertEquals(url, productImage.getUrl());
        assertEquals(altText, productImage.getAltText());
        assertEquals(priority, productImage.getPriority());
    }

    @Test
    void testCreateProductImage_WithNullProduct_ShouldThrowException() {
        Exception exception = assertThrows(IllegalArgumentException.class, () ->
                ProductImageFactory.createProductImage(null, "http://example.com/image.jpg", "Alt", 1)
        );
        assertEquals("Product cannot be null for image", exception.getMessage());
    }

    @Test
    void testCreateProductImage_WithEmptyUrl_ShouldThrowException() {
        Product product = createTestProduct();

        Exception exception = assertThrows(IllegalArgumentException.class, () ->
                ProductImageFactory.createProductImage(product, "   ", "Alt", 1)
        );

        assertEquals("Image URL cannot be empty", exception.getMessage());
    }

    @Test
    void testCreateProductImage_WithTooLongUrl_ShouldThrowException() {
        Product product = createTestProduct();
        // Exceed MAX_URL_LENGTH (2048)
        String longUrl = "http://".concat("a".repeat(2042)); // 7 + 2042 = 2049

        Exception exception = assertThrows(IllegalArgumentException.class, () ->
                ProductImageFactory.createProductImage(product, longUrl, "Alt", 1)
        );

        assertEquals("Image URL too long", exception.getMessage());
    }

    @Test
    void testCreateProductImage_WithTooLongAltText_ShouldThrowException() {
        Product product = createTestProduct();
        String url = "http://example.com/image.jpg";
        // Exceed MAX_ALT_TEXT_LENGTH (255)
        String longAltText = "a".repeat(256);

        Exception exception = assertThrows(IllegalArgumentException.class, () ->
                ProductImageFactory.createProductImage(product, url, longAltText, 1)
        );

        assertEquals("Alt text too long", exception.getMessage());
    }

    @Test
    void testCreateProductImage_WithoutAltTextAndPriority_ShouldCreateSuccessfully() {
        Product product = createTestProduct();
        String url = "http://example.com/image.jpg";

        ProductImage productImage = ProductImageFactory.createProductImage(product, url);

        assertNotNull(productImage);
        assertEquals(product, productImage.getProduct());
        assertEquals(url, productImage.getUrl());
        assertNull(productImage.getAltText());
        assertNull(productImage.getPriority());
    }
}
