package food.truck.api.data.schedule;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckRepository;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.user.User;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
class ScheduleServiceTest {

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private TruckService truckService;

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    long scheduleID = -1l;
    long truckID = -1l;

    @BeforeEach
    void setup() {
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

        Schedule schedule = new Schedule();
        schedule.setLatitude(31.5489);
        schedule.setLongitude(97.1131);
        schedule.setLocation("Baylor University");
        ZoneId zoneId = ZoneId.of("UTC-6");
        ZonedDateTime timeFrom = ZonedDateTime.of(2020, 12, 1, 10, 30, 00, 00, zoneId );
        schedule.setTimeFrom(timeFrom);
        ZonedDateTime timeTo = ZonedDateTime.of(2020, 12, 1, 4, 30, 00, 00, zoneId );
        schedule.setTimeTo(timeTo);
        schedule.setTruck(truck);
        scheduleID = scheduleRepository.save(schedule).getId();
    }

    @Test
    void findSchedule() {
        Optional<Schedule> found = scheduleService.findSchedule(scheduleID);
        assertThat(found.get().getId() == scheduleID);
    }

    @Test
    void createSchedule() {
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

        Schedule schedule = new Schedule();
        schedule.setLatitude(31.5489);
        schedule.setLongitude(97.1131);
        schedule.setLocation("Baylor University");
        ZoneId zoneId = ZoneId.of("UTC-6");
        ZonedDateTime timeFrom = ZonedDateTime.of(2020, 12, 1, 10, 30, 00, 00, zoneId );
        schedule.setTimeFrom(timeFrom);
        ZonedDateTime timeTo = ZonedDateTime.of(2020, 12, 1, 4, 30, 00, 00, zoneId );
        schedule.setTimeTo(timeTo);
        schedule.setTruck(truck);
        Schedule s = scheduleService.createSchedule(schedule, truck);
        assert(s.getLatitude().equals(31.5489));
        assert(s.getLocation().equals("Baylor University"));
    }

    @Test
    void saveSchedule() {
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo5543vr");

        Truck truck = new Truck();
        truck.setName("Bob");
        truck.setDescription("Worst truck ever");
        truck.setLicensePlate("LVN 6982");

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

        Schedule s = scheduleService.saveSchedule(schedule);
        assert(s != null);
        assert(s.getLocation().equals("Baylor University"));
    }

    @Test
    void deleteSchedule() {
        System.out.println("Truck being deleted");
        scheduleService.deleteSchedule(scheduleID);
        assertThat(scheduleRepository.findById(scheduleID).isEmpty());
    }
}