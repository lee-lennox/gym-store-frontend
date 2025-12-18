package za.ac.youthVend.factory;

import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.UserRole;

import java.util.Collections;
import java.util.regex.Pattern;

public class UserFactory {

    private static final int MIN_USERNAME_LENGTH = 3;
    private static final int MAX_USERNAME_LENGTH = 50;
    private static final int MIN_PASSWORD_LENGTH = 8;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+27\\d{9}$");

    private UserFactory() {
        // Prevent instantiation
    }

    /* =========================
       MAIN FACTORY METHODS
       ========================= */

    public static User createUser(String username,
                                  String email,
                                  String password,
                                  UserRole role) {
        return createUser(username, email, password, role, null, null);
    }

    public static User createUser(String username,
                                  String email,
                                  String password,
                                  UserRole role,
                                  String companyName,
                                  String phone) {

        validateUsername(username);
        validateEmail(email);
        validatePassword(password);
        validateRole(role);
        validatePhone(phone);

        return User.builder()
                .username(username.trim())
                .email(email)
                .password(password)
                .role(role)

                .phone(phone)
                .enabled(true)
                .addresses(Collections.emptyList())
                .orders(Collections.emptyList())
                .build();
    }

    public static User createAdmin(String username,
                                   String email,
                                   String password) {
        return createUser(username, email, password, UserRole.ADMIN);
    }

    public static User createBuyer(String username,
                                   String email,
                                   String password) {
        return createUser(username, email, password, UserRole.BUYER);
    }

    public static User createSeller(String username,
                                    String email,
                                    String password) {
        return createUser(username, email, password, UserRole.SELLER);
    }

    /* =========================
       VALIDATION METHODS
       ========================= */

    private static void validateUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        String trimmed = username.trim();
        if (trimmed.length() < MIN_USERNAME_LENGTH || trimmed.length() > MAX_USERNAME_LENGTH) {
            throw new IllegalArgumentException(
                    "Username must be between " + MIN_USERNAME_LENGTH + " and " + MAX_USERNAME_LENGTH + " characters"
            );
        }
    }

    private static void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }

    private static void validatePassword(String password) {
        if (password == null) {
            throw new IllegalArgumentException("Password cannot be null");
        }
        if (password.length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalArgumentException(
                    "Password must be at least " + MIN_PASSWORD_LENGTH + " characters"
            );
        }
    }

    private static void validateRole(UserRole role) {
        if (role == null) {
            throw new IllegalArgumentException("Role cannot be null");
        }
    }

    private static void validatePhone(String phone) {
        if (phone != null && !PHONE_PATTERN.matcher(phone).matches()) {
            throw new IllegalArgumentException("Invalid phone number format");
        }
    }
}
