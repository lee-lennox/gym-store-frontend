package za.ac.youthVend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import za.ac.youthVend.domain.Category;
import za.ac.youthVend.domain.Product;
import za.ac.youthVend.domain.ProductImage;
import za.ac.youthVend.repository.CategoryRepository;
import za.ac.youthVend.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        // Create categories
        Category weights = createCategory("Weights", "weights");
        Category cardio = createCategory("Cardio", "cardio");
        Category equipment = createCategory("Equipment", "equipment");
        Category accessories = createCategory("Accessories", "accessories");

        // Create products
        createProduct("Premium Dumbbell Set", "High-quality adjustable dumbbells",
                new BigDecimal("5399.99"), "DB-001", 50, weights,
                List.of("https://images.unsplash.com/photo-1608947325421-b13e6956c7b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBkdW1iYmVsbHN8ZW58MXx8fHwxNzY1OTUxNzgyfDA&ixlib=rb-4.1.0&q=80&w=1080"));

        createProduct("Professional Treadmill", "Commercial-grade treadmill with advanced features",
                new BigDecimal("26999.99"), "TM-001", 20, cardio,
                List.of("https://images.unsplash.com/photo-1716367840427-4c148eb7bf15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB0cmVhZG1pbGx8ZW58MXx8fHwxNzY2MDQzNDgwfDA&ixlib=rb-4.1.0&q=80&w=1080"));

        createProduct("Exercise Bike Pro", "Professional exercise bike for intense workouts",
                new BigDecimal("16199.99"), "EB-001", 30, cardio,
                List.of("https://images.unsplash.com/photo-1707985287164-c84627ad6eba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGVyY2lzZSUyMGJpa2V8ZW58MXx8fHwxNzY1OTI2Njg2fDA&ixlib=rb-4.1.0&q=80&w=1080"));

        createProduct("Premium Yoga Mat", "Non-slip premium yoga mat",
                new BigDecimal("899.99"), "YM-001", 100, accessories,
                List.of("https://images.unsplash.com/photo-1646239646963-b0b9be56d6b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWF0fGVufDF8fHx8MTc2NTk0MTI2Mnww&ixlib=rb-4.1.0&q=80&w=1080"));
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
                               String sku, int stock, Category category, List<String> imageUrls) {

        if (productRepository.findBySku(sku).isPresent()) return;

        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .sku(sku)
                .stock(stock)
                .category(category)
                .build();

        List<ProductImage> images = imageUrls.stream()
                .map(url -> ProductImage.builder()
                        .url(url) // Use "url" as field name
                        .isPrimary(true)
                        .product(product)
                        .build())
                .toList();

        product.setImages(images);
        productRepository.save(product);
    }
}
