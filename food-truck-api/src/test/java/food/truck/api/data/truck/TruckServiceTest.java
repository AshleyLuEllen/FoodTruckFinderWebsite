package food.truck.api.data.truck;
import food.truck.api.data.user.User;
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

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
class TruckServiceTest {

    @Autowired
    private TruckService truckService;

    @Autowired
    private TruckRepository truckRepository;

    long truckID = -1l;

    @BeforeEach
    void setup() {
        System.out.println("Truck being added");
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo5543vr");

        Truck truck = new Truck();
        truck.setName("Harry");
        truck.setDescription("Best truck ever");
        truck.setLicensePlate("LVN 6982");
        truck.setOwner(user1);
        truckID = truckRepository.save(truck).getId();
    }

    @Test
    void findTruck() {
        Optional<Truck> found = truckService.findTruck(truckID);
        assertThat(found.get().getId() == truckID);
    }

    @Test
    void createTruck() {
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo5543vr");

        Truck truck = new Truck();
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
        truckService.deleteTruck(truckID);

        assertThat(truckRepository.findById(truckID).isEmpty());
    }

    @Test
    @Cascade(CascadeType.ALL)
    void getTrucksOwnedByUser() {
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
    }
}