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
import static org.junit.jupiter.api.Assertions.*;

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

    private Truck truck;
    private Schedule schedule;

    @BeforeEach
    void setup() {
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo5543vr");

        truck = new Truck();
        truck.setName("Harry");
        truck.setDescription("Best truck ever");
        truck.setLicensePlate("LVN 6982");
        truck.setOwner(user1);

        schedule = new Schedule();
        schedule.setLatitude(31.5489);
        schedule.setLongitude(97.1131);
        schedule.setLocation("Baylor University");
        ZoneId zoneId = ZoneId.of("UTC-6");
        ZonedDateTime timeFrom = ZonedDateTime.of(2020, 12, 1, 10, 30, 00, 00, zoneId );
        schedule.setTimeFrom(timeFrom);
        ZonedDateTime timeTo = ZonedDateTime.of(2020, 12, 1, 4, 30, 00, 00, zoneId );
        schedule.setTimeTo(timeTo);
        schedule.setTruck(truck);
        scheduleService.createSchedule(schedule, truck);
    }

    @Test
    void findSchedule() {
        Optional<Schedule> found = scheduleService.findSchedule(schedule.getId());
        assert(found.isPresent());
        assertEquals(31.5489, found.get().getLatitude());
        assertEquals(97.1131, found.get().getLongitude());
        assertEquals("Baylor University", found.get().getLocation());
    }

    @Test
    void createSchedule() {
        Schedule s = new Schedule();
        s.setLatitude(31.5489);
        s.setLongitude(97.1131);
        s.setLocation("Baylor University");
        ZoneId zoneId = ZoneId.of("UTC-6");
        ZonedDateTime timeFrom = ZonedDateTime.of(2020, 12, 1, 10, 30, 00, 00, zoneId );
        s.setTimeFrom(timeFrom);
        ZonedDateTime timeTo = ZonedDateTime.of(2020, 12, 1, 4, 30, 00, 00, zoneId );
        s.setTimeTo(timeTo);
        s.setTruck(truck);
        Schedule s1 = scheduleService.createSchedule(schedule, truck);
        assertEquals(31.5489, s1.getLatitude());
        assertEquals(97.1131, s1.getLongitude());
        assertEquals("Baylor University", s1.getLocation());
    }

    @Test
    void saveSchedule() {
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
        assertNotNull(s);
        assertEquals(31.5489, s.getLatitude());
        assertEquals(97.1131, s.getLongitude());
        assertEquals("Baylor University", s.getLocation());
    }

    @Test
    void deleteSchedule() {
        scheduleService.deleteSchedule(schedule.getId());
        assertTrue(scheduleService.findSchedule(schedule.getId()).isEmpty());
    }
}