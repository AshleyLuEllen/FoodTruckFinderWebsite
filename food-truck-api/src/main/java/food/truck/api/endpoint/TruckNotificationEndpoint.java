package food.truck.api.endpoint;

import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.truck_notification.TruckNotificationService;
import food.truck.api.endpoint.error.BadRequestException;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import lombok.extern.log4j.Log4j2;

import javax.swing.text.html.Option;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
public class TruckNotificationEndpoint {
    @Autowired
    private TruckNotificationService truckNotificationService;

    @Autowired
    private TruckService truckService;

    @GetMapping("/trucks_notifications/{notification_id}")
    public TruckNotification findTruckNotification(@PathVariable Long notification_id) {
        return truckNotificationService.findTruckNotification(notification_id).orElseThrow(ResourceNotFoundException::new);
    }

    @PutMapping("/trucks_notifications/{notification_id}")
    public TruckNotification saveTruckNotification(@PathVariable Long notification_id, @RequestBody TruckNotification notification) {
        if (!notification.getId().equals(notification_id)) {
            throw new BadRequestException("IDs don't match");
        }

        return truckNotificationService.saveTruckNotification(notification);
    }

    @PostMapping("/trucks_notifications")
    public TruckNotification createTruckNotification(Truck truck, @RequestBody TruckNotification truckNotification) {
        if (truck == null) {
            throw new UnauthorizedException();
        }

        Optional<Truck> meTruck = truckService.findTruck(truck.getId());
        if (meTruck.isEmpty()) {
            throw new UnauthorizedException();
        }

        return truckNotificationService.createTruckNotification(truckNotification, meTruck.get());
    }

}
