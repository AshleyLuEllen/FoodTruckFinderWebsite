package food.truck.api.data.truck_notification;

import java.util.Optional;

import food.truck.api.data.truck.Truck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TruckNotificationService {
    @Autowired
    private TruckNotificationRepository truckNotificationRepository;

    public Optional<TruckNotification> findTruckNotification(Long truckNotification) {
        return truckNotificationRepository.findById(truckNotification);
    }

    public TruckNotification saveTruckNotification(TruckNotification truckNotification) {
        return truckNotificationRepository.save(truckNotification);
    }

    public TruckNotification createTruckNotification(TruckNotification truckNotification, Truck truck) {
        truckNotification.setTruck(truck);

        return truckNotificationRepository.save(truckNotification);
    }
}

