package food.truck.api.data.user_notification;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.truck_notification.TruckNotificationRepository;
import food.truck.api.data.user.User;
import food.truck.api.util.UnreadSavedPatch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserNotificationService {
    @Autowired
    private UserNotificationRepository userNotificationRepository;

    @Autowired
    private TruckNotificationRepository truckNotificationRepository;

    public Optional<UserNotification> findUserNotification(User user, TruckNotification notification) {
        return userNotificationRepository.findById(new UserNotificationId(user.getId(), notification.getId()));
    }

    public List<TruckNotification> findAllSavedNotifications(User user) {
        return userNotificationRepository.findAllByUser(user).stream().map(UserNotification::getNotification).filter(truckNotification1 -> truckNotification1.getPublished() != null && truckNotification1.getPublished())
            .collect(Collectors.toList());
    }

    public List<TruckNotification> findAllNotifications(User user) {
        List<TruckNotification> notificationList = truckNotificationRepository.findAllByUser(user.getId());

        return notificationList.parallelStream()
            .filter(truckNotification1 -> truckNotification1.getPublished() != null && truckNotification1.getPublished())
            .peek(truckNotification -> {
                Optional<UserNotification> userNotOpt = userNotificationRepository.findById(new UserNotificationId(user.getId(), truckNotification.getId()));
                if (userNotOpt.isPresent()) {
                    truckNotification.setUnread(userNotOpt.get().getUnread());
                } else {
                    truckNotification.setUnread(false);
                }
            })
            .collect(Collectors.toList());

    }

    public UserNotification updateUserNotification(User user, TruckNotification notification, UnreadSavedPatch patch) {
        Optional<UserNotification> userNotificationOpt = userNotificationRepository.findById(new UserNotificationId(user.getId(), notification.getId()));
        UserNotification userNotification = userNotificationOpt.orElseGet(() -> {
            UserNotification not = new UserNotification();
            not.setUser(user);
            not.setNotification(notification);
            not.setUnread(false);
            return not;
        });

        if (userNotification.getUnread() && patch.getUnread() != null && !patch.getUnread()) {
            userNotification.setUnread(false);
        } else if (!userNotification.getUnread() && patch.getUnread() != null && patch.getUnread()) {
            userNotification.setUnread(true);
        }

        return userNotificationRepository.save(userNotification);
    }
}

