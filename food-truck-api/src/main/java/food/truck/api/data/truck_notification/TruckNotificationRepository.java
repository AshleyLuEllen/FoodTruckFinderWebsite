package food.truck.api.data.truck_notification;


import food.truck.api.data.subscription.Subscription;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TruckNotificationRepository extends JpaRepository<TruckNotification, Long> {

    List<TruckNotification> findAllByTruck(Truck truck);

    @Query(value="SELECT * FROM " + TruckNotification.TABLE_NAME + " tn WHERE tn.truck_id IN (SELECT sub.truck_id FROM " + Subscription.TABLE_NAME + " sub WHERE sub.user_id = ?1)", nativeQuery = true)
    List<TruckNotification> finalAllByUser(Long userId);
}
