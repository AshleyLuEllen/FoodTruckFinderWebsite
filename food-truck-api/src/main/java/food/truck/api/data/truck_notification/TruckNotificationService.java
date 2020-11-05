package food.truck.api.data.truck_notification;

import java.time.ZonedDateTime;
import java.util.List;
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
        if(truckNotification.published && truckNotification.postedTimestamp == null) {
            truckNotification.setPostedTimestamp(ZonedDateTime.now());
        }
        return truckNotificationRepository.save(truckNotification);
    }

    public TruckNotification createTruckNotification(TruckNotification truckNotification, Truck truck) {
        truckNotification.setTruck(truck);
        if(truckNotification.published) {
            truckNotification.setPostedTimestamp(ZonedDateTime.now());
        }
        return truckNotificationRepository.save(truckNotification);
    }

    public void deleteTruckNotification(long truckNotificationId) {
        truckNotificationRepository.deleteById(truckNotificationId);
    }

    public List<TruckNotification> getNotsOwnedByTruck(Truck truck) {
        return truckNotificationRepository.findAllByTruck(truck);
    }

}

