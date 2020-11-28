package food.truck.api.data.truck_notification;

import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.subscription.SubscriptionRepository;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import food.truck.api.data.user_notification.UserNotification;
import food.truck.api.data.user_notification.UserNotificationRepository;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.util.Location;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
public class TruckNotificationService {
    @Autowired
    private TruckNotificationRepository truckNotificationRepository;

    @Autowired
    private TruckService truckService;

    @Autowired
    private UserNotificationRepository userNotificationRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ScheduleService scheduleService;

    public Optional<TruckNotification> findTruckNotification(Long truckNotification) {
        return truckNotificationRepository.findById(truckNotification);
    }

    public TruckNotification saveTruckNotification(TruckNotification truckNotification) {
        boolean notifySubscribers = false;

        if (truckNotification.published && truckNotification.postedTimestamp == null) {
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
                        un.setUnread(true);
                        return un;
                    }).collect(Collectors.toList())
            );
            Truck truck = truckService.findTruck(truckNotification.getTruck().getId()).orElseThrow(ResourceNotFoundException::new);
            Schedule currentLocation = truck.getCurrentLocation();
            if (currentLocation != null)
            userNotificationRepository.saveAll(
                userService.findUsersNearLocation(new Location(currentLocation.getLatitude(), currentLocation.getLongitude())).stream()
                    .map(user -> {
                        var un = new UserNotification();
                        un.setNotification(truckNotification);
                        un.setUser(user);
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
        truckNotification.setType(NotificationType.TRUCK);
        if (truckNotification.published != null && truckNotification.getPublished()) {
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
                        un.setUnread(true);
                        return un;
                    }).collect(Collectors.toList())
            );
            Schedule currentLocation = truck.getCurrentLocation();
            if (currentLocation != null) {
                userNotificationRepository.saveAll(
                    userService.findUsersNearLocation(new Location(currentLocation.getLatitude(), currentLocation.getLongitude())).stream()
                        .map(user -> {
                            var un = new UserNotification();
                            un.setNotification(truckNotification);
                            un.setUser(user);
                            un.setUnread(true);
                            return un;
                        }).peek(un -> log.info(un.getUser().getLastName())).collect(Collectors.toList())
                );
            }
        }

        return tn;
    }

    public TruckNotification createFriendNotification(User user, User newFriend){
        TruckNotification notification = new TruckNotification();

        notification.setType(NotificationType.FRIEND);
        notification.setSubject("You have a new friend!");
        notification.setDescription("Your new friend is " + newFriend.getFirstName() + ' ' + newFriend.getLastName() + ".");
        notification.setMedia(null);
        notification.setUser(newFriend);
        notification.setPublished(true);

        notification.setType(NotificationType.FRIEND);
        notification.setSubject("You have a new friend following you.");
        notification.setDescription(newFriend.getFirstName() + ' ' + newFriend.getLastName() + " just started following you. You can f.");
        notification.setMedia(null);
        notification.setUser(newFriend);
        notification.setPublished(true);

        return truckNotificationRepository.save(notification);
    }

    public TruckNotification createSubscriptionNotification(Truck truck, User user){
        TruckNotification notification = new TruckNotification();

        notification.setType(NotificationType.SUBSCRIPTION);
        notification.setSubject("You have subscribed to a new food truck!");
        notification.setDescription("Your new subscription is is " + truck.getName() + ".");
        notification.setMedia(null);
        notification.setTruck(truck);
        notification.setPublished(true);

        return truckNotificationRepository.save(notification);
    }

    public void deleteTruckNotification(long truckNotificationId) {
        truckNotificationRepository.deleteById(truckNotificationId);
    }

    public List<TruckNotification> getNotsOwnedByTruck(Truck truck) {
        return truckNotificationRepository.findAllByTruckAndType(truck, NotificationType.TRUCK);
    }

}

