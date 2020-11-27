package food.truck.api.endpoint;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckRepository;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.security.Principal;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
class TruckEndpointTest {
    @Autowired
    private TruckEndpoint truckEndpoint;

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthEndpoint authEndpoint;

    @Test
    void findTruckById() {
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo$$43vr");

        Truck truck = new Truck();
        truck.setName("Harry");
        truck.setDescription("Best truck ever");
        truck.setLicensePlate("LVN 6982");
        truck.setOwner(user1);

        Truck f = truckRepository.save(truck);

        Optional<Truck> found = Optional.ofNullable(truckEndpoint.findTruckById(f.getId()));
        assert(!found.isEmpty());
        assertThat(f.getId() == found.get().getId());
    }

    @Test
    void createTruck() {
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo$$43vr");
        User user = userService.createUser(user1);

        Truck truck = new Truck();
        truck.setName("Harry");
        truck.setDescription("Best truck ever");
        truck.setLicensePlate("LVN 6982");
        truck.setOwner(user);

        Principal p = new Principal() {
            @Override
            public String getName() {
                return user.getEmailAddress();
            }
        };

        authEndpoint.authenticate(p);
        Truck found = truckEndpoint.createTruck(p, truck);
        assertThat(found.getOwner().equals(user1));
    }

    @Test
    void saveTruck() {
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo$$43vr");

        Truck truck = new Truck();
        truck.setName("Harry");
        truck.setDescription("Best truck ever");
        truck.setLicensePlate("LVN 6982");
        truck.setOwner(user1);
        Truck found = truckRepository.save(truck);

        Truck truck2 = new Truck();
        truck2.setName("Bob");
        truck2.setDescription("Worst truck ever");
        truck2.setLicensePlate("LVN 6982");
        truck2.setOwner(user1);

        Truck found2 = truckEndpoint.saveTruck(found.getId(),truck);

        assertThat(found.getId() == found2.getId());
        assertThat(!found.getName().equals(found2.getName()));
    }
}