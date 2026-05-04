package za.ac.youthVend.service;

import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.UserRole;

import java.util.List;
import java.util.Optional;

public interface IUserService {

    User createUser(User user);

    Optional<User> getUserById(Integer userId);

    Optional<User> getUserByEmail(String email);

    List<User> getAllUsers();

    List<User> getUsersByRole(UserRole role);

    List<User> searchUsersByUsername(String username);

    User updateUser(User user);

    void deleteUser(Integer userId);

    boolean emailExists(String email);
}
