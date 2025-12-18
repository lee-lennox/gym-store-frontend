package za.ac.youthVend.factory;

import za.ac.youthVend.domain.Product;
import za.ac.youthVend.domain.ProductImage;

public class ProductImageFactory {

    private static final int MAX_URL_LENGTH = 2048;
    private static final int MAX_ALT_TEXT_LENGTH = 255;

    private ProductImageFactory() {
        // prevent instantiation
    }

    /* =========================
       FACTORY METHODS
       ========================= */

    public static ProductImage createProductImage(Product product, String url, String altText, Integer priority) {
        validateProduct(product);
        validateUrl(url);
        validateAltText(altText);

        return ProductImage.builder()
                .product(product)
                .url(url.trim())
                .altText(altText != null ? altText.trim() : null)
                .priority(priority)
                .build();
    }

    public static ProductImage createProductImage(Product product, String url) {
        return createProductImage(product, url, null, null);
    }

    /* =========================
       VALIDATION METHODS
       ========================= */

    private static void validateProduct(Product product) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null for image");
        }
    }

    private static void validateUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            throw new IllegalArgumentException("Image URL cannot be empty");
        }
        if (url.length() > MAX_URL_LENGTH) {
            throw new IllegalArgumentException("Image URL too long");
        }
    }

    private static void validateAltText(String altText) {
        if (altText != null && altText.length() > MAX_ALT_TEXT_LENGTH) {
            throw new IllegalArgumentException("Alt text too long");
        }
    }
}
