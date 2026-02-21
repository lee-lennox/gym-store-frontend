package za.ac.youthVend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import za.ac.youthVend.domain.Category;
import za.ac.youthVend.domain.Product;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.UserRole;
import za.ac.youthVend.repository.CategoryRepository;
import za.ac.youthVend.repository.ProductRepository;
import za.ac.youthVend.repository.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin user
        createDefaultAdmin();
        
        // Create categories
        Category weights = createCategory("Weights", "weights");
        Category cardio = createCategory("Cardio", "cardio");
        Category equipment = createCategory("Equipment", "equipment");
        Category accessories = createCategory("Accessories", "accessories");

        // Create products
        createProduct("Premium Dumbbell Set", "High-quality adjustable dumbbells",
                new BigDecimal("5399.99"), "DB-001", 50, weights,
                "/products/images/Dumbells.png", "Dumbells.png");

        createProduct("Professional Treadmill", "Commercial-grade treadmill with advanced features",
                new BigDecimal("26999.99"), "TM-001", 20, cardio,
                "/products/images/trendmill.png", "trendmill.png");

        createProduct("Exercise Bike Pro", "Professional exercise bike for intense workouts",
                new BigDecimal("16199.99"), "EB-001", 30, cardio,
                "/products/images/probike.png", "probike.png");

        createProduct("Premium Yoga Mat", "Non-slip premium yoga mat",
                new BigDecimal("899.99"), "YM-001", 100, accessories,
                "/products/images/yogamat.png", "yogamat.png");

        // Add "No Premium Dumbbell" using the uploaded image file
        createProduct("No Premium Dumbbell", "Adjustable dumbbell set (no premium)",
                new BigDecimal("5499.99"), "DB-002", 25, weights,
                "/products/images/Dumbells.png", "Dumbells.png");

        // Add the attached yoga mat image as a seeded product
        createProduct("Blue Yoga Mat", "Comfortable non-slip yoga mat - blue design",
                new BigDecimal("799.99"), "YM-002", 75, accessories,
                "/products/images/yogamat.png", "yogamat.png");
    }

    private void createDefaultAdmin() {
        String adminEmail = "admin@gymstore.com";
        
        // Check if admin already exists
        if (userRepository.findByEmail(adminEmail).isPresent()) {
            System.out.println("✓ Admin user already exists: " + adminEmail);
            return;
        }

        // Create admin user
        User admin = User.builder()
                .username("Admin")
                .email(adminEmail)
                .password(passwordEncoder.encode("admin123"))
                .role(UserRole.ADMIN)
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(admin);
        System.out.println("✓ Default admin user created:");
        System.out.println("  Email: " + adminEmail);
        System.out.println("  Password: admin123");

    }

    private Category createCategory(String name, String slug) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> categoryRepository.save(
                        Category.builder()
                                .name(name)
                                .slug(slug)
                                .build()
                ));
    }

    private void createProduct(String name, String description, BigDecimal price,
                               String sku, int stock, Category category) {
        createProduct(name, description, price, sku, stock, category,
                "https://via.placeholder.com/400x300?text=" + name.replace(" ", "+"),
                "placeholder.jpg");
    }

    private void createProduct(String name, String description, BigDecimal price,
                               String sku, int stock, Category category,
                               String imagePath, String imageFileName) {

        if (productRepository.findBySku(sku).isPresent()) return;

        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .sku(sku)
                .stock(stock)
                .category(category)
                .imagePath(imagePath)
                .imageFileName(imageFileName)
                .build();

        productRepository.save(product);
    }
}
