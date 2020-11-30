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
        Truck truck = truckService.findTruck(id).orElseThrow(ResourceNotFoundException::new);
        return scheduleService.findSchedulesOfTruck(truck);
    }

    @PostMapping("/trucks/{id}/schedules")
    public Schedule createSchedule(Principal principal, @PathVariable Long id, @RequestBody Schedule schedule) {
        if (principal == null) {
            throw new UnauthorizedException();
        }

        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(UnauthorizedException::new);

        Truck truck = truckService.findTruck(id).orElseThrow(ResourceNotFoundException::new);

        if (!truck.getOwner().equals(user)){
            throw new UnauthorizedException();
        }

        Location location = googleApiService.getLocationFromPlaceId(schedule.getPlaceId());
//        schedule.setLocation(location.getName());
        schedule.setLatitude(location.getLatitude());
        schedule.setLongitude(location.getLongitude());

        return scheduleService.createSchedule(schedule, truck);
    }

    @GetMapping("/trucks/{truckId}/schedules/{scheduleId}")
    public Schedule findScheduleById(@PathVariable Long truckId, @PathVariable Long scheduleId) {
        Schedule schedule = scheduleService.findSchedule(scheduleId).orElseThrow(ResourceNotFoundException::new);
        Truck truck = truckService.findTruck(truckId).orElseThrow(ResourceNotFoundException::new);

        if (!truck.equals(schedule.getTruck())){
            throw new BadRequestException("Trucks do not match");
        }

        return schedule;
    }

    @PatchMapping("/trucks/{truckId}/schedules/{scheduleId}")
    public Schedule saveTruckSchedule(Principal principal, @PathVariable Long truckId, @PathVariable Long scheduleId, @RequestBody Schedule newSchedule){
        if (principal == null) {
            throw new UnauthorizedException();
        }

        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(UnauthorizedException::new);
        Schedule schedule = scheduleService.findSchedule(scheduleId).orElseThrow(ResourceNotFoundException::new);
        Truck truck = truckService.findTruck(truckId).orElseThrow(ResourceNotFoundException::new);

        if (!truck.getOwner().equals(user)){
            throw new UnauthorizedException();
        }

        if (!truck.equals(schedule.getTruck())){
            throw new BadRequestException("Trucks do not match");
        }

        if (!newSchedule.getId().equals(scheduleId)) {
            throw new BadRequestException("IDs do not match");
        }

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
    public void deleteScheduleById(Principal principal, @PathVariable Long truckId, @PathVariable Long scheduleId) {
        if (principal == null) {
            throw new UnauthorizedException();
        }

        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(UnauthorizedException::new);
        Schedule schedule = scheduleService.findSchedule(scheduleId).orElseThrow(ResourceNotFoundException::new);
        Truck truck = truckService.findTruck(truckId).orElseThrow(ResourceNotFoundException::new);

        if (!truck.getOwner().equals(user)){
            throw new UnauthorizedException();
        }

        if (!truck.equals(schedule.getTruck())){
            throw new BadRequestException("Trucks do not match");
        }

        scheduleService.deleteSchedule(scheduleId);
    }
}
