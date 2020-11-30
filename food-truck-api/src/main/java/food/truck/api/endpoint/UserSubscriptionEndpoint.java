package food.truck.api.endpoint;

import food.truck.api.data.subscription.Subscription;
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
    public List<Truck> getUserSubscriptions(@PathVariable Long userId){
        // check that the user exists
        return subscriptionService.findUserSubscriptions(
            userService.findUser(userId).orElseThrow(ResourceNotFoundException::new));
    }

    @GetMapping("/users/{userId}/subscriptions/{truckId}")
    public Subscription getUserSubscription(@PathVariable Long userId, @PathVariable Long truckId) {
        return subscriptionService.findSubscription(
            userService.findUser(userId).orElseThrow(ResourceNotFoundException::new),
            truckService.findTruck(truckId).orElseThrow(ResourceNotFoundException::new)
        ).orElseThrow(ResourceNotFoundException::new);
    }

    @PostMapping("/users/{userId}/subscriptions/{truckId}")
    public void addUserSubscription(Principal principal, @PathVariable Long userId, @PathVariable Long truckId){
        // Check if user exists
        User user = userService.findUser(userId).orElseThrow(ResourceNotFoundException::new);
        // Check if truck exists
        Truck truck = truckService.findTruck(truckId).orElseThrow(ResourceNotFoundException::new);

        // Check if user has same id
        if (principal == null) {
            throw new UnauthorizedException();
        }
        User pUser = userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new);
        if (!pUser.equals(user)) {
            throw new UnauthorizedException();
        }
        subscriptionService.addUserSubscription(user, truck);
    }

    @DeleteMapping("/users/{userId}/subscriptions/{truckId}")
    public void deleteUserSubscription(Principal principal, @PathVariable Long userId, @PathVariable Long truckId){
        User user = userService.findUser(userId).orElseThrow(ResourceNotFoundException::new);
        // Check if truck exists
        Truck truck = truckService.findTruck(truckId).orElseThrow(ResourceNotFoundException::new);

        // Check if user has same id
        if (principal == null) {
            throw new UnauthorizedException();
        }
        User pUser = userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new);
        if (!pUser.equals(user)) {
            throw new UnauthorizedException();
        }

        // Check if subscription association exists
        subscriptionService.findSubscription(user, truck).orElseThrow(ResourceNotFoundException::new);


        subscriptionService.deleteUserSubscription(user, truck);
    }
}