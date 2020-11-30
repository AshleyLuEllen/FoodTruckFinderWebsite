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
import food.truck.api.data.user_notification.UserNotificationService;
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
    private UserNotificationService userNotificationService;

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
                subscriptionRepository.findAllByTruck(tn.getTruck()).stream()
                    .map(sub -> {
                        var un = new UserNotification();
                        un.setNotification(tn);
                        un.setUser(sub.getUser());
                        un.setUnread(true);
                        return un;
                    }).collect(Collectors.toList())
            );
            Truck truck = truckService.findTruck(tn.getTruck().getId()).orElseThrow(ResourceNotFoundException::new);
            Schedule currentLocation = truck.getCurrentLocation();
//            log.info("boop");
            if (currentLocation != null) {
//                log.info("here");
//                log.info(userService.findUsersNearLocation(new Location(currentLocation.getLatitude(), currentLocation.getLongitude())).size());
                userNotificationRepository.saveAll(
                    userService.findUsersNearLocation(new Location(currentLocation.getLatitude(), currentLocation.getLongitude())).stream()
                        .map(user -> {
                            var un = new UserNotification();
                            un.setNotification(tn);
                            un.setUser(user);
                            un.setUnread(true);
                            return un;
                        }).collect(Collectors.toList())
                );
            }
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

    public void createFriendNotifications(User user, User newFriend) {
        TruckNotification notification1 = new TruckNotification();
        notification1.setType(NotificationType.FRIEND);
        notification1.setSubject("You have a new friend!");
        notification1.setDescription("Your new friend is **" + newFriend.getFirstName() + ' ' + newFriend.getLastName() + "**.");
        notification1.setMedia(null);
        notification1.setUser(user);
        notification1.setPublished(true);
        notification1.setPostedTimestamp(ZonedDateTime.now());

        TruckNotification not1 = truckNotificationRepository.save(notification1);
        UserNotification userNot1 = new UserNotification();
        userNot1.setUnread(true);
        userNot1.setUser(user);
        userNot1.setNotification(not1);
        userNotificationRepository.save(userNot1);

        TruckNotification notification2 = new TruckNotification();
        notification2.setType(NotificationType.FRIEND);
        notification2.setSubject("You have a new friend following you.");
        notification2.setDescription("**" + user.getFirstName() + ' ' + user.getLastName() + "** just started following you. If you are not friends with them already, you can follow them by clicking [here](/users/" + user.getId() + ").");
        notification2.setMedia(null);
        notification2.setUser(newFriend);
        notification2.setPublished(true);
        notification2.setPostedTimestamp(ZonedDateTime.now());

        TruckNotification not2 = truckNotificationRepository.save(notification2);
        UserNotification userNot2 = new UserNotification();
        userNot2.setUnread(true);
        userNot2.setUser(newFriend);
        userNot2.setNotification(not2);
        userNotificationRepository.save(userNot2);
    }

    public TruckNotification createSubscriptionNotification(Truck truck, User user) {
        TruckNotification notification = new TruckNotification();

        notification.setType(NotificationType.SUBSCRIPTION);
        notification.setSubject("You have subscribed to a new food truck!");
        notification.setDescription("You just subscribed to a new food truck called **" + truck.getName() + "**. You will now receive notifications from them. View its page [here](/trucks/" + truck.getId() + ").");
        notification.setMedia(null);
        notification.setTruck(truck);
        notification.setUser(user);
        notification.setPublished(true);
        notification.setPostedTimestamp(ZonedDateTime.now());

        TruckNotification not = truckNotificationRepository.save(notification);
        UserNotification userNot = new UserNotification();
        userNot.setUnread(true);
        userNot.setUser(user);
        userNot.setNotification(not);
        userNotificationRepository.save(userNot);
        return not;
    }

    public void deleteTruckNotification(long truckNotificationId) {
        truckNotificationRepository.deleteById(truckNotificationId);
    }

    public List<TruckNotification> getNotificationsOwnedByTruck(Truck truck) {
        return truckNotificationRepository.findAllByTruckAndType(truck, NotificationType.TRUCK);
    }

}

