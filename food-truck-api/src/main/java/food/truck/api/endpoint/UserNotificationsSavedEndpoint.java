package food.truck.api.endpoint;

import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.truck_notification.TruckNotificationService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import food.truck.api.data.user_notification.UserNotificationService;
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
public class UserNotificationsSavedEndpoint {

    @Autowired
    UserNotificationService userNotificationService;

    @Autowired
    UserService userService;

    @Autowired
    TruckNotificationService notificationService;

    @GetMapping("/users/{userId}/notifications/saved")
    List<Tag> getUserSavedNotifications(@PathVariable Long userId, Principal principal){
        // check if the user exists
        Optional<User> userOpt = userService.findUser(userId);
        if (userOpt.isEmpty()) {
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

        return userNotificationService.findAllSavedNotifications(userOpt.get());
    }

    @PostMapping("/users/{userId}/notifications/saved/{notificationId}")
    void addUserSavedNotifications(@PathVariable Long userId, @PathVariable Long notificationId, Principal principal){
        // Check if user exists
        Optional<User> userOpt = userService.findUser(userId);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        Optional<TruckNotification> notificationOpt = notificationService.findTruckNotification(notificationId);
        if (notificationOpt.isEmpty()) {
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

        userNotificationService.addUserSavedNotification(userOpt.get(), notificationOpt.get());
    }

    @DeleteMapping("/users/{userId}/notifications/saved/{notificationId}")
    void deleteUserSavedNotifications(@PathVariable Long userId, @PathVariable Long notificationId, Principal principal){
        Optional<User> userOpt = userService.findUser(userId);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        Optional<TruckNotification> notificationOpt = notificationService.findTruckNotification(notificationId);
        if (notificationOpt.isEmpty()) {
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
        if (userNotificationService.findUserNotification(userOpt.get(), notificationOpt.get()).isEmpty()) {
            throw new ResourceNotFoundException();
        }

        userNotificationService.deleteUserSavedNotification(userOpt.get(), notificationOpt.get());
    }
}