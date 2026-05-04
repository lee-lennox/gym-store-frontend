package za.ac.youthVend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.OrderItem;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String to, String resetLink) {
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
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send order receipt email", e);
        }
    }

    private String buildOrderReceiptHtml(Order order) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><style>")
            .append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }")
            .append(".container { max-width: 600px; margin: 0 auto; padding: 20px; }")
            .append(".header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }")
            .append(".order-info { background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; }")
            .append("table { width: 100%; border-collapse: collapse; margin: 20px 0; }")
            .append("th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }")
            .append("th { background-color: #f2f2f2; }")
            .append(".total { font-size: 1.2em; font-weight: bold; text-align: right; margin-top: 20px; }")
            .append(".footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }")
            .append("</style></head><body>");
        
        // Header
        html.append("<div class='container'>")
            .append("<div class='header'>")
            .append("<h1>Order Confirmation</h1>")
            .append("<p>Thank you for your purchase!</p>")
            .append("</div>");
        
        // Order Info
        html.append("<div class='order-info'>")
            .append("<h2>Order #").append(order.getOrderId()).append("</h2>")
            .append("<p><strong>Order Date:</strong> ")
            .append(order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMMM yyyy, HH:mm")))
            .append("</p>")
            .append("<p><strong>Status:</strong> ").append(order.getStatus().name()).append("</p>");
        
        if (order.getShippingAddress() != null) {
            html.append("<p><strong>Shipping Address:</strong><br>");
            // You can add more address details here if needed
            html.append(order.getShippingAddress().getAddressId()).append("</p>");
        }
        
        html.append("</div>");
        
        // Order Items Table
        html.append("<h3>Order Items</h3>")
            .append("<table>")
            .append("<thead><tr><th>Product</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr></thead>")
            .append("<tbody>");
        
        BigDecimal total = BigDecimal.ZERO;
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                BigDecimal itemTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                total = total.add(itemTotal);
                html.append("<tr>")
                    .append("<td>").append(item.getProduct() != null ? item.getProduct().getName() : "N/A").append("</td>")
                    .append("<td>").append(item.getQuantity()).append("</td>")
                    .append("<td>R").append(item.getUnitPrice()).append("</td>")
                    .append("<td>R").append(itemTotal).append("</td>")
                    .append("</tr>");
            }
        }
        
        html.append("</tbody></table>");
        
        // Total
        html.append("<div class='total'>")
            .append("Total: R").append(order.getTotalAmount())
            .append("</div>");
        
        // Footer
        html.append("<div class='footer'>")
            .append("<p>If you have any questions about your order, please contact our support team.</p>")
            .append("<p>&copy; 2024 Gym Equipment Store. All rights reserved.</p>")
            .append("</div>")
            .append("</div></body></html>");
        
        return html.toString();
    }
}