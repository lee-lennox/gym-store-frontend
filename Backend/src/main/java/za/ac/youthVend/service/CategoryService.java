package za.ac.youthVend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.youthVend.domain.Category;
import za.ac.youthVend.repository.CategoryRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService implements ICategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public Category save(Category entity) {
        if (entity == null) throw new IllegalArgumentException("Category cannot be null");
        return categoryRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Category> findById(Integer id) {
        return categoryRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category update(Category entity) {
        if (entity == null) throw new IllegalArgumentException("Category cannot be null");
        if (!categoryRepository.existsById(entity.getCategoryId()))
            throw new IllegalArgumentException("Category not found with id: " + entity.getCategoryId());
        return categoryRepository.save(entity);
    }

    @Override
    public void deleteById(Integer id) {
        if (!categoryRepository.existsById(id))
            throw new IllegalArgumentException("Category not found with id: " + id);
        categoryRepository.deleteById(id);
    }

    @Override
    public void delete(Category entity) {
        categoryRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return categoryRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return categoryRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Category> findBySlug(String slug) {
        return categoryRepository.findBySlug(slug);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Category> findByName(String name) {
        return categoryRepository.findByName(name);
    }
}
