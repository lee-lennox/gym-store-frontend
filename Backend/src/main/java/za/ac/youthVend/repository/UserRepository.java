package za.ac.youthVend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.UserRole;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    Optional<User> findByResetToken(String resetToken);

    boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);

    List<User> findByUsernameContainingIgnoreCase(String username);
}
