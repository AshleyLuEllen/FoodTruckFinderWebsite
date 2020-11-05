package food.truck.api.data.truck_notification;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import food.truck.api.data.subscription.Subscription;
import food.truck.api.data.subscription.SubscriptionRepository;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.user_notification.UserNotification;
import food.truck.api.data.user_notification.UserNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TruckNotificationService {
    @Autowired
    private TruckNotificationRepository truckNotificationRepository;

    @Autowired
    private UserNotificationRepository userNotificationRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public Optional<TruckNotification> findTruckNotification(Long truckNotification) {
        return truckNotificationRepository.findById(truckNotification);
    }

    public TruckNotification saveTruckNotification(TruckNotification truckNotification) {
        boolean notifySubscribers = false;

        if(truckNotification.published && truckNotification.postedTimestamp == null) {
            truckNotification.setPostedTimestamp(ZonedDateTime.now());
            notifySubscribers = true;

        }
        var tn = truckNotificationRepository.save(truckNotification);

        if (notifySubscribers) {
            userNotificationRepository.saveAll(
                subscriptionRepository.findAllByTruck(truckNotification.getTruck()).stream()
                    .map(sub -> {
                        var un = new UserNotification();
                        un.setNotification(truckNotification);
                        un.setUser(sub.getUser());
                        un.setSaved(false);
                        un.setUnread(true);
                        return un;
                    }).collect(Collectors.toList())
            );
        }

        return tn;
    }

    public TruckNotification createTruckNotification(TruckNotification truckNotification, Truck truck) {
        boolean notifySubscribers = false;

        truckNotification.setTruck(truck);
        if(truckNotification.published) {
            truckNotification.setPostedTimestamp(ZonedDateTime.now());
            notifySubscribers = true;
        }

        var tn = truckNotificationRepository.save(truckNotification);

        if (notifySubscribers) {
            userNotificationRepository.saveAll(
                subscriptionRepository.findAllByTruck(truckNotification.getTruck()).stream()
                    .map(sub -> {
                        var un = new UserNotification();
                        un.setNotification(truckNotification);
                        un.setUser(sub.getUser());
                        un.setSaved(false);
                        un.setUnread(true);
                        return un;
                    }).collect(Collectors.toList())
            );
        }

        return tn;
    }

    public void deleteTruckNotification(long truckNotificationId) {
        truckNotificationRepository.deleteById(truckNotificationId);
    }

    public List<TruckNotification> getNotsOwnedByTruck(Truck truck) {
        return truckNotificationRepository.findAllByTruck(truck);
    }

}

