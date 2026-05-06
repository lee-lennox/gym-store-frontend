package za.ac.youthVend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.UserRole;
import za.ac.youthVend.dto.*;
import za.ac.youthVend.repository.UserRepository;
import za.ac.youthVend.security.JwtUtil;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .message("Email already registered")
                    .build();
        }

        // Create new user
        User user = User.builder()
                .username(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(UserRole.BUYER)
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole().name());

        // Send welcome email (async - non-blocking)
        try {
            emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getUsername());
        } catch (Exception e) {
            // Log error but don't fail registration
            System.err.println("Failed to send welcome email to " + savedUser.getEmail() + ": " + e.getMessage());
        }

        return AuthResponse.builder()
                .token(token)
                .email(savedUser.getEmail())
                .name(savedUser.getUsername())
                .role(savedUser.getRole())
                .userId(savedUser.getUserId())
                .message("Registration successful")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return AuthResponse.builder()
                    .message("Invalid email or password")
                    .build();
        }

        User user = userOpt.get();

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.builder()
                    .message("Invalid email or password")
                    .build();
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getUsername())
                .role(user.getRole())
                .userId(user.getUserId())
                .message("Login successful")
                .build();
    }

    public AuthResponse forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            // Don't reveal if email exists or not for security
            return AuthResponse.builder()
                    .message("If the email exists, a password reset link has been sent")
                    .build();
        }

        User user = userOpt.get();

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // Token valid for 1 hour

        userRepository.save(user);

        // Send email with reset link
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        } catch (Exception e) {
            // Log and continue: we don't reveal email existence to clients
            System.err.println("Failed to send reset email to " + user.getEmail() + ": " + e.getMessage());
        }

        return AuthResponse.builder()
                .message("If the email exists, a password reset link has been sent")
                .build();
    }

    public AuthResponse resetPassword(ResetPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByResetToken(request.getToken());

        if (userOpt.isEmpty()) {
            return AuthResponse.builder()
                    .message("Invalid or expired reset token")
                    .build();
        }

        User user = userOpt.get();

        // Check if token is expired
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return AuthResponse.builder()
                    .message("Reset token has expired")
                    .build();
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);

        return AuthResponse.builder()
                .message("Password reset successful")
                .build();
    }
}
