package food.truck.api.endpoint;

import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import food.truck.api.security.WebSecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import lombok.extern.log4j.Log4j2;

import java.security.Principal;
import java.security.Provider;
import java.util.Objects;

@Log4j2
@RestController
public class UserEndpoint {
    @Autowired
    private UserService userService;

    @GetMapping("/user")
    public User findMeUser(Principal principal) {
        log.info(principal.getName());
        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new);
        if (!Objects.equals(principal.getName(), user.getEmailAddress())) {
            throw new UnauthorizedException();
        }
        return user;
    }

    @GetMapping("/user/{id}")
    public User findUserById(@PathVariable Long id) {
        return userService.findUser(id).orElseThrow(ResourceNotFoundException::new);
    }

    @PatchMapping("/user")
    public User updateMeUser(Principal principal, @RequestBody User user) {
        User dbUser = userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new);
        if (!Objects.equals(principal.getName(), dbUser.getEmailAddress())) {
            throw new UnauthorizedException();
        }

        // Create the result user
        User resultUser = new User();
        resultUser.setId(dbUser.getId());
        resultUser.setAuthority(dbUser.getAuthority());
        resultUser.setEnabled(dbUser.isEnabled());

        // Update password
        if (user.getPassword() != null) {
            resultUser.setPasswordHash(WebSecurityConfig.PASSWORD_ENCODER.encode(user.getPassword()));
        }

        // Update email
        if (user.getEmailAddress() != null) {
            resultUser.setEmailAddress(user.getEmailAddress());
        }

        // Update first name
        if (user.getFirstName() != null) {
            resultUser.setFirstName(user.getFirstName());
        }

        // Update last name
        if (user.getLastName() != null) {
            resultUser.setLastName(user.getLastName());
        }

        return userService.saveUser(resultUser);
    }

    @PostMapping("/createuser")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
}
