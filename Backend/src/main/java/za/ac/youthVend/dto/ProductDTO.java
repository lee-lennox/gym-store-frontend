package za.ac.youthVend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Integer productId;
    private String name;
    private String description;
    private BigDecimal price;
    private String sku;
    private Integer stock;
    private Integer categoryId;
    private String imagePath;
    private String imageFileName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
