package food.truck.api.data.truck;
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

import javax.persistence.OneToMany;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
class TruckServiceTest {

    @Autowired
    private TruckService truckService;

    @Autowired
    private UserService userService;

    Truck truck;
    User u;

    @BeforeEach
    void setup() {
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo$$43vr");
        u = userService.createUser(user1);

        Truck truck1 = new Truck();
        truck1.setName("Harry");
        truck1.setDescription("Best truck ever");
        truck1.setLicensePlate("LVN 6982");
        truck1.setOwner(user1);
        truck = truckService.createTruck(truck1, u);
    }

    @Test
    void findTruck() {
        Optional<Truck> found = truckService.findTruck(truck.getId());
        assertThat(found.get().getId() == truck.getId());
    }

    @Test
    void createTruck() {
        Truck truck = new Truck();
        truck.setName("Harry");
        truck.setDescription("Best truck ever");
        truck.setLicensePlate("LVN 6982");

        Truck found = truckService.createTruck(truck,u);
        assert(found.getName().equals("Harry"));
        assert(found.getOwner().getFirstName().equals("Bob"));
    }

    @Test
    void saveTruck() {
        truck.setLicensePlate("BIG LICENSE");

        Truck found = truckService.saveTruck(truck);
        assert(found != null);
        assert(found.getLicensePlate().equals("BIG LICENSE"));
    }

    @Test
    void deleteTruck() {
        System.out.println("Truck being deleted");
        truckService.deleteTruck(truck.getId());

        assertThat(truckService.findTruck(truck.getId()).isEmpty());
    }

    @Test
    @Cascade(CascadeType.ALL)
    void getTrucksOwnedByUser() {
        Truck t1 = new Truck();
        t1.setDescription("truck 1");
        t1.setName("t1");

        Truck t2 = new Truck();
        t2.setDescription("truck 2");
        t2.setName("t2");

        Truck t3 = new Truck();
        t1.setDescription("truck 3");
        t1.setName("t3");

        truckService.createTruck(t1, u);
        truckService.createTruck(t2, u);
        truckService.createTruck(t3, u);

        List<Truck> trucks = truckService.getTrucksOwnedByUser(u);
        assertThat(trucks != null);
        assertArrayEquals(new Truck[]{truck, t1, t2, t3}, trucks.toArray());
    }
}