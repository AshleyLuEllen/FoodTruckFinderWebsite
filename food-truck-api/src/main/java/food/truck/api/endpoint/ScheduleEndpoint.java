package food.truck.api.endpoint;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.endpoint.error.BadRequestException;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import food.truck.api.util.GoogleApiService;
import food.truck.api.util.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import lombok.extern.log4j.Log4j2;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
public class ScheduleEndpoint {
    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private TruckService truckService;

    @Autowired
    private GoogleApiService googleApiService;

    @Autowired
    private UserService userService;

    @GetMapping("/trucks/{id}/schedules")
    public List<Schedule> getAllSchedules(@PathVariable Long id) {
        Optional<Truck> truck = truckService.findTruck(id);

        if (truck.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        return scheduleService.findSchedulesOfTruck(truck.get());
    }

    @PostMapping("/trucks/{id}/schedules")
    public Schedule createSchedule(@PathVariable Long id, @RequestBody Schedule schedule) {
//        // Get the owner email
//        if (principal == null) {
//            throw new UnauthorizedException();
//        }

//        // Get me user
//        Optional<User> meUser = userService.findUserByEmailAddress(principal.getName());
//        if (meUser.isEmpty()) {
//            throw new UnauthorizedException();
//        }
//        Optional<Truck> meTruck = truckService.findTruck(meUser.get().getId());

        Optional<Truck> truck = truckService.findTruck(id);

        if (truck.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        Location location = googleApiService.getLocationFromPlaceId(schedule.getPlaceId());
//        schedule.setLocation(location.getName());
        schedule.setLatitude(location.getLatitude());
        schedule.setLongitude(location.getLongitude());

        return scheduleService.createSchedule(schedule, truck.get());
    }

    @GetMapping("/trucks/{truckId}/schedules/{scheduleId}")
    public Schedule findScheduleById(@PathVariable Long truckId, @PathVariable Long scheduleId) {
        return scheduleService.findSchedule(scheduleId).orElseThrow(ResourceNotFoundException::new);
    }

    @PatchMapping("/trucks/{truckId}/schedules/{scheduleId}")
    public Schedule saveTruckSchedule(@PathVariable Long truckId, @PathVariable Long scheduleId, @RequestBody Schedule newSchedule) {
        if (!newSchedule.getId().equals(scheduleId)) {
            throw new BadRequestException("IDs do not match");
        }

        Optional<Schedule> scheduleOpt = scheduleService.findSchedule(scheduleId);
        if (scheduleOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }
        Schedule schedule = scheduleOpt.get();
        schedule.setTimeTo(newSchedule.getTimeTo());
        schedule.setTimeFrom(newSchedule.getTimeFrom());
        if (newSchedule.getPlaceId() != null) {
            Location location = googleApiService.getLocationFromPlaceId(newSchedule.getPlaceId());
            schedule.setLocation(newSchedule.getLocation());
            schedule.setLatitude(location.getLatitude());
            schedule.setLongitude(location.getLongitude());
        }

        return scheduleService.saveSchedule(schedule);
    }

    @DeleteMapping("/trucks/{truckId}/schedules/{scheduleId}")
    public void deleteScheduleById(@PathVariable Long truckId, @PathVariable Long scheduleId) {
        scheduleService.deleteSchedule(scheduleId);
    }
}
