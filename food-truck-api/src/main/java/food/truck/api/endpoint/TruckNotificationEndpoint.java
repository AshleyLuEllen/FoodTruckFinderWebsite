package food.truck.api.endpoint;

import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.truck_notification.TruckNotificationService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import food.truck.api.endpoint.error.BadRequestException;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
public class TruckNotificationEndpoint {
    @Autowired
    private UserService userService;

    @Autowired
    private TruckNotificationService truckNotificationService;

    @Autowired
    private TruckService truckService;

    @GetMapping("/trucks/{truckId}/notifications/{notificationId}")
    public TruckNotification findTruckNotification(@PathVariable Long notificationId, @PathVariable Long truckId) {
        Optional<TruckNotification> notOpt = truckNotificationService.findTruckNotification(notificationId);
        if(notOpt.isEmpty() || !notOpt.get().getTruck().getId().equals(truckId)) {
            throw new ResourceNotFoundException();
        }
        return notOpt.get();
    }

    @PatchMapping("/trucks/{truckId}/notifications/{notificationId}")
    public TruckNotification saveTruckNotification(Principal principal, @PathVariable Long notificationId, @RequestBody TruckNotification notification, @PathVariable Long truckId) {
        if (principal == null) {
            throw new UnauthorizedException();
        }

        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(UnauthorizedException::new);
        Truck truck = truckService.findTruck(truckId).orElseThrow(ResourceNotFoundException::new);

        if (!truck.getOwner().equals(user)){
            throw new UnauthorizedException();
        }

        TruckNotification dbNotification = truckNotificationService.findTruckNotification(notificationId).orElseThrow(ResourceNotFoundException::new);
        dbNotification.setSubject(notification.getSubject());
        dbNotification.setDescription(notification.getDescription());
        dbNotification.setPublished(notification.getPublished());

        return truckNotificationService.saveTruckNotification(dbNotification);
    }

    @PostMapping("/trucks/{truckId}/notifications")
    public TruckNotification createTruckNotification(Principal principal, @PathVariable Long truckId, @RequestBody TruckNotification truckNotification) {
        if (principal == null) {
            throw new UnauthorizedException();
        }

        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(UnauthorizedException::new);
        Truck truck = truckService.findTruck(truckId).orElseThrow(ResourceNotFoundException::new);

        if (!truck.getOwner().equals(user)){
            throw new UnauthorizedException();
        }

        return truckNotificationService.createTruckNotification(truckNotification, truck);
    }

    @DeleteMapping("/trucks/{truckId}/notifications/{notificationId}")
    public ResponseEntity<String> deleteTruckNotification(Principal principal, @PathVariable long notificationId, @PathVariable long truckId) {
        if (principal == null) {
            throw new UnauthorizedException();
        }

        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(UnauthorizedException::new);
        TruckNotification notification = truckNotificationService.findTruckNotification(notificationId).orElseThrow(UnauthorizedException::new);

        if (!user.getId().equals(notification.getTruck().getOwner().getId())) {
            throw new UnauthorizedException();
        }

        try {
            truckNotificationService.deleteTruckNotification(notification.getId());
        } catch (Exception e) {
            return new ResponseEntity<>("Fail to delete!", HttpStatus.EXPECTATION_FAILED);
        }

        return new ResponseEntity<>("Truck Notification has been deleted!", HttpStatus.OK);
    }

    @GetMapping("/trucks/{truckId}/notifications")
    public List<TruckNotification> findTruckOwnedNotifications(Principal principal, @PathVariable Long truckId) {
        if (principal == null) {
            throw new UnauthorizedException();
        }

        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(UnauthorizedException::new);
        Truck truck = truckService.findTruck(truckId).orElseThrow(ResourceNotFoundException::new);

        if (!truck.getOwner().equals(user)){
            throw new UnauthorizedException();
        }

        return truckNotificationService.getNotificationsOwnedByTruck(truck);
    }


}
