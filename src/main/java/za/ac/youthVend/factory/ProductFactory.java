package za.ac.youthVend.factory;

import za.ac.youthVend.domain.Category;
import za.ac.youthVend.domain.Product;

import java.math.BigDecimal;

public class ProductFactory {

    private static final int MIN_STOCK = 0;
    private static final int MAX_NAME_LENGTH = 150;
    private static final int MAX_SKU_LENGTH = 50;

    private ProductFactory() {
        // prevent instantiation
    }

    /* =========================
       FACTORY METHODS
       ========================= */

    public static Product createProduct(String name,
                                        String description,
                                        BigDecimal price,
                                        String sku,
                                        Integer stock,
                                        Category category,
                                        String imageFileName,
                                        String imagePath) {

        validateName(name);
        validateDescription(description);
        validatePrice(price);
        validateSku(sku);
        validateStock(stock);

        return Product.builder()
                .name(name.trim())
                .description(description != null ? description.trim() : null)
                .price(price)
                .sku(sku.trim())
                .stock(stock)
                .category(category)
                .imageFileName(imageFileName)
                .imagePath(imagePath)
                .build();
    }

    public static Product createProduct(String name,
                                        String description,
                                        BigDecimal price,
                                        String sku,
                                        Integer stock,
                                        Category category) {
        return createProduct(name, description, price, sku, stock, category, null, null);
    }

    /* =========================
       VALIDATION METHODS
       ========================= */

    private static void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }
        if (name.length() > MAX_NAME_LENGTH) {
            throw new IllegalArgumentException("Product name too long");
        }
    }

    private static void validateDescription(String description) {
        // optional: can be null
        if (description != null && description.trim().isEmpty()) {
            throw new IllegalArgumentException("Description cannot be empty if provided");
        }
    }

    private static void validatePrice(BigDecimal price) {
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price must be greater than zero");
        }
    }

    private static void validateSku(String sku) {
        if (sku == null || sku.trim().isEmpty()) {
            throw new IllegalArgumentException("SKU cannot be empty");
        }
        if (sku.length() > MAX_SKU_LENGTH) {
            throw new IllegalArgumentException("SKU too long");
        }
    }

    private static void validateStock(Integer stock) {
        if (stock == null || stock < MIN_STOCK) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }
    }
}
