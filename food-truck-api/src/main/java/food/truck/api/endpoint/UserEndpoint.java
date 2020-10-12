package food.truck.api.endpoint;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import lombok.extern.log4j.Log4j2;

import java.security.Principal;
import java.security.Provider;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Log4j2
@RestController
public class UserEndpoint {
    @Autowired
    private UserService userService;

    @Autowired
    private TruckService truckService;

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

    @PostMapping("/createuser")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping("/users/{userID}/trucks")
    public List<Truck> findUserOwnedTrucks(@PathVariable Long userID) {
        Optional<User> user = userService.findUser(userID);

        if (user.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        return truckService.getTrucksOwnedByUser(user.get());
    }
}
