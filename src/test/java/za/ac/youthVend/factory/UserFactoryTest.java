//package za.ac.youthVend.factory;
//
//import org.junit.jupiter.api.MethodOrderer;
//import org.junit.jupiter.api.Order;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.TestMethodOrder;
//import za.ac.youthVend.domain.User;
//import za.ac.youthVend.domain.enums.UserRole;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
//class UserFactoryTest {
//
//    @Test
//    @Order(1)
//    void createUser_With_CorrectData() {
//        String username = "John Doe";
//        String email = "john.doe@example.com";
//        String password = "password123";
//        UserRole role = UserRole.BUYER;
//
//        User user = UserFactory.createUser(username, email, password, role);
//
//        assertNotNull(user);
//        assertEquals(username, user.getUsername());
//        assertEquals(email, user.getEmail());
//        assertEquals(password, user.getPassword());
//        assertEquals(role, user.getRole());
//        assertTrue(user.getOrders().isEmpty());
//        System.out.println(user.toString());
//    }
//
//    @Test
//    @Order(2)
//    void createUser_WithInvalidUsername() {
//        String invalidUsername = "";
//        String email = "john.doe@example.com";
//        String password = "password123";
//        UserRole role = UserRole.BUYER;
//
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            UserFactory.createUser(invalidUsername, email, password, role);
//        });
//
//        assertTrue(exception.getMessage().contains("Name cannot be empty"));
//        System.out.println(exception.getMessage());
//    }
//
//    @Test
//    @Order(3)
//    void createUser_WithInvalidEmail() {
//        String username = "John Doe";
//        String invalidEmail = "invalid-email";
//        String password = "password123";
//        UserRole role = UserRole.BUYER;
//
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            UserFactory.createUser(username, invalidEmail, password, role);
//        });
//
//        assertTrue(exception.getMessage().contains("Invalid email format"));
//    }
//
//    @Test
//    @Order(4)
//    void createUser_WithShortPassword_ShouldThrowException() {
//        String username = "John Doe";
//        String email = "john.doe@example.com";
//        String shortPassword = "short";
//        UserRole role = UserRole.BUYER;
//
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            UserFactory.createUser(username, email, shortPassword, role);
//        });
//
//        assertTrue(exception.getMessage().contains("Password must be at least"));
//    }
//
//    @Test
//    @Order(5)
//    void createUser_WithNullRole_ShouldThrowException() {
//        String username = "John Doe";
//        String email = "john.doe@example.com";
//        String password = "password123";
//        UserRole role = null;
//
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            UserFactory.createUser(username, email, password, role);
//        });
//
//        assertTrue(exception.getMessage().contains("Role cannot be null"));
//    }
//
//    @Test
//    @Order(6)
//    void createUser_WithAllFields() {
//        String username = "Jane Smith";
//        String email = "jane.smith@example.com";
//        String password = "password123";
//        UserRole role = UserRole.BUYER;
//        String companyName = "ABC Corp";
//        String phone = "+27123456789";
//
//        User user = UserFactory.createUser(username, email, password, role, companyName, phone);
//
//        assertNotNull(user);
//        assertEquals(username, user.getUsername());
//        assertEquals(email, user.getEmail());
//        assertEquals(password, user.getPassword());
//        assertEquals(role, user.getRole());
//        assertEquals(companyName, user.getCompanyName());
//        assertEquals(phone, user.getPhone());
//        assertTrue(user.getAddresses().isEmpty());
//        assertTrue(user.getOrders().isEmpty());
//    }
//
//    @Test
//    @Order(7)
//    void createUser_WithInvalidPhone() {
//        String username = "Jane Smith";
//        String email = "jane.smith@example.com";
//        String password = "password123";
//        UserRole role = UserRole.BUYER;
//        String invalidPhone = "invalid-phone";
//
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            UserFactory.createUser(username, email, password, role, null, invalidPhone);
//        });
//
//        assertTrue(exception.getMessage().contains("Invalid phone number format"));
//    }
//
//    @Test
//    @Order(8)
//    void createAdmin_WithValidData() {
//        String username = "Admin User";
//        String email = "admin@example.com";
//        String password = "adminpass123";
//
//        User admin = UserFactory.createAdmin(username, email, password);
//
//        assertNotNull(admin);
//        assertEquals(username, admin.getUsername());
//        assertEquals(email, admin.getEmail());
//        assertEquals(password, admin.getPassword());
//        assertEquals(UserRole.ADMIN, admin.getRole());
//    }
//
//    @Test
//    @Order(9)
//    void createClient_WithValidData() {
//        String username = "Client User";
//        String email = "client@example.com";
//        String password = "clientpass123";
//
//        User client = UserFactory.createUser(username, email, password, UserRole.BUYER);
//
//        assertNotNull(client);
//        assertEquals(username, client.getUsername());
//        assertEquals(email, client.getEmail());
//        assertEquals(password, client.getPassword());
//        assertEquals(UserRole.BUYER, client.getRole());
//    }
//}
