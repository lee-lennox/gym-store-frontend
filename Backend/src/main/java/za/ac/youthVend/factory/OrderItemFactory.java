package za.ac.youthVend.factory;

import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.OrderItem;
import za.ac.youthVend.domain.Product;

import java.math.BigDecimal;

public class OrderItemFactory {

    private static final int MIN_QUANTITY = 1;

    private OrderItemFactory() {
        // Prevent instantiation
    }

    /* =========================
       FACTORY METHODS
       ========================= */

    public static OrderItem createOrderItem(Order order,
                                            Product product,
                                            Integer quantity,
                                            BigDecimal unitPrice) {

        validateOrder(order);
        validateProduct(product);
        validateQuantity(quantity);
        validateUnitPrice(unitPrice);

        return OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(quantity)
                .unitPrice(unitPrice)
                .build();
    }

    public static OrderItem createFromProduct(Order order,
                                              Product product,
                                              Integer quantity) {

        validateOrder(order);
        validateProduct(product);
        validateQuantity(quantity);

        return OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(quantity)
                .unitPrice(product.getPrice())
                .build();
    }

    /* =========================
       VALIDATION METHODS
       ========================= */

    private static void validateOrder(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
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
