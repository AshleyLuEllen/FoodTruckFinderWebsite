package food.truck.api.data.truck_notification;


import food.truck.api.data.subscription.Subscription;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import food.truck.api.data.user_notification.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TruckNotificationRepository extends JpaRepository<TruckNotification, Long> {

    List<TruckNotification> findAllByTruckAndType(Truck truck, NotificationType type);

    @Query(value="(SELECT * FROM " + TruckNotification.TABLE_NAME + " tn WHERE tn.truck_id IN (SELECT sub.truck_id FROM " + Subscription.TABLE_NAME + " sub WHERE sub.user_id = ?1)) UNION (SELECT * FROM " + TruckNotification.TABLE_NAME + " tn2 WHERE tn2.notification_id IN (SELECT un2.notification_id FROM " + UserNotification.TABLE_NAME + " un2 WHERE un2.user_id = ?1))", nativeQuery = true)
    List<TruckNotification> findAllByUser(Long userId);

    void deleteAllByTruck(Truck truck);

    void deleteById(Long notifID);

    List<TruckNotification> findAllByTruck(Truck truck);
}
