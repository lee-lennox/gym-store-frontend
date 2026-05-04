package za.ac.youthVend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.youthVend.domain.Address;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.AddressType;
import za.ac.youthVend.repository.AddressRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressService implements IAddressService {

    private final AddressRepository addressRepository;

    @Override
    public Address save(Address entity) {
        if (entity == null) throw new IllegalArgumentException("Address cannot be null");
        return addressRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.Optional<Address> findById(Integer id) {
        return addressRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Address> findAll() {
        return addressRepository.findAll();
    }

    @Override
    public Address update(Address entity) {
        if (entity == null) throw new IllegalArgumentException("Address cannot be null");
        if (!addressRepository.existsById(entity.getAddressId()))
            throw new IllegalArgumentException("Address not found with id: " + entity.getAddressId());
        return addressRepository.save(entity);
    }

    @Override
    public void deleteById(Integer id) {
        if (!addressRepository.existsById(id))
            throw new IllegalArgumentException("Address not found with id: " + id);
        addressRepository.deleteById(id);
    }

    @Override
    public void delete(Address entity) {
        addressRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return addressRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return addressRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Address> findByUser(User user) {
        return addressRepository.findByUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Address> findByType(AddressType type) {
        return addressRepository.findByType(type);
    }
}
