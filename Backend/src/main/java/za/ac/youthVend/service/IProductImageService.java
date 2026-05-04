package za.ac.youthVend.service;

import za.ac.youthVend.domain.Product;
import za.ac.youthVend.domain.ProductImage;

import java.util.List;

public interface IProductImageService extends IService<ProductImage, Integer> {

    List<ProductImage> findByProduct(Product product);
}
