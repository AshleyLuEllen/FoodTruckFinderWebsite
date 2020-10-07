package food.truck.api.data.user;

import java.util.Objects;
import java.util.Optional;

import food.truck.api.endpoint.error.BadRequestException;
import food.truck.api.endpoint.error.ResourceConflictException;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import food.truck.api.security.WebSecurityConfig;
import food.truck.api.validation.UserValidator;
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

    public User updateUser(String userID, User user) {
        // Check if the user is logged in as the one trying to be changed
        User dbUser = findUserByEmailAddress(userID).orElseThrow(ResourceNotFoundException::new);
        if (!Objects.equals(userID, dbUser.getEmailAddress())) {
            throw new UnauthorizedException();
        }

        // Create the result user
        User resultUser = new User();
        resultUser.setId(dbUser.getId());
        resultUser.setAuthority(dbUser.getAuthority());
        resultUser.setEnabled(dbUser.isEnabled());

        // Update password
        if (user.getPassword() != null) {
            if (!UserValidator.isPasswordValid(user.getPassword())) {
                throw new BadRequestException("Invalid password");
            }
            resultUser.setPasswordHash(WebSecurityConfig.PASSWORD_ENCODER.encode(user.getPassword()));
        }

        // Update email
        if (user.getEmailAddress() != null) {
            if (!UserValidator.isEmailAddressValid(user.getEmailAddress())) {
                throw new BadRequestException("Invalid email address");
            }
            resultUser.setEmailAddress(user.getEmailAddress().strip());
        }

        // Update first name
        if (user.getFirstName() != null) {
            if (!UserValidator.isFirstNameValid(user.getFirstName())) {
                throw new BadRequestException("Invalid first name");
            }
            resultUser.setFirstName(user.getFirstName().strip());
        }

        // Update last name
        if (user.getLastName() != null) {
            if (!UserValidator.isLastNameValid(user.getLastName())) {
                throw new BadRequestException("Invalid last name");
            }
            resultUser.setLastName(user.getLastName().strip());
        }

        return userRepository.save(resultUser);
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
