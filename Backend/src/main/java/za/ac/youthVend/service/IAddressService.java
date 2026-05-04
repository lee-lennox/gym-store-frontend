package za.ac.youthVend.service;

import za.ac.youthVend.domain.Address;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.AddressType;

import java.util.List;

public interface IAddressService extends IService<Address, Integer> {

    List<Address> findByUser(User user);

    List<Address> findByType(AddressType type);

}
