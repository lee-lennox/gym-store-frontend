package za.ac.youthVend.service;

import java.util.List;
import java.util.Optional;

public interface IService<T, ID> {

    T save(T entity);

    Optional<T> findById(ID id);

    List<T> findAll();

    T update(T entity);

    void deleteById(ID id);

    void delete(T entity);

    boolean existsById(ID id);

    long count();
}
