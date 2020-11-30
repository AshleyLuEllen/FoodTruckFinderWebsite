package food.truck.api.endpoint;

import food.truck.api.data.user.User;
import food.truck.api.util.Location;
import food.truck.api.data.user.UserService;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Objects;

@Log4j2
@RestController
public class UserEndpoint {
    @Autowired
    private UserService userService;

    @GetMapping("/users/me")
    public User findMeUser(Principal principal) {
        if (principal == null) {
            throw new UnauthorizedException();
        }
        log.info(principal.getName());
        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new);
        if (!Objects.equals(principal.getName(), user.getEmailAddress())) {
            throw new UnauthorizedException();
        }
        return user;
    }

    @GetMapping("/users/{id}")
    public User findUserById(@PathVariable Long id) {
        return userService.findUser(id).orElseThrow(ResourceNotFoundException::new);
    }

    @PatchMapping("/users/me")
    public User updateMeUser(Principal principal, @RequestBody User user) {
        if (principal == null) {
            throw new UnauthorizedException();
        }
        return userService.updateUser(principal.getName(), user);
    }

    @PutMapping("/users/me/location")
    public Location updateMeUserLocation(Principal principal, @RequestBody Location location) {
        if (principal == null) {
            throw new UnauthorizedException();
        }
        return userService.updateUserLocation(principal.getName(), location);
    }

    @GetMapping
    public Location findMyLocation(Principal principal) {
        if (principal == null) {
            throw new UnauthorizedException();
        }
        return userService.findUserLocationByEmail(principal.getName());
    }

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
}
