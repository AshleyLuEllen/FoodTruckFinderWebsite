package food.truck.api.data.user;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.user_notification.UserNotification;
import food.truck.api.endpoint.error.BadRequestException;
import food.truck.api.endpoint.error.ResourceConflictException;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import food.truck.api.security.WebSecurityConfig;
import food.truck.api.util.Location;
import food.truck.api.validation.UserValidator;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Log4j2
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
        resultUser.setSinceTime(dbUser.getSinceTime());

        // Update password
        if (user.getPassword() != null) {
            if (!UserValidator.isPasswordValid(user.getPassword())) {
                throw new BadRequestException("Invalid password");
            }
            resultUser.setPasswordHash(WebSecurityConfig.PASSWORD_ENCODER.encode(user.getPassword()));
        } else {
            resultUser.setPasswordHash(dbUser.getPasswordHash());
        }

        // Update email
        if (user.getEmailAddress() != null) {
            if (!UserValidator.isEmailAddressValid(user.getEmailAddress())) {
                throw new BadRequestException("Invalid email address");
            }
            resultUser.setEmailAddress(user.getEmailAddress().strip());
        } else {
            resultUser.setEmailAddress(dbUser.getEmailAddress());
        }

        // Update first name
        if (user.getFirstName() != null) {
            if (!UserValidator.isFirstNameValid(user.getFirstName())) {
                throw new BadRequestException("Invalid first name");
            }
            resultUser.setFirstName(user.getFirstName().strip());
        } else {
            resultUser.setFirstName(dbUser.getFirstName());
        }

        // Update last name
        if (user.getLastName() != null) {
            if (!UserValidator.isLastNameValid(user.getLastName())) {
                throw new BadRequestException("Invalid last name");
            }
            resultUser.setLastName(user.getLastName().strip());
        } else {
            resultUser.setLastName(dbUser.getLastName());
        }

        // Update bio
        if (user.getDescription() != null) {
            resultUser.setDescription(user.getDescription().strip());
        } else {
            resultUser.setDescription(dbUser.getDescription());
        }

        // Update avatar URL
        if (user.getAvatarURL() != null) {
            resultUser.setAvatarURL(user.getAvatarURL().strip());
        } else {
            resultUser.setAvatarURL(dbUser.getAvatarURL());
        }

        return userRepository.save(resultUser);
    }

    public User createUser(User user) {
        // Check email
        userRepository.findByEmailAddress(user.getEmailAddress()).ifPresent(u -> {
            throw new ResourceConflictException("Email address is taken.");
        });

        // Check password security
        if (!UserValidator.isPasswordValid(user.getPassword())) {
            throw new BadRequestException("Invalid password");
        }

        // Create user
        user.setPasswordHash(WebSecurityConfig.PASSWORD_ENCODER.encode(user.getPassword()));
        user.setEnabled(true);
        user.setAuthority("ROLE_USER");
        user.setAvatarURL(null);
        user.setDescription(null);
        user.setSinceTime(ZonedDateTime.now());
        return userRepository.save(user);
    }

    public Optional<User> findUserByEmailAddress(String email) {
        return userRepository.findByEmailAddress(email);
    }

    public Location updateUserLocation(String email, Location location) {
        Optional<User> userOpt = userRepository.findByEmailAddress(email);

        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        User user = userOpt.get();

        user.setLatitude(location.getLatitude());
        user.setLongitude(location.getLongitude());

        userRepository.save(user);

        return location;
    }

    public Location findUserLocationByEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmailAddress(email);

        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        User user = userOpt.get();

        Location loc = new Location();
        loc.setLatitude(user.getLatitude());
        loc.setLongitude(user.getLongitude());

        return loc;
    }

    public List<User> findUsersNearLocation(Location location) {
        return userRepository.findAllUsersNearLocation(location.getLatitude(), location.getLongitude(), 20.0);
    }
}
