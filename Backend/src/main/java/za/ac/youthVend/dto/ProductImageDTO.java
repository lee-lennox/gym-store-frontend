package za.ac.youthVend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageDTO {

    private Integer imageId;
    private Integer productId;
    private String url;
    private String altText;
    private Integer priority;
}
