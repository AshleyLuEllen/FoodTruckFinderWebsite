package food.truck.api.data.truck_notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TruckNotificationRepository extends JpaRepository<TruckNotification, Long> {
}
