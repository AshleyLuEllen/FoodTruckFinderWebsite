package food.truck.api.data.user_notification;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.truck_tag.TruckTag;
import food.truck.api.data.truck_tag.TruckTagId;
import food.truck.api.data.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserNotificationService {
    @Autowired
    private UserNotificationRepository userNotificationRepository;

    public Optional<UserNotification> findUserNotification(User user, TruckNotification notification) {
        return userNotificationRepository.findById(new UserNotificationId(user, notification));
    }

    public UserNotification saveUserNotification(UserNotification userNotification) {
        return userNotificationRepository.save(userNotification);
    }

    public UserNotification createUserNotification(UserNotification userNotification) {
        return userNotificationRepository.save(userNotification);
    }

    public List<TruckNotification> findAllSavedNotifications(User user) {
        return userNotificationRepository.findAllByUser(user).stream().map(UserNotification::getNotification).collect(Collectors.toList());
    }

    public void addUserSavedNotification(User user, TruckNotification notification) {
        UserNotification savedNotification = new UserNotification();
        savedNotification.setNotification(notification);
        savedNotification.setUser(user);

        userNotificationRepository.save(savedNotification);
    }

    public void deleteUserSavedNotification(User user, TruckNotification notification) {
        userNotificationRepository.deleteById(new UserNotificationId(user, notification));
    }
}

