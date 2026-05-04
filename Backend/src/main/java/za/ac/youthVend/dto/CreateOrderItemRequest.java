package za.ac.youthVend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderItemRequest {
    private Integer orderId;
    private Integer productId;
    private Integer quantity;
    private BigDecimal price;
}
