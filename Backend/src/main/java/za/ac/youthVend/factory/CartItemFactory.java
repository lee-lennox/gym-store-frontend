package za.ac.youthVend.factory;

import za.ac.youthVend.domain.CartItem;
import za.ac.youthVend.domain.Product;
import za.ac.youthVend.domain.User;

import java.math.BigDecimal;

public class CartItemFactory {

    private static final int MIN_QUANTITY = 1;

    private CartItemFactory() {
        // prevent instantiation
    }

    /* =========================
       FACTORY METHODS
       ========================= */

    public static CartItem createCartItem(User user,
                                          Product product,
                                          Integer quantity,
                                          BigDecimal unitPrice) {

        validateUser(user);
        validateProduct(product);
        validateQuantity(quantity);
        validateUnitPrice(unitPrice);

        return CartItem.builder()
                .user(user)
                .product(product)
                .quantity(quantity)
                .unitPrice(unitPrice)
                .build();
    }

    public static CartItem createFromProduct(User user,
                                             Product product,
                                             Integer quantity) {

        validateUser(user);
        validateProduct(product);
        validateQuantity(quantity);

        return CartItem.builder()
                .user(user)
                .product(product)
                .quantity(quantity)
                .unitPrice(product.getPrice())
                .build();
    }

    /* =========================
       VALIDATION METHODS
       ========================= */

    private static void validateUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
    }

    private static void validateProduct(Product product) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
    }

    private static void validateQuantity(Integer quantity) {
        if (quantity == null || quantity < MIN_QUANTITY) {
            throw new IllegalArgumentException("Quantity must be at least " + MIN_QUANTITY);
        }
    }

    private static void validateUnitPrice(BigDecimal unitPrice) {
        if (unitPrice == null || unitPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Unit price must be greater than zero");
        }
    }
}
