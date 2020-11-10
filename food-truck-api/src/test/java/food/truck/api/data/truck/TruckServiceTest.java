package food.truck.api.data.truck;

import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
class TruckServiceTest {

    @Autowired
    private TruckService truckService;

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private UserService userService;

    long truckID = -1l;
    User user1;
    Truck truck;
    Schedule location;

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
        truck = truckService.createTruck(truck1, user1);

        assertEquals(truck.getName(), "Harry");
        assertEquals(truck.getOwner().getFirstName(), ("Bob"));

        truckID = truck.getId();
    }

    @Test
    void testFindTruck() {
        Optional<Truck> found = truckService.findTruck(truckID);
        assertEquals(Optional.ofNullable(found.get().getId()), Optional.ofNullable(truckID));
    }

    @Test
    void testSaveTruck() {
        Truck found = truckService.saveTruck(truck);
        assertNotNull(found);
        assertEquals(found.getName(), "Harry");
    }

    @Test
    void testDeleteTruck() {
        System.out.println("Truck being deleted");
        truckService.deleteTruck(truckID);

        assertTrue(truckRepository.findById(truckID).isEmpty());
    }

    @Test
    @Cascade(CascadeType.ALL)
    void testGetTrucksOwnedByUser() {
        Truck truck1 = new Truck();
        truck1.setName("Harry");
        truck1.setDescription("Best truck ever");
        truck1.setLicensePlate("LVN 6982");

        Truck found1 = truckService.createTruck(truck1,user1);

        Truck truck2 = new Truck();
        truck2.setName("Ford");
        truck2.setDescription("Meh Truck");
        truck2.setLicensePlate("LVN 6983");

        Truck found2 = truckService.createTruck(truck2,user1);

        Truck truck3 = new Truck();
        truck3.setName("Charlie");
        truck3.setDescription("No");
        truck3.setLicensePlate("LVN 6984");

        Truck found3 = truckService.createTruck(truck3,user1);

        List<Truck> trucks = truckService.getTrucksOwnedByUser(user1);
        assertNotNull(trucks);
        assertEquals(trucks.size(), 4);
    }
}