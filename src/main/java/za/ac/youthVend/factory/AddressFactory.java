package za.ac.youthVend.factory;

import za.ac.youthVend.domain.Address;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.AddressType;

public class AddressFactory {

    private static final int MAX_LINE_LENGTH = 255;

    private AddressFactory() {
        // Prevent instantiation
    }

    /* =========================
       FACTORY METHODS
       ========================= */

    public static Address createAddress(User user,
                                        String line1,
                                        String line2,
                                        String city,
                                        String state,
                                        String postalCode,
                                        String country,
                                        AddressType type) {

        validateUser(user);
        validateLine1(line1);
        validateCity(city);
        validateCountry(country);
        validateType(type);

        return Address.builder()
                .user(user)
                .line1(line1)
                .line2(line2)
                .city(city)
                .state(state)
                .postalCode(postalCode)
                .country(country)
                .type(type)
                .build();
    }

    public static Address createBillingAddress(User user,
                                               String line1,
                                               String city,
                                               String country) {

        return createAddress(
                user,
                line1,
                null,
                city,
                null,
                null,
                country,
                AddressType.BILLING
        );
    }

    public static Address createShippingAddress(User user,
                                                String line1,
                                                String city,
                                                String country) {

        return createAddress(
                user,
                line1,
                null,
                city,
                null,
                null,
                country,
                AddressType.SHIPPING
        );
    }

    /* =========================
       VALIDATION METHODS
       ========================= */

    private static void validateUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null for an address");
        }
    }

    private static void validateLine1(String line1) {
        if (line1 == null || line1.trim().isEmpty()) {
            throw new IllegalArgumentException("Address line1 cannot be empty");
        }
        if (line1.length() > MAX_LINE_LENGTH) {
            throw new IllegalArgumentException("Address line1 too long");
        }
    }

    private static void validateCity(String city) {
        if (city == null || city.trim().isEmpty()) {
            throw new IllegalArgumentException("City cannot be empty");
        }
    }

    private static void validateCountry(String country) {
        if (country == null || country.trim().isEmpty()) {
            throw new IllegalArgumentException("Country cannot be empty");
        }
    }

    private static void validateType(AddressType type) {
        if (type == null) {
            throw new IllegalArgumentException("Address type cannot be null");
        }
    }
}
