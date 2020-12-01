package food.truck.api.data.user_notification;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, UserNotificationId> {
    List<UserNotification> findAllByUser(User user);

    List<UserNotification> findAllByNotification(TruckNotification notifID);


    void deleteByNotification(UserNotification notif);

    void deleteAllByNotification(TruckNotification notif);
}
