package food.truck.api.data.user_notification;

import food.truck.api.data.subscription.SubscriptionService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckRepository;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.truck_notification.TruckNotificationRepository;
import food.truck.api.data.truck_notification.TruckNotificationService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserRepository;
import food.truck.api.data.user.UserService;
import food.truck.api.util.UnreadSavedPatch;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
@Log4j2
public class UserNotificationServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TruckService truckService;

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private TruckNotificationService truckNotificationService;

    @Autowired
    private TruckNotificationRepository truckNotificationRepository;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private UserNotificationService userNotificationService;

    @Autowired
    private UserNotificationRepository userNotificationRepository;

    private User user;
    private Truck truck;
    private Truck truck2;
    private TruckNotification notification;
    private TruckNotification notification2;

    @BeforeEach
    void setUp() {
        // Test user
        User testUser = new User();
        testUser.setPassword("B@yl0rR0cks!");
        testUser.setFirstName("Bobby");
        testUser.setLastName("Baylor");
        testUser.setEmailAddress("Bobby_Baylor@baylor.edu");
        testUser.setLongitude(0.0);
        testUser.setLatitude(0.0);
        final long userId = this.userService.createUser(testUser).getId();
        log.info("Created test user");

        // Save User DAO
        Optional<User> userOpt = this.userService.findUser(userId);
        assertTrue(userOpt.isPresent());
        this.user = userOpt.get();

        Truck testTruck = new Truck();
        testTruck.setName("Cozy Food");
        testTruck.setDescription("Best comfort food ever!");
        testTruck.setLicensePlate("COZY <3");
        final long truckID = truckService.createTruck(testTruck, user).getId();
        log.info("Created truck1");

        Optional<Truck> truckOpt = this.truckService.findTruck(truckID);
        assertTrue(truckOpt.isPresent());
        this.truck = truckOpt.get();

        this.subscriptionService.addUserSubscription(user, truck);

        TruckNotification testNotification = new TruckNotification();
        testNotification.setDescription("This is the description");
        testNotification.setSubject("SALE");
        final long notId = truckNotificationService.createTruckNotification(testNotification, truck).getId();

        Optional<TruckNotification> notificationOpt = this.truckNotificationService.findTruckNotification(notId);
        assertTrue(notificationOpt.isPresent());
        this.notification = notificationOpt.get();

        Truck testTruck2 = new Truck();
        testTruck2.setName("Cozy Food");
        testTruck2.setDescription("Best comfort food ever!");
        testTruck2.setLicensePlate("COZY <3");
        final long truckID2 = truckService.createTruck(testTruck2, user).getId();
        log.info("Created truck1");

        Optional<Truck> truck2Opt = this.truckService.findTruck(truckID2);
        assertTrue(truck2Opt.isPresent());
        this.truck2 = truck2Opt.get();

        TruckNotification testNotification2 = new TruckNotification();
        testNotification2.setDescription("This is the description");
        testNotification2.setSubject("SALE");
        final long notId2 = truckNotificationService.createTruckNotification(testNotification2, truck).getId();

        Optional<TruckNotification> notification2Opt = this.truckNotificationService.findTruckNotification(notId2);
        assertTrue(notification2Opt.isPresent());
        this.notification2 = notification2Opt.get();

    }

    @AfterEach
    void tearDown() {
        this.userRepository.deleteAll();
        this.truckRepository.deleteAll();
        this.truckNotificationRepository.deleteAll();
        this.userNotificationRepository.deleteAll();
    }

    @Test
    void addUserNotification() {
        UnreadSavedPatch patch = new UnreadSavedPatch();
        patch.setSaved(true);
        userNotificationService.updateUserNotification(user, notification, patch);
        assertTrue(this.userNotificationService.findUserNotification(user, notification).isPresent());
        assertTrue(this.userNotificationService.findUserNotification(user, notification2).isEmpty());
    }

    @Test
    void findAllSavedNotifications() {
        notification.setPublished(true);
        UnreadSavedPatch patch = new UnreadSavedPatch();
        patch.setSaved(true);
        patch.setUnread(false);
        userNotificationService.updateUserNotification(user, notification, patch);
        assertArrayEquals(new TruckNotification[] {notification}, this.userNotificationService.findAllSavedNotifications(user).toArray());
    }

    @Test
    void deleteUserSavedNotification() {
        UnreadSavedPatch patch = new UnreadSavedPatch();
        patch.setSaved(true);
        patch.setUnread(false);
        userNotificationService.updateUserNotification(user, notification, patch);
        assertTrue(this.userNotificationService.findUserNotification(user, notification).isPresent());

        patch.setSaved(false);
        patch.setUnread(null);
        userNotificationService.updateUserNotification(user, notification, patch);
        assertTrue(this.userNotificationService.findUserNotification(user, notification).isEmpty());
    }

    @Test
    void findAllNotifications() {
        UnreadSavedPatch patch = new UnreadSavedPatch();
        patch.setSaved(true);
        patch.setUnread(false);
        userNotificationService.updateUserNotification(user, notification2, patch);
        assertTrue(this.userNotificationService.findUserNotification(user, notification2).isPresent());

        assertTrue(this.userNotificationService.findAllNotifications(user).isEmpty());
        notification.setPublished(true);
        notification2.setPublished(true);
        assertArrayEquals(List.of(notification, notification2).stream().mapToLong(TruckNotification::getId).sorted().toArray(),
            this.userNotificationService.findAllNotifications(user).stream().mapToLong(TruckNotification::getId).sorted().toArray());

        TruckNotification tn = this.userNotificationService.findAllNotifications(user).stream()
            .filter(n -> n.getId().equals(notification2.getId()))
            .findFirst().get();
        assertTrue(tn.isSaved());
        assertFalse(tn.isUnread());
    }

    @Test
    void updateUserNotification() {
        UnreadSavedPatch patch = new UnreadSavedPatch();
        Optional<UserNotification> userNotOpt;

        patch.setSaved(true);
        patch.setUnread(false);
        userNotificationService.updateUserNotification(user, notification2, patch);
        userNotOpt = this.userNotificationService.findUserNotification(user, notification2);
        assertTrue(userNotOpt.isPresent());
        UserNotification un1 = userNotOpt.get();
        assertTrue(un1.getSaved());
        assertFalse(un1.getUnread());

        patch.setSaved(null);
        patch.setUnread(true);
        userNotificationService.updateUserNotification(user, notification2, patch);
        userNotOpt = this.userNotificationService.findUserNotification(user, notification2);
        assertTrue(userNotOpt.isPresent());
        un1 = userNotOpt.get();
        assertTrue(un1.getSaved());
        assertTrue(un1.getUnread());

        patch.setSaved(false);
        patch.setUnread(null);
        userNotificationService.updateUserNotification(user, notification2, patch);
        userNotOpt = this.userNotificationService.findUserNotification(user, notification2);
        assertTrue(userNotOpt.isPresent());
        un1 = userNotOpt.get();
        assertFalse(un1.getSaved());
        assertTrue(un1.getUnread());

        patch.setSaved(false);
        patch.setUnread(false);
        userNotificationService.updateUserNotification(user, notification2, patch);
        userNotOpt = this.userNotificationService.findUserNotification(user, notification2);
        assertTrue(userNotOpt.isEmpty());
    }
}
