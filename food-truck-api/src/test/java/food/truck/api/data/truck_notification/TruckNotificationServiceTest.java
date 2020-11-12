package food.truck.api.data.truck_notification;

import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.Assert.*;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
public class TruckNotificationServiceTest {
    @Autowired
    private TruckNotificationService truckNotificationService;

    @Autowired
    private UserService userService;

    @Autowired
    private TruckService truckservice;

    @Autowired
    private ScheduleService scheduleService;

    long notID;
    User user1;
    Truck truck;
    Schedule location;
    TruckNotification not;

    @BeforeEach
    void setup(){
        User user = new User();
        user.setFirstName("Bob");
        user.setLastName("Ross");
        user.setEmailAddress("bob.ros@example.com");
        user.setPassword("G00dPa$$word");
        user.setLatitude((double) 12);
        user.setLongitude((double) 50);
        user1 = userService.createUser(user);


        Truck truck1 = new Truck();
        truck1.setName("Harry");
        truck1.setDescription("Best truck ever");
        truck1.setLicensePlate("LVN 6982");
        truck1.setOwner(user1);

        Schedule currLoc = new Schedule();
        currLoc.setLatitude((double) 15);
        currLoc.setLongitude((double) 50);
        location = scheduleService.createSchedule(currLoc, truck1);

        truck1.setCurrentLocation(currLoc);
        truck = truckservice.createTruck(truck1, user1);

        not = new TruckNotification();
        not.setTruck(truck);
        not.setSubject("This is a test.");
        not.setDescription("This is only a test.");
        not.setPublished(false);
        notID = truckNotificationService.saveTruckNotification(not).getId();
    }

    @Test
    void testFindNotification(){
        Optional<TruckNotification> found = truckNotificationService.findTruckNotification(notID);
        assertEquals(Optional.of(found.get().getId()), Optional.of(notID));
    }

    @Test
    void testSaveNotification(){
        TruckNotification not2 = new TruckNotification();
        not2.setTruck(truck);
        not2.setSubject("This is a second test.");
        not2.setDescription("This is only a second test.");
        not2.setPublished(false);
        long not2ID = truckNotificationService.saveTruckNotification(not2).getId();

        Optional<TruckNotification> found = truckNotificationService.findTruckNotification(not2ID);
        assertTrue(found.isPresent());
    }

    @Test
    void testCreateNotification(){
        TruckNotification not2 = new TruckNotification();
        not2.setTruck(truck);
        not2.setSubject("This is a second test.");
        not2.setDescription("This is only a second test.");
        not2.setPublished(true);
        long not2ID = truckNotificationService.saveTruckNotification(not2).getId();

        TruckNotification set = truckNotificationService.createTruckNotification(not2, truck);
        assertEquals(not2.getDescription(), set.getDescription());
    }

    @Test
    void testGetAllTruckNotificationsByTruck(){
        assertFalse(truckNotificationService.getNotsOwnedByTruck(truck).isEmpty());
        assertEquals(not, truckNotificationService.getNotsOwnedByTruck(truck).get(0));
    }

    @Test
    void testDeleteNotification(){
        truckNotificationService.deleteTruckNotification(notID);
        assertTrue(truckNotificationService.getNotsOwnedByTruck(truck).isEmpty());
    }
}
