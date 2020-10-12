package food.truck.api.data.truck;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserRepository;
import org.junit.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
class TruckServiceTest {

    @Autowired
    private TruckService truckService;

    @Autowired
    private TruckRepository truckRepository;

    @BeforeEach
    void setup() {
        System.out.println("Truck being added");
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo5543vr");

        Truck truck = new Truck();
        truck.setId(56789l);
        truck.setName("Harry");
        truck.setDescription("Best truck ever");
        truck.setLicensePlate("LVN 6982");
        truck.setOwner(user1);
        truckRepository.save(truck);
    }

    @Test
    void findTruck() {
        Optional<Truck> found = truckService.findTruck(56789l);
        assertThat(found.get().getId() == 56789l);
    }

    @Test
    void createTruck() {
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo5543vr");

        Truck truck = new Truck();
        truck.setId(123456l);
        truck.setName("Harry");
        truck.setDescription("Best truck ever");
        truck.setLicensePlate("LVN 6982");

        Truck found = truckService.createTruck(truck,user1);
        assert(found.getName().equals("Harry"));
        assert(found.getOwner().getFirstName().equals("Bob"));
    }

    @Test
    void saveTruck() {
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo5543vr");

        Truck truck = new Truck();
        truck.setId(56789l);
        truck.setName("Bob");
        truck.setDescription("Worst truck ever");
        truck.setLicensePlate("LVN 6982");

        Truck found = truckService.saveTruck(truck);
        assert(found != null);
        assert(found.getName().equals("Bob"));
    }

    @Test
    void deleteTruck() {
        System.out.println("Truck being deleted");
        truckService.deleteTruck(56789l);

        assertThat(truckRepository.findById(56789l).isEmpty());
    }

    @Test
    void getTrucksOwnedByUser() {
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo5543vr");

        Truck t1 = new Truck();
        Truck t2 = new Truck();
        Truck t3 = new Truck();
        t1.setId(1l);
        t2.setId(2l);
        t3.setId(3l);
        t1.setOwner(user1);
        t2.setOwner(user1);
        t3.setOwner(user1);
        truckRepository.save(t1);
        truckRepository.save(t2);
        truckRepository.save(t3);

        List<Truck> trucks = truckRepository.findByOwner(user1);
        assert(trucks.get(0).getOwner().getId() == 1l);
        assert(trucks.get(1).getOwner().getId() == 2l);
        assert(trucks.get(2).getOwner().getId() == 3l);

    }
}