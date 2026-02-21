package za.ac.youthVend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.youthVend.domain.Address;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.AddressType;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {

    List<Address> findByUser(User user);

    List<Address> findByType(AddressType type);

}///end of class
