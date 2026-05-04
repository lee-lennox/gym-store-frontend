package za.ac.youthVend.service;

import org.springframework.stereotype.Service;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.UserRole;
import za.ac.youthVend.factory.UserFactory;
import za.ac.youthVend.repository.UserRepository;
import za.ac.youthVend.service.IUserService;


import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User createUser(User user) {
        if (emailExists(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Optional: Use UserFactory to ensure valid user creation
        return userRepository.save(UserFactory.createUser(
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.getRole()
        ));
    }

    @Override
    public Optional<User> getUserById(Integer userId) {
        return userRepository.findById(userId);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    @Override
    public List<User> searchUsersByUsername(String username) {
        return userRepository.findByUsernameContainingIgnoreCase(username);
    }

    @Override
    public User updateUser(User user) {
        if (user.getUserId() == null || !userRepository.existsById(user.getUserId())) {
            throw new IllegalArgumentException("User not found");
        }
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Integer userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }
        userRepository.deleteById(userId);
    }

    @Override
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
