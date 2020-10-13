package food.truck.api.endpoint;

import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.endpoint.error.BadRequestException;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import lombok.extern.log4j.Log4j2;

import java.security.Principal;
import java.util.Optional;

@Log4j2
@RestController
public class ScheduleEndpoint {
    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private TruckService truckService;

    @Autowired
    private UserService userService;

    @PostMapping("/schedules")
    public Schedule createSchedule(Principal principal, @RequestBody Schedule schedule) {
        // Get the owner email
        if (principal == null) {
            throw new UnauthorizedException();
        }

        // Get me user
        Optional<User> meUser = userService.findUserByEmailAddress(principal.getName());
        if (meUser.isEmpty()) {
            throw new UnauthorizedException();
        }
        Optional<Truck> meTruck = truckService.findTruck(meUser.get().getId());

        return scheduleService.createSchedule(schedule, meTruck.get());
    }

    @GetMapping("/schedules/{id}")
    public Schedule findScheduleById(@PathVariable Long id) {
        return scheduleService.findSchedule(id).orElseThrow(ResourceNotFoundException::new);
    }

    @PutMapping("/schedules/{id}")
    public Schedule saveTruck(@PathVariable Long id, @RequestBody Schedule schedule) {
        if (!schedule.getId().equals(id)) {
            throw new BadRequestException("IDs do not match");
        }

        return scheduleService.saveSchedule(schedule);
    }
}
