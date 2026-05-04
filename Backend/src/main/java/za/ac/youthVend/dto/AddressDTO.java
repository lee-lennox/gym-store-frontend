package za.ac.youthVend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import za.ac.youthVend.domain.enums.AddressType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {

    private Integer addressId;
    private Integer userId;      // reference to the user
    private String line1;
    private String line2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private AddressType type;    // BILLING or SHIPPING
}
