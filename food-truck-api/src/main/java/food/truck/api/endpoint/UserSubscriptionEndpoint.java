package food.truck.api.endpoint;

import food.truck.api.data.subscription.SubscriptionService;
import food.truck.api.data.tag.Tag;
import food.truck.api.data.tag.TagService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.truck_tag.TruckTagService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
public class UserSubscriptionEndpoint {

    @Autowired
    TruckService truckService;

    @Autowired
    UserService userService;

    @Autowired
    SubscriptionService subscriptionService;

    @GetMapping("/users/{userId}/subscriptions")
    List<Truck> getUserSubscriptions(@PathVariable Long userId){
        // check that the user exists
        Optional<User> userOpt = userService.findUser(userId);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        return subscriptionService.findUserSubscriptions(userOpt.get());
    }

    @PostMapping("/users/{userId}/subscriptions/{truckId}")
    void addUserSubscription(@PathVariable Long userId, @PathVariable Long truckId, Principal principal){
        // Check if user exists
        Optional<User> userOpt = userService.findUser(userId);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        // Check if truck exists
        Optional<Truck> truckOpt = truckService.findTruck(truckId);
        if (truckOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        // Check if user has same id
        if (principal == null) {
            throw new UnauthorizedException();
        }
        Optional<User> userPOpt = userService.findUserByEmailAddress(principal.getName());
        if (userPOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }
        if (!userOpt.get().equals(userPOpt.get())) {
            throw new UnauthorizedException();
        }

        subscriptionService.addUserSubscription(userOpt.get(), truckOpt.get());
    }

    @DeleteMapping("/users/{userId}/subscriptions/{truckId}")
    void deleteTruckTag(@PathVariable Long userId, @PathVariable Long truckId, Principal principal){
        Optional<User> userOpt = userService.findUser(userId);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        // Check if truck exists
        Optional<Truck> truckOpt = truckService.findTruck(truckId);
        if (truckOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        // Check if user has same id
        if (principal == null) {
            throw new UnauthorizedException();
        }
        Optional<User> userPOpt = userService.findUserByEmailAddress(principal.getName());
        if (userPOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }
        if (!userOpt.get().equals(userPOpt.get())) {
            throw new UnauthorizedException();
        }

        // Check if subscription association exists
        if (subscriptionService.findSubscription(userOpt.get(), truckOpt.get()).isEmpty()) {
            throw new ResourceNotFoundException();
        }

        subscriptionService.deleteUserSubscription(userOpt.get(), truckOpt.get());
    }
}