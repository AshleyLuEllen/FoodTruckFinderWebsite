package food.truck.api.endpoint;

import food.truck.api.data.friends.FriendService;
import food.truck.api.data.subscription.SubscriptionService;
import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
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
public class UserFriendsEndpoint {

    @Autowired
    UserService userService;

    @Autowired
    FriendService friendService;

    @GetMapping("/users/{userId}/friends")
    List<User> getUserSubscriptions(@PathVariable Long userId){
        Optional<User> userOpt = userService.findUser(userId);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        return friendService.findAllFriendsOfUser(userOpt.get());
    }

    @PostMapping("/users/{userId}/friends/{fuserId}")
    void addUserFriend(@PathVariable Long userId, @PathVariable Long fuserId, Principal principal){
        // Check if user exists
        Optional<User> userOpt = userService.findUser(userId);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        // Check if friend exists
        Optional<User> friendOpt = userService.findUser(fuserId);
        if (friendOpt.isEmpty()) {
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

        friendService.becomeFriends(userOpt.get(), friendOpt.get());
    }

    @DeleteMapping("/users/{userId}/friends/{userId}")
    void deleteUserFriend(@PathVariable Long userId, @PathVariable Long fuserId, Principal principal){
        Optional<User> userOpt = userService.findUser(userId);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        // Check if friend exists
        Optional<User> friendOpt = userService.findUser(fuserId);
        if (friendOpt.isEmpty()) {
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

        // Check if truck tag association exists
        if (!friendService.areFriends(userOpt.get(), friendOpt.get())) {
            throw new ResourceNotFoundException();
        }

        friendService.removeFriends(userOpt.get(), friendOpt.get());
    }
}