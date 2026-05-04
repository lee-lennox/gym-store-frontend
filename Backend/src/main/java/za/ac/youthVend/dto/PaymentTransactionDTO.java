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
public class PaymentTransactionDTO {

    private Integer paymentId;
    private Integer orderId;
    private BigDecimal amount;
    private String provider;
    private String status;
    private LocalDateTime createdAt;
}
