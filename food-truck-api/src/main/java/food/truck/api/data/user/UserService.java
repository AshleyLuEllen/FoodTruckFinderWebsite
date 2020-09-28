package food.truck.api.data.user;

import java.util.Optional;

import food.truck.api.endpoint.error.ResourceConflictException;
import food.truck.api.security.WebSecurityConfig;
import org.hibernate.criterion.Example;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Optional<User> findUser(Long userId) {
        return userRepository.findById(userId);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User createUser(User user) {
        // Check email
        userRepository.findByEmailAddress(user.getEmailAddress()).ifPresent(u -> {
            throw new ResourceConflictException("Email address is taken.");
        });

        // Create user
        user.setPasswordHash(WebSecurityConfig.PASSWORD_ENCODER.encode(user.getPassword()));
        user.setEnabled(true);
        user.setAuthority("ROLE_USER");
        return userRepository.save(user);
    }

    public Optional<User> findUserByEmailAddress(String email) {
        return userRepository.findByEmailAddress(email);
    }
}
