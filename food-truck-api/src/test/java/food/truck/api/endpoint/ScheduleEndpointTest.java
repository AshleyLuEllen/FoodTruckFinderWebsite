package food.truck.api.endpoint;

import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.schedule.ScheduleRepository;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckRepository;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.security.Principal;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
class ScheduleEndpointTest {
    @Autowired
    private TruckEndpoint truckEndpoint;

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private ScheduleEndpoint scheduleEndpoint;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private TruckService truckService;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthEndpoint authEndpoint;

    long truckID = -1l;

    @Test
    void findScheduleById() {
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
        truckID = truckRepository.save(truck).getId();

        Schedule schedule = new Schedule();
        schedule.setTruck(truck);
        schedule.setLatitude(31.5489);
        schedule.setLongitude(97.1131);
        schedule.setLocation("Baylor University");
        ZoneId zoneId = ZoneId.of("UTC-6");
        ZonedDateTime timeFrom = ZonedDateTime.of(2020, 12, 1, 10, 30, 00, 00, zoneId );
        schedule.setTimeFrom(timeFrom);
        ZonedDateTime timeTo = ZonedDateTime.of(2020, 12, 1, 4, 30, 00, 00, zoneId );
        schedule.setTimeTo(timeTo);

        Schedule s = scheduleRepository.save(schedule);

        Optional<Schedule> found = Optional.ofNullable(scheduleEndpoint.findScheduleById(truckID, s.getId()));
        assert(!found.isEmpty());
        assertThat(s.getId() == found.get().getId());
    }

    @Test
    void createSchedule() {
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
        Truck found = truckRepository.save(truck);

        Schedule schedule = new Schedule();
        schedule.setTruck(truck);
        schedule.setLatitude(31.5489);
        schedule.setLongitude(97.1131);
        schedule.setLocation("Baylor University");
        ZoneId zoneId = ZoneId.of("UTC-6");
        ZonedDateTime timeFrom = ZonedDateTime.of(2020, 12, 1, 10, 30, 00, 00, zoneId );
        schedule.setTimeFrom(timeFrom);
        ZonedDateTime timeTo = ZonedDateTime.of(2020, 12, 1, 4, 30, 00, 00, zoneId );
        schedule.setTimeTo(timeTo);

        Principal p = new Principal() {
            @Override
            public String getName() {
                return user.getEmailAddress();
            }
        };

        authEndpoint.authenticate();
        Schedule f = scheduleEndpoint.createSchedule(found.getId(), schedule);

        assertThat(f.getTruck().getOwner().equals(user1));
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

        Schedule schedule = new Schedule();
        schedule.setTruck(truck);
        schedule.setLatitude(31.5489);
        schedule.setLongitude(97.1131);
        schedule.setLocation("Baylor University");
        ZoneId zoneId = ZoneId.of("UTC-6");
        ZonedDateTime timeFrom = ZonedDateTime.of(2020, 12, 1, 10, 30, 00, 00, zoneId );
        schedule.setTimeFrom(timeFrom);
        ZonedDateTime timeTo = ZonedDateTime.of(2020, 12, 1, 4, 30, 00, 00, zoneId );
        schedule.setTimeTo(timeTo);

        Schedule s = scheduleRepository.save(schedule);

        Schedule s2 = scheduleEndpoint.saveTruck(found.getId(), s.getId(), schedule);

        assertThat(s.getId() == s2.getId());
        assertThat(!s.getTruck().getName().equals(s2.getTruck().getName()));
    }
}