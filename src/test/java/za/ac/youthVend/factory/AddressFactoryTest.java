//package za.ac.youthVend.factory;
//
//import org.junit.jupiter.api.MethodOrderer;
//import org.junit.jupiter.api.Order;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.TestMethodOrder;
//import za.ac.youthVend.domain.Address;
//import za.ac.youthVend.domain.User;
//import za.ac.youthVend.domain.enums.AddressType;
//import za.ac.youthVend.domain.enums.UserRole;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
//class AddressFactoryTest {
//
//    private final User testUser = UserFactory.createUser(
//            "John Doe",
//            "john.doe@example.com",
//            "password123",
//            UserRole.BUYER
//    );
//
//    @Test
//    @Order(1)
//    void createAddress_WithAllFields() {
//        Address address = AddressFactory.createAddress(
//                testUser,
//                "123 Main St",
//                "Apt 4B",
//                "Cape Town",
//                "Western Cape",
//                "8001",
//                "South Africa",
//                AddressType.BILLING
//        );
//
//        assertNotNull(address);
//        assertEquals(testUser, address.getUser());
//        assertEquals("123 Main St", address.getLine1());
//        assertEquals("Apt 4B", address.getLine2());
//        assertEquals("Cape Town", address.getCity());
//        assertEquals("Western Cape", address.getState());
//        assertEquals("8001", address.getPostalCode());
//        assertEquals("South Africa", address.getCountry());
//        assertEquals(AddressType.BILLING, address.getType());
//    }
//
//    @Test
//    @Order(2)
//    void createBillingAddress_MinimalFields() {
//        Address billing = AddressFactory.createBillingAddress(
//                testUser,
//                "456 Market St",
//                "Johannesburg",
//                "South Africa"
//        );
//
//        assertNotNull(billing);
//        assertEquals(AddressType.BILLING, billing.getType());
//        assertEquals("456 Market St", billing.getLine1());
//        assertEquals("Johannesburg", billing.getCity());
//        assertEquals("South Africa", billing.getCountry());
//        assertNull(billing.getLine2());
//        assertNull(billing.getState());
//        assertNull(billing.getPostalCode());
//    }
//
//    @Test
//    @Order(3)
//    void createShippingAddress_MinimalFields() {
//        Address shipping = AddressFactory.createShippingAddress(
//                testUser,
//                "789 Commerce Blvd",
//                "Durban",
//                "South Africa"
//        );
//
//        assertNotNull(shipping);
//        assertEquals(AddressType.SHIPPING, shipping.getType());
//        assertEquals("789 Commerce Blvd", shipping.getLine1());
//        assertEquals("Durban", shipping.getCity());
//        assertEquals("South Africa", shipping.getCountry());
//        assertNull(shipping.getLine2());
//        assertNull(shipping.getState());
//        assertNull(shipping.getPostalCode());
//    }
//
//    @Test
//    @Order(4)
//    void createAddress_WithNullUser_ShouldThrowException() {
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            AddressFactory.createAddress(
//                    null,
//                    "123 Main St",
//                    null,
//                    "Cape Town",
//                    null,
//                    null,
//                    "South Africa",
//                    AddressType.BILLING
//            );
//        });
//        assertTrue(exception.getMessage().contains("User cannot be null"));
//    }
//
//    @Test
//    @Order(5)
//    void createAddress_WithEmptyLine1_ShouldThrowException() {
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            AddressFactory.createAddress(
//                    testUser,
//                    " ",
//                    null,
//                    "Cape Town",
//                    null,
//                    null,
//                    "South Africa",
//                    AddressType.SHIPPING
//            );
//        });
//        assertTrue(exception.getMessage().contains("Address line1 cannot be empty"));
//    }
//
//    @Test
//    @Order(6)
//    void createAddress_WithTooLongLine1_ShouldThrowException() {
//        String longLine = "A".repeat(300); // more than MAX_LINE_LENGTH
//
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            AddressFactory.createAddress(
//                    testUser,
//                    longLine,
//                    null,
//                    "Cape Town",
//                    null,
//                    null,
//                    "South Africa",
//                    AddressType.BILLING
//            );
//        });
//
//        assertTrue(exception.getMessage().contains("Address line1 too long"));
//    }
//
//    @Test
//    @Order(7)
//    void createAddress_WithEmptyCity_ShouldThrowException() {
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            AddressFactory.createAddress(
//                    testUser,
//                    "123 Main St",
//                    null,
//                    " ",
//                    null,
//                    null,
//                    "South Africa",
//                    AddressType.SHIPPING
//            );
//        });
//        assertTrue(exception.getMessage().contains("City cannot be empty"));
//    }
//
//    @Test
//    @Order(8)
//    void createAddress_WithEmptyCountry_ShouldThrowException() {
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            AddressFactory.createAddress(
//                    testUser,
//                    "123 Main St",
//                    null,
//                    "Cape Town",
//                    null,
//                    null,
//                    " ",
//                    AddressType.SHIPPING
//            );
//        });
//        assertTrue(exception.getMessage().contains("Country cannot be empty"));
//    }
//
//    @Test
//    @Order(9)
//    void createAddress_WithNullType_ShouldThrowException() {
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            AddressFactory.createAddress(
//                    testUser,
//                    "123 Main St",
//                    null,
//                    "Cape Town",
//                    null,
//                    null,
//                    "South Africa",
//                    null
//            );
//        });
//        assertTrue(exception.getMessage().contains("Address type cannot be null"));
//    }
//}
