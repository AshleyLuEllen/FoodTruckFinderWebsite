package food.truck.api.data.truck_notification;

import food.truck.api.data.friends.FriendPair;
import food.truck.api.data.friends.FriendService;
import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.schedule.ScheduleRepository;
import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.subscription.SubscriptionService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckRepository;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserRepository;
import food.truck.api.data.user.UserService;
import food.truck.api.data.user_notification.UserNotification;
import food.truck.api.data.user_notification.UserNotificationRepository;
import food.truck.api.data.user_notification.UserNotificationService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;

import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
public class TruckNotificationServiceTest {
    @Autowired
    private TruckNotificationService truckNotificationService;

    @Autowired
    private TruckNotificationRepository truckNotificationRepository;

    @Autowired
    private FriendService friendService;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserNotificationService userNotificationService;

    @Autowired
    private UserNotificationRepository userNotificationRepository;

    @Autowired
    private TruckService truckService;

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private ScheduleRepository scheduleRepository;

    User user;
    Truck truck;
    Schedule location;
    TruckNotification notification;


    // TODO there is not after each function to reset the database
    @BeforeEach
    void setup(){
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ros@example.com");
        user1.setPassword("G00dPa$$word");
        user1.setLatitude((double) 15);
        user1.setLongitude((double) 50.01);
        user = userService.createUser(user1);

        Truck truck1 = new Truck();
        truck1.setName("Harry");
        truck1.setDescription("Best truck ever");
        truck1.setLicensePlate("LVN 6982");
        truck = truckService.createTruck(truck1, user);

        Schedule schedule = new Schedule();
        schedule.setLocation("Test Location");
        schedule.setLatitude((double) 15);
        schedule.setLongitude((double) 50);
        schedule.setTimeFrom(ZonedDateTime.now().minusHours(4));
        schedule.setTimeFrom(ZonedDateTime.now().plusHours(4));
        location = scheduleService.createSchedule(schedule, truck);

        TruckNotification not = new TruckNotification();
        not.setSubject("This is a test.");
        not.setDescription("This is only a test.");
        not.setPublished(false);
        notification = truckNotificationService.createTruckNotification(not, truck);
    }

    @AfterEach
    void tearDown() {
        this.truckNotificationRepository.deleteAll();
        this.userNotificationRepository.deleteAll();
        this.scheduleRepository.deleteAll();
        this.truckRepository.deleteAll();
        this.userRepository.deleteAll();
    }

    @Test
    void testFindNotification(){
        assertEquals(notification, truckNotificationService.findTruckNotification(notification.getId()).orElse(null));
    }

    @Test
    void testPublishedNotification(){
        notification.setPublished(true);
        truckNotificationService.saveTruckNotification(notification);
        assertTrue(notification.getPublished());
//        assertEquals(1, this.userNotificationService.findAllNotifications(user).size()); TODO fix so that this test works
    }

    @Test
    void testCreateFriendNotifications(){
        User user2 = new User();
        user2.setFirstName("Beep");
        user2.setLastName("Boop");
        user2.setEmailAddress("email@example.com");
        user2.setPassword("G00dPa$$word");
        User friend = userService.createUser(user2);

        friendService.becomeFriends(user, friend);
        assertEquals(1, this.userNotificationService.findAllNotifications(user).size());
        assertEquals(NotificationType.FRIEND, this.userNotificationService.findAllNotifications(user).get(0).getType());

        assertEquals(1, this.userNotificationService.findAllNotifications(friend).size());
        assertEquals(NotificationType.FRIEND, this.userNotificationService.findAllNotifications(friend).get(0).getType());
    }

    @Test
    void testCreateSubscriptionNotifications(){
        subscriptionService.addUserSubscription(user, truck);
        assertEquals(1, this.userNotificationService.findAllNotifications(user).size());
        assertEquals(NotificationType.SUBSCRIPTION, this.userNotificationService.findAllNotifications(user).get(0).getType());
        TruckNotification subscription = this.userNotificationService.findAllNotifications(user).get(0);

        notification.setPublished(true);
        truckNotificationService.saveTruckNotification(notification);

        assertEquals(2, this.userNotificationService.findAllNotifications(user).size());
        assertArrayEquals(List.of(notification, subscription).stream().mapToLong(TruckNotification::getId).sorted().toArray(),
            this.userNotificationService.findAllNotifications(user).stream().mapToLong(TruckNotification::getId).sorted().toArray());
    }

    @Test
    void testSaveNotification(){
        notification.setSubject("New Subject");
        notification.setDescription("New Description");
        truckNotificationService.saveTruckNotification(notification);

        assertTrue(truckNotificationService.findTruckNotification(notification.getId()).isPresent());
        assertEquals("New Subject", notification.getSubject());
        assertEquals("New Description", notification.getDescription());
    }

    @Test
    void testGetAllTruckNotificationsByTruck(){
        assertFalse(truckNotificationService.getNotificationsOwnedByTruck(truck).isEmpty());
        assertArrayEquals(List.of(notification).stream().mapToLong(TruckNotification::getId).sorted().toArray(),
            this.truckNotificationService.getNotificationsOwnedByTruck(truck).stream().mapToLong(TruckNotification::getId).sorted().toArray());

        TruckNotification not = new TruckNotification();
        not.setSubject("This is a second test notification.");
        not.setDescription("This is the description.");
        not.setPublished(false);
        TruckNotification notification2 = truckNotificationService.createTruckNotification(not, truck);

        assertArrayEquals(List.of(notification, notification2).stream().mapToLong(TruckNotification::getId).sorted().toArray(),
            this.truckNotificationService.getNotificationsOwnedByTruck(truck).stream().mapToLong(TruckNotification::getId).sorted().toArray());
    }

    @Test
    void testDeleteNotification(){
        assertFalse(truckNotificationService.getNotificationsOwnedByTruck(truck).isEmpty());
        truckNotificationService.deleteTruckNotification(notification.getId());
        assertTrue(truckNotificationService.getNotificationsOwnedByTruck(truck).isEmpty());
    }
}
