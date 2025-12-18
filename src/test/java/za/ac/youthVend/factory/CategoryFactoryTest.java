package za.ac.youthVend.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.youthVend.domain.Category;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CategoryFactoryTest {

    @Test
    @Order(1)
    void createCategory_WithValidData() {
        String name = "Fitness Equipment";
        String slug = "fitness-equipment";

        Category category = CategoryFactory.createCategory(name, slug);

        assertNotNull(category);
        assertEquals(name, category.getName());
        assertEquals(slug, category.getSlug());
    }

    @Test
    @Order(2)
    void createCategory_WithNameTooLong_ShouldThrowException() {
        String longName = "A".repeat(101); // MAX_NAME_LENGTH is 100
        String slug = "fitness-equipment";

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            CategoryFactory.createCategory(longName, slug);
        });

        assertTrue(exception.getMessage().contains("Category name too long"));
    }

    @Test
    @Order(3)
    void createCategory_WithEmptyName_ShouldThrowException() {
        String emptyName = " ";
        String slug = "fitness-equipment";

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            CategoryFactory.createCategory(emptyName, slug);
        });

        assertTrue(exception.getMessage().contains("Category name cannot be empty"));
    }

    @Test
    @Order(4)
    void createCategory_WithSlugTooLong_ShouldThrowException() {
        String name = "Fitness Equipment";
        String longSlug = "a".repeat(101); // MAX_SLUG_LENGTH is 100

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            CategoryFactory.createCategory(name, longSlug);
        });

        assertTrue(exception.getMessage().contains("Category slug too long"));
    }

    @Test
    @Order(5)
    void createCategory_WithEmptySlug_ShouldThrowException() {
        String name = "Fitness Equipment";
        String emptySlug = " ";

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            CategoryFactory.createCategory(name, emptySlug);
        });

        assertTrue(exception.getMessage().contains("Category slug cannot be empty"));
    }

    @Test
    @Order(6)
    void createCategory_ShouldTrimNameAndSlug() {
        String name = "  Fitness Equipment  ";
        String slug = "  FITNESS-EQUIPMENT  ";

        Category category = CategoryFactory.createCategory(name, slug);

        assertEquals("Fitness Equipment", category.getName());
        assertEquals("fitness-equipment", category.getSlug());
    }
}
