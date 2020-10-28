package food.truck.api.data.truck_notification;

import food.truck.api.data.truck.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TruckNotificationRepository extends JpaRepository<TruckNotification, Long> {
    List<TruckNotification> findAllByTruck(Truck truck);
}
