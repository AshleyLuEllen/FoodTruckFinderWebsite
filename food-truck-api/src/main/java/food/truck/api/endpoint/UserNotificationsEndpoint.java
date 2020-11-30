package food.truck.api.endpoint;

import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.truck_notification.TruckNotificationService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import food.truck.api.data.user_notification.UserNotification;
import food.truck.api.data.user_notification.UserNotificationService;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import food.truck.api.util.UnreadSavedPatch;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@RestController
public class UserNotificationsEndpoint {

    @Autowired
    UserNotificationService userNotificationService;

    @Autowired
    UserService userService;

    @Autowired
    TruckNotificationService notificationService;

    @GetMapping("/users/{userId}/notifications")
    public List<TruckNotification> getUserNotifications(Principal principal, @PathVariable Long userId) {
        // check if the user exists
        User user = userService.findUser(userId).orElseThrow(ResourceNotFoundException::new);

        // Check if user has same id
        if (principal == null) {
            throw new UnauthorizedException();
        }
        User pUser = userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new);

        if (!pUser.equals(user)) {
            throw new UnauthorizedException();
        }

        return userNotificationService.findAllNotifications(user);
    }

    @GetMapping("/users/{userId}/notifications/unread")
    public long getUserNotificationsUnread(Principal principal, @PathVariable Long userId) {
        // check if the user exists
        User user = userService.findUser(userId).orElseThrow(ResourceNotFoundException::new);

        // Check if user has same id
        if (principal == null) {
            throw new UnauthorizedException();
        }
        User pUser = userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new);

        if (!pUser.equals(user)) {
            throw new UnauthorizedException();
        }

        return userNotificationService.findAllNotifications(user).stream().filter(TruckNotification::isUnread).count();
    }

    @PatchMapping("/users/{userId}/notifications/{notificationId}")
    public UserNotification updateUserNotification(Principal principal, @PathVariable Long userId, @PathVariable Long notificationId, @RequestBody UnreadSavedPatch patch) {
        log.info(userId);
        log.info(notificationId);
        // check if the user exists
        User user = userService.findUser(userId).orElseThrow(ResourceNotFoundException::new);

        // Check if user has same id
        if (principal == null) {
            throw new UnauthorizedException();
        }
        User pUser = userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new);
        if (!pUser.equals(user)) {
            throw new UnauthorizedException();
        }

        // Check if notification exists
        TruckNotification notification = notificationService.findTruckNotification(notificationId).orElseThrow(ResourceNotFoundException::new);

        return userNotificationService.updateUserNotification(user, notification, patch);
    }
}