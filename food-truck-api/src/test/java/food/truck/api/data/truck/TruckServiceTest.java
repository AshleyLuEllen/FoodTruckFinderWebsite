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

import static org.assertj.core.api.Assertions.assertThat;

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
        truckID = truck.getId();
    }

    @Test
    void findTruck() {
        Optional<Truck> found = truckService.findTruck(truckID);
        assertThat(found.get().getId() == truckID);
    }

    @Test
    void createTruck() {
        Truck found = truckService.createTruck(truck,user1);
        assert(found.getName().equals("Harry"));
        assert(found.getOwner().getFirstName().equals("Bob"));
    }

    @Test
    void saveTruck() {
        Truck found = truckService.saveTruck(truck);
        assert(found != null);
        assert(found.getName().equals("Harry"));
    }

    @Test
    void deleteTruck() {
        System.out.println("Truck being deleted");
        truckService.deleteTruck(truckID);

        assertThat(truckRepository.findById(truckID).isEmpty());
    }

    @Test
    @Cascade(CascadeType.ALL)
    void getTrucksOwnedByUser() {
        /*
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo5543vr");

        Truck t1 = new Truck();
        Truck t2 = new Truck();
        Truck t3 = new Truck();
        t1.setOwner(user1);
        t2.setOwner(user1);
        t3.setOwner(user1);
        truckRepository.save(t1);
        truckRepository.save(t2);
        truckRepository.save(t3);

        List<Truck> trucks = truckService.getTrucksOwnedByUser(user1);
        assertThat(trucks != null);
        assertThat(trucks.size() == 3);

         */
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
        assertThat(trucks != null);
        assertThat(trucks.size() == 3);
    }
}