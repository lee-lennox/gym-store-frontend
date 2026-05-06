package za.ac.youthVend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.OrderItem;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

/**
 * Service for sending various types of emails to users.
 * All email methods are asynchronous to avoid blocking the main application flow.
 */
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Send a welcome email to newly registered users.
     * Includes personalized greeting and next steps.
     *
     * @param to   The recipient's email address
     * @param name The recipient's name
     */
    @Async
    public void sendWelcomeEmail(String to, String name) {
        if (to == null || to.isBlank()) {
            throw new IllegalArgumentException("Recipient email is required");
        }

        String subject = "Welcome to Gym Equipment Store!";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(buildWelcomeHtml(name != null ? name : "Valued Customer"), true);

            mailSender.send(message);
            System.out.println("Welcome email sent to: " + to);
        } catch (MessagingException e) {
            System.err.println("Failed to send welcome email to " + to + ": " + e.getMessage());
        }
    }

    /**
     * Send a password reset email with a secure reset link.
     *
     * @param to       The recipient's email address
     * @param resetLink The password reset link
     */
    @Async
    public void sendPasswordResetEmail(String to, String resetLink) {
        if (to == null || to.isBlank()) {
            throw new IllegalArgumentException("Recipient email is required");
        }

        String subject = "Password Reset Request";
        String text = "You requested to reset your password.\n\n"
                + "Click the link below to reset your password:\n"
                + resetLink + "\n\n"
                + "If you didn't request this, please ignore this email.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }

    /**
     * Send an order receipt/confirmation email after successful purchase.
     * Includes order details, items, and total amount.
     *
     * @param order The order to send receipt for
     */
    @Async
    public void sendOrderReceiptEmail(Order order) {
        if (order == null || order.getUser() == null || order.getUser().getEmail() == null) {
            throw new IllegalArgumentException("Order and user email are required");
        }

        String to = order.getUser().getEmail();
        String subject = "Order Confirmation - Order #" + order.getOrderId();

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(buildOrderReceiptHtml(order), true);

            mailSender.send(message);
            System.out.println("Order receipt email sent to: " + to + " for order #" + order.getOrderId());
        } catch (MessagingException e) {
            System.err.println("Failed to send order receipt email to " + to + ": " + e.getMessage());
            throw new RuntimeException("Failed to send order receipt email", e);
        }
    }

    /**
     * Build HTML content for the welcome email.
     */
    private String buildWelcomeHtml(String name) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><style>")
            .append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }")
            .append(".container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }")
            .append(".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }")
            .append(".header h1 { margin: 0; font-size: 28px; }")
            .append(".content { padding: 30px; }")
            .append(".welcome-box { background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }")
            .append(".features { margin: 25px 0; }")
            .append(".feature { display: flex; align-items: center; margin: 15px 0; }")
            .append(".feature-icon { width: 40px; height: 40px; background-color: #667eea; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; }")
            .append(".cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }")
            .append(".footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 0.9em; }")
            .append("</style></head><body>");

        // Header
        html.append("<div class='container'>")
            .append("<div class='header'>")
            .append("<h1>🏋️ Welcome to Gym Equipment Store!</h1>")
            .append("</div>");

        // Content
        html.append("<div class='content'>")
            .append("<h2>Hello ").append(name).append("!</h2>")
            .append("<p>We're thrilled to welcome you to our community of fitness enthusiasts!</p>");

        // Welcome box
        html.append("<div class='welcome-box'>")
            .append("<h3>🎉 Your account has been created successfully!</h3>")
            .append("<p>You can now explore our wide range of premium gym equipment and start your fitness journey.</p>")
            .append("</div>");

        // Features
        html.append("<div class='features'>")
            .append("<h3>What you can do now:</h3>")
            .append("<div class='feature'>")
            .append("<div class='feature-icon'>1</div>")
            .append("<div><strong>Browse Products</strong><br>Explore our extensive catalog of gym equipment</div>")
            .append("</div>")
            .append("<div class='feature'>")
            .append("<div class='feature-icon'>2</div>")
            .append("<div><strong>Add to Cart</strong><br>Save your favorite items for later</div>")
            .append("</div>")
            .append("<div class='feature'>")
            .append("<div class='feature-icon'>3</div>")
            .append("<div><strong>Quick Checkout</strong><br>Complete your purchase securely</div>")
            .append("</div>")
            .append("<div class='feature'>")
            .append("<div class='feature-icon'>4</div>")
            .append("<div><strong>Track Orders</strong><br>Monitor your orders in real-time</div>")
            .append("</div>")
            .append("</div>");

        // CTA button
        html.append("<div style='text-align: center;'>")
            .append("<a href='https://lennoxgymstore1.netlify.app/products' class='cta-button'>Start Shopping Now</a>")
            .append("</div>");

        // Footer
        html.append("<div class='footer'>")
            .append("<p>Need help? Contact our support team at support@gymstore.com</p>")
            .append("<p>&copy; 2024 Gym Equipment Store. All rights reserved.</p>")
            .append("</div>")
            .append("</div></body></html>");

        return html.toString();
    }

    /**
     * Build HTML content for the order receipt email.
     */
    private String buildOrderReceiptHtml(Order order) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><style>")
            .append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }")
            .append(".container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }")
            .append(".header { background-color: #4CAF50; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }")
            .append(".header h1 { margin: 0; font-size: 24px; }")
            .append(".order-info { background-color: #f9f9f9; padding: 20px; margin: 20px; border-radius: 8px; }")
            .append("table { width: 100%; border-collapse: collapse; margin: 20px 0; }")
            .append("th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }")
            .append("th { background-color: #f2f2f2; font-weight: bold; }")
            .append(".total { font-size: 1.3em; font-weight: bold; text-align: right; margin: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px; }")
            .append(".footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 0.9em; }")
            .append("</style></head><body>");

        // Header
        html.append("<div class='container'>")
            .append("<div class='header'>")
            .append("<h1>✅ Order Confirmation</h1>")
            .append("<p style='margin: 10px 0 0 0;'>Thank you for your purchase!</p>")
            .append("</div>");

        // Order Info
        html.append("<div class='order-info'>")
            .append("<h2>Order #").append(order.getOrderId()).append("</h2>")
            .append("<p><strong>Order Date:</strong> ");
        
        if (order.getCreatedAt() != null) {
            html.append(order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMMM yyyy, HH:mm")));
        } else {
            html.append("N/A");
        }
        
        html.append("</p>")
            .append("<p><strong>Status:</strong> <span style='color: #4CAF50; font-weight: bold;'>").append(order.getStatus() != null ? order.getStatus().name() : "PENDING").append("</span></p>");

        if (order.getShippingAddress() != null) {
            html.append("<p><strong>Shipping Address:</strong><br>");
            html.append("Address ID: ").append(order.getShippingAddress().getAddressId()).append("</p>");
        }

        html.append("</div>");

        // Order Items Table
        html.append("<h3 style='margin: 20px 20px 10px 20px;'>Order Items</h3>")
            .append("<div style='padding: 0 20px;'>")
            .append("<table>")
            .append("<thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>")
            .append("<tbody>");

        BigDecimal total = BigDecimal.ZERO;
        boolean hasItems = false;
        
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                hasItems = true;
                BigDecimal itemTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                total = total.add(itemTotal);
                html.append("<tr>")
                    .append("<td>").append(item.getProduct() != null ? item.getProduct().getName() : "N/A").append("</td>")
                    .append("<td>").append(item.getQuantity()).append("</td>")
                    .append("<td>R").append(String.format("%,.2f", item.getUnitPrice())).append("</td>")
                    .append("<td>R").append(String.format("%,.2f", itemTotal)).append("</td>")
                    .append("</tr>");
            }
        }
        
        if (!hasItems) {
            html.append("<tr><td colspan='4' style='text-align: center; color: #666;'>No items in this order</td></tr>");
        }

        html.append("</tbody></table></div>");

        // Total
        html.append("<div class='total'>")
            .append("Total: R").append(String.format("%,.2f", order.getTotalAmount() != null ? order.getTotalAmount() : total))
            .append("</div>");

        // Footer
        html.append("<div class='footer'>")
            .append("<p>Questions about your order? Contact our support team.</p>")
            .append("<p>&copy; 2024 Gym Equipment Store. All rights reserved.</p>")
            .append("</div>")
            .append("</div></body></html>");

        return html.toString();
    }
}