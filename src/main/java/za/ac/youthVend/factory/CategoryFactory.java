package za.ac.youthVend.factory;

import za.ac.youthVend.domain.Category;

public class CategoryFactory {

    private static final int MAX_NAME_LENGTH = 100;
    private static final int MAX_SLUG_LENGTH = 100;

    private CategoryFactory() {
        // Prevent instantiation
    }

    /* =========================
       FACTORY METHODS
       ========================= */

    public static Category createCategory(String name, String slug) {
        validateName(name);
        validateSlug(slug);

        return Category.builder()
                .name(name.trim())
                .slug(slug.trim().toLowerCase())
                .build();
    }

    /* =========================
       VALIDATION METHODS
       ========================= */

    private static void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }
        if (name.length() > MAX_NAME_LENGTH) {
            throw new IllegalArgumentException("Category name too long");
        }
    }

    private static void validateSlug(String slug) {
        if (slug == null || slug.trim().isEmpty()) {
            throw new IllegalArgumentException("Category slug cannot be empty");
        }
        if (slug.length() > MAX_SLUG_LENGTH) {
            throw new IllegalArgumentException("Category slug too long");
        }
    }
}
