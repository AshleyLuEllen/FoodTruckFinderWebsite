package food.truck.api.data.subscription;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckRepository;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserRepository;
import food.truck.api.data.user.UserService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
@Log4j2
public class SubscriptionServiceTest {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TruckService truckService;

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private SubscriptionService subscriptionService;

    private User user;
    private Truck truck1;
    private Truck truck2;

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

        Truck testTruck1 = new Truck();
        testTruck1.setName("Cozy Food");
        testTruck1.setDescription("Best comfort food ever!");
        testTruck1.setLicensePlate("COZY <3");
        final long truck1ID = truckService.createTruck(testTruck1, user).getId();
        log.info("Created truck1");

        Optional<Truck> truck1Opt = this.truckService.findTruck(truck1ID);
        assertTrue(truck1Opt.isPresent());
        this.truck1 = truck1Opt.get();


        Truck testTruck2 = new Truck();
        testTruck2.setName("Taco Truck");
        testTruck2.setDescription("Best tacos anywhere.");
        testTruck2.setLicensePlate("LVN 6982");
        testTruck2.setOwner(user);
        final long truck2ID = truckService.createTruck(testTruck2, user).getId();
        log.info("Created truck1");

        Optional<Truck> truck2Opt = this.truckService.findTruck(truck2ID);
        assertTrue(truck2Opt.isPresent());
        this.truck2 = truck2Opt.get();
    }

    @AfterEach
    void tearDown() {
        this.userRepository.deleteAll();
        this.truckRepository.deleteAll();
    }

    @Test
    void findSubscription() {
        this.subscriptionService.addUserSubscription(user, truck1);
        assertTrue(this.subscriptionService.findSubscription(user, truck1).isPresent());
        assertTrue(this.subscriptionService.findSubscription(user, truck2).isEmpty());
    }

    @Test
    void findAndAddUserSubscriptions() {
        this.subscriptionService.addUserSubscription(user, truck1);
        this.subscriptionService.addUserSubscription(user, truck2);
        assertArrayEquals(new Truck[] {
            truck1,
            truck2
        }, this.subscriptionService.findUserSubscriptions(user).stream().sorted(Comparator.comparing(Truck::getName)).toArray());
    }

    @Test
    void deleteUserSubscription() {
        this.subscriptionService.addUserSubscription(user, truck1);
        assertTrue(this.subscriptionService.findSubscription(user, truck1).isPresent());
        this.subscriptionService.deleteUserSubscription(user, truck1);
        assertTrue(this.subscriptionService.findSubscription(user, truck1).isEmpty());
    }
}
