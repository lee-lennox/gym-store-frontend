package za.ac.youthVend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {

    private Integer cartItemId;
    private Integer userId;
    private Integer productId;
    private Integer quantity;
    private BigDecimal unitPrice;
}
