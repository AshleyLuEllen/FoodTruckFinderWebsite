package food.truck.api.endpoint;

import food.truck.api.client.AmazonClient;
import food.truck.api.data.media.Media;
import food.truck.api.data.media.MediaService;
import food.truck.api.data.review.Review;
import food.truck.api.data.review.ReviewService;
import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.subscription.Subscription;
import food.truck.api.data.subscription.SubscriptionService;
import food.truck.api.data.tag.Tag;
import food.truck.api.data.tag.TagService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.truck_notification.TruckNotificationService;
import food.truck.api.data.truck_tag.TruckTag;
import food.truck.api.data.truck_tag.TruckTagRepository;
import food.truck.api.data.truck_tag.TruckTagService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import food.truck.api.data.user_notification.UserNotification;
import food.truck.api.data.user_notification.UserNotificationService;
import food.truck.api.endpoint.error.BadRequestException;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import food.truck.api.util.UnreadSavedPatch;
import lombok.Data;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@RestController
public class TruckEndpoint {
    @Autowired
    private TruckService truckService;

    @Autowired
    private UserService userService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private TruckNotificationService truckNotificationService;

    @Autowired
    private MediaService mediaService;

    @Autowired
    private AmazonClient amazonClient;

    @Autowired
    private UserNotificationService userNotificationService;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private TruckTagService truckTagService;

    @Autowired
    private TagService tagService;

    @DeleteMapping("/trucks/{truckid}")
    public ResponseEntity<String> deleteTruck(Principal principal, @PathVariable long truckid) {
        // Get the owner email
        if (principal == null) {
            throw new UnauthorizedException();
        }

        Truck truck = truckService.findTruck(truckid).orElseThrow(ResourceNotFoundException::new);

        // Get me user
        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(UnauthorizedException::new);

        if (!user.getId().equals(truck.getOwner().getId())) {
            throw new UnauthorizedException();
        }

        List<Review> reviews = reviewService.getReviewsByTruck(truck);
        log.info("Deleting " + reviews.size() + " reviews");
        for(Review r : reviews) {
            reviewService.deleteReview(r.getId());
        }
        log.info("Deleted reviews");

        List<TruckNotification> notifs = truckNotificationService.getNotificationsOwnedByTruck(truck);
        log.info("Deleting " + notifs.size() + " truck notifications");
        for(TruckNotification not : notifs) {
            userNotificationService.deleteNotification(not);

            this.amazonClient.deleteNotificationMedia(not);

            log.info("ID = " + not.getId());
            truckNotificationService.deleteById(not.getId());
        }

        notifs = truckNotificationService.getAllNotificationsByTruck(truck);
        log.info("Deleting " + notifs.size() + " user notifications");
        for(TruckNotification not : notifs) {
            log.info("ID = " + not.getId());
            userNotificationService.deleteNotification(not);

                this.amazonClient.deleteNotificationMedia(not);

            truckNotificationService.deleteById(not.getId());
        }

        log.info("Deleted Notifications");

        List<Tag> tags = truckTagService.findTruckTags(truck);
        log.info("Deleting " + tags.size() + " truck tags");
        for(Tag t: tags) {
            truckTagService.deleteTruckTag(truck, t);
        }
        log.info("Deleted tags");

        this.amazonClient.deleteMenu(truck);

        List<Schedule> schedules = scheduleService.findSchedulesOfTruck(truck);
        log.info("Deleting " + schedules.size() + " schedules");
        for(Schedule s : schedules) {
            scheduleService.deleteSchedule(s.getId());
        }
        log.info("Deleted schedules");

        List<User> subscriptions = subscriptionService.findTruckSubscriptions(truck);
        log.info("Deleting " + subscriptions.size() + " subs");
        for(User u : subscriptions) {
            subscriptionService.deleteUserSubscription(u, truck);
        }
        log.info("Deleted subscriptions");

        try {
            truckService.deleteTruck(truckid);
            log.info("Deleted truck!!!!");
        } catch (Exception e) {
            return new ResponseEntity<>("Fail to delete: " + e.getMessage(), HttpStatus.EXPECTATION_FAILED);
        }

        return new ResponseEntity<>("Truck has been deleted!", HttpStatus.OK);
    }

    @PostMapping("/trucks")
    public Truck createTruck(Principal principal, @RequestBody Truck truck) {
        // Get the owner email
        if (principal == null) {
            throw new UnauthorizedException();
        }

        // Get me user
        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(UnauthorizedException::new);
        return truckService.createTruck(truck, user);
    }

    @GetMapping("/trucks/{id}")
    public Truck findTruckById(@PathVariable Long id) {
        return truckService.findTruck(id).orElseThrow(ResourceNotFoundException::new);
    }

    @PatchMapping("/trucks/{id}")
    public Truck editTruck(Principal principal, @PathVariable Long id, @RequestBody Truck truck) {
        Truck dbTruck = truckService.findTruck(id).orElseThrow(ResourceNotFoundException::new);

        // Get the owner email
        if (principal == null) {
            throw new UnauthorizedException();
        }

        // Get me user
        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(UnauthorizedException::new);
        if (!Objects.equals(dbTruck.getOwner().getId(), user.getId())) {
            throw new UnauthorizedException();
        }

        if (!truck.getId().equals(id)) {
            throw new BadRequestException("IDs don't match");
        }

        dbTruck.setName(truck.getName());
        dbTruck.setDescription(truck.getDescription());
        dbTruck.setLicensePlate(truck.getLicensePlate());

        return truckService.saveTruck(dbTruck);
    }

    @Data
    static class TagList {
        List<Long> tags;
    }

    @PutMapping("/trucks/{id}/tags")
    public Truck editTruckTags(Principal principal, @PathVariable Long id, @RequestBody TagList tags) {
        Truck dbTruck = truckService.findTruck(id).orElseThrow(ResourceNotFoundException::new);

        // Get the owner email
        if (principal == null) {
            throw new UnauthorizedException();
        }

        // Get me user
        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(UnauthorizedException::new);
        if (!Objects.equals(dbTruck.getOwner().getId(), user.getId())) {
            throw new UnauthorizedException();
        }

        truckTagService.deleteAll(dbTruck);
        truckTagService.addAllTruckTags(dbTruck, tags.tags.stream().map(tid -> tagService.findTag(tid).orElse(null)).filter(Objects::nonNull).collect(Collectors.toList()));

        return truckService.saveTruck(dbTruck);
    }

    @GetMapping("/users/{userID}/trucks")
    public List<Truck> findUserOwnedTrucks(@PathVariable Long userID) {
        User user = userService.findUser(userID).orElseThrow(ResourceNotFoundException::new);
        return truckService.getTrucksOwnedByUser(user);
    }

    @GetMapping("/users/{userID}/trucks/{truckid}")
    public Truck changeTruckOwner(Principal principal, @PathVariable Long userID, @PathVariable Long truckid, @RequestBody Long newOwnerid) {
        if (principal == null) {
            throw new UnauthorizedException();
        }
        User puser = userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new);
        User user = userService.findUser(userID).orElseThrow(ResourceNotFoundException::new);
        if (!puser.equals(user)){
            throw new UnauthorizedException();
        }

        Truck truck = truckService.findTruck(truckid).orElseThrow(ResourceNotFoundException::new);
        if (!truck.getOwner().equals(user)){
            throw new UnauthorizedException();
        }
        User newOwner = userService.findUser(newOwnerid).orElseThrow(ResourceNotFoundException::new);
        if (user.equals(newOwner)){
            throw new BadRequestException("User and new owner are the same");
        }

        return truckService.changeOwner(truck, user);
    }

    @GetMapping("/trucks/{truckId}/subscriptions")
    public List<User> findTruckSubscriptions(@PathVariable Long truckId) {
        Truck truck = truckService.findTruck(truckId).orElseThrow(ResourceNotFoundException::new);

        return subscriptionService.findTruckSubscriptions(truck);
    }
}
