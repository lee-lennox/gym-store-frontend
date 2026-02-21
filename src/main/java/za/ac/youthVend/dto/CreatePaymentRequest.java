package za.ac.youthVend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import za.ac.youthVend.domain.enums.PaymentStatus;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentRequest {
    private Integer orderId;
    private BigDecimal amount;
    private String provider;
    private PaymentStatus status;
}
