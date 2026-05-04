package za.ac.youthVend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.youthVend.domain.Product;
import za.ac.youthVend.domain.ProductImage;
import za.ac.youthVend.repository.ProductImageRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductImageService implements IProductImageService {

    private final ProductImageRepository productImageRepository;

    @Override
    public ProductImage save(ProductImage entity) {
        if (entity == null) throw new IllegalArgumentException("ProductImage cannot be null");
        return productImageRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.Optional<ProductImage> findById(Integer id) {
        return productImageRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductImage> findAll() {
        return productImageRepository.findAll();
    }

    @Override
    public ProductImage update(ProductImage entity) {
        if (entity == null) throw new IllegalArgumentException("ProductImage cannot be null");
        if (!productImageRepository.existsById(entity.getImageId()))
            throw new IllegalArgumentException("ProductImage not found with id: " + entity.getImageId());
        return productImageRepository.save(entity);
    }

    @Override
    public void deleteById(Integer id) {
        if (!productImageRepository.existsById(id))
            throw new IllegalArgumentException("ProductImage not found with id: " + id);
        productImageRepository.deleteById(id);
    }

    @Override
    public void delete(ProductImage entity) {
        productImageRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return productImageRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return productImageRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductImage> findByProduct(Product product) {
        return productImageRepository.findByProduct(product);
    }
}
