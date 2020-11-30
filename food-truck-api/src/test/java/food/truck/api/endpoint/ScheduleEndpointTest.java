//package food.truck.api.endpoint;
//
//import food.truck.api.data.schedule.Schedule;
//import food.truck.api.data.schedule.ScheduleRepository;
//import food.truck.api.data.schedule.ScheduleService;
//import food.truck.api.data.truck.Truck;
//import food.truck.api.data.truck.TruckRepository;
//import food.truck.api.data.truck.TruckService;
//import food.truck.api.data.user.User;
//import food.truck.api.data.user.UserService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.transaction.annotation.Transactional;
//import java.security.Principal;
//import java.time.ZoneId;
//import java.time.ZonedDateTime;
//import java.util.Optional;
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest
//@AutoConfigureTestDatabase
//@Transactional
//class ScheduleEndpointTest {
//    @Autowired
//    private ScheduleEndpoint scheduleEndpoint;
//
//    @Autowired
//    private ScheduleService scheduleService;
//
//    @Autowired
//    private TruckService truckService;
//
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private AuthEndpoint authEndpoint;
//
//    private Truck truck;
//    private Schedule schedule;
//    private User user1;

//    @BeforeEach
//    void setup(){
//        user1 = new User();
//        user1.setFirstName("Bob");
//        user1.setLastName("Ross");
//        user1.setEmailAddress("bob.ross@example.com");
//        user1.setPassword("#B0bRo5543vr");
//        userService.createUser(user1);
//
//        truck = new Truck();
//        truck.setName("Harry");
//        truck.setDescription("Best truck ever");
//        truck.setLicensePlate("LVN 6982");
//        truck.setOwner(user1);
//        truckService.createTruck(truck, user1);
//
//        schedule = new Schedule();
//        schedule.setLatitude(31.5489);
//        schedule.setLongitude(97.1131);
//        schedule.setLocation("Baylor University");
//        ZoneId zoneId = ZoneId.of("UTC-6");
//        ZonedDateTime timeFrom = ZonedDateTime.of(2020, 12, 1, 10, 30, 00, 00, zoneId );
//        schedule.setTimeFrom(timeFrom);
//        ZonedDateTime timeTo = ZonedDateTime.of(2020, 12, 1, 4, 30, 00, 00, zoneId );
//        schedule.setTimeTo(timeTo);
//        schedule.setTruck(truck);
//        scheduleService.createSchedule(schedule, truck);
//    }
//
//    @Test
//    void findScheduleById() {
//        Optional<Schedule> found = Optional.ofNullable(scheduleEndpoint.findScheduleById(truck.getId(), schedule.getId()));
//        assertTrue(found.isPresent());
//        assertEquals(schedule.getId(), found.get().getId());
//    }

//    @Test
//    void createSchedule() {
//        Principal p = new Principal() {
//            @Override
//            public String getName() {
//                return user1.getEmailAddress();
//            }
//        };
//
//        authEndpoint.authenticate();
//        Schedule f = scheduleEndpoint.createSchedule(truck.getId(), schedule);
//
//        assertEquals(user1, f.getTruck().getOwner());
//    }

//    @Test
//    void saveTruck() {
//        schedule.setTruck(truck);
//        schedule.setLatitude(31.5489);
//        schedule.setLongitude(97.1131);
//        schedule.setLocation("Baylor University");
//        ZoneId zoneId = ZoneId.of("UTC-6");
//        ZonedDateTime timeFrom = ZonedDateTime.of(2020, 12, 1, 10, 30, 00, 00, zoneId );
//        schedule.setTimeFrom(timeFrom);
//        ZonedDateTime timeTo = ZonedDateTime.of(2020, 12, 1, 4, 30, 00, 00, zoneId );
//        schedule.setTimeTo(timeTo);
//
//        Schedule s2 = scheduleEndpoint.saveTruckSchedule(truck.getId(), schedule.getId(), schedule);
//
//        assertEquals(schedule.getId(), s2.getId());
//        assertEquals(schedule.getTruck().getName(), s2.getTruck().getName());
//    }
//
//    @Test
//    void deleteScheduleById() {
//        scheduleEndpoint.deleteScheduleById(truck.getId(), schedule.getId());
//        assertTrue(scheduleService.findSchedule(schedule.getId()).isEmpty());
//    }
//}