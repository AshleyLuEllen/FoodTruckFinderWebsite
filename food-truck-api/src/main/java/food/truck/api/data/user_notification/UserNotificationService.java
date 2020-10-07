package food.truck.api.data.user_notification;

import java.util.Optional;

import food.truck.api.data.truck_notification.TruckNotification;
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
}

