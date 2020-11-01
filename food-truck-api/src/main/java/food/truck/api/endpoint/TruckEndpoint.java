package food.truck.api.endpoint;

import food.truck.api.data.review.Review;
import food.truck.api.data.review.ReviewService;
import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
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
public class TruckEndpoint {
    @Autowired
    private TruckService truckService;

    @Autowired
    private UserService userService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ScheduleService scheduleService;

    @DeleteMapping("/trucks/{id}")
    public ResponseEntity<String> deleteTruck(Principal principal, @PathVariable long id) {
        // Get the owner email
        if (principal == null) {
            throw new UnauthorizedException();
        }

        List<Review> reviews = reviewService.getReviewsByTruck(truckService.findTruck(id).get());
        for(Review r : reviews) {
            reviewService.deleteReview(r.getId());
        }

        // Get me user
        Optional<User> meUser = userService.findUserByEmailAddress(principal.getName());
        if (meUser.isEmpty()) {
            throw new UnauthorizedException();
        }

        try {
            truckService.deleteTruck(id);
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
        Optional<User> meUser = userService.findUserByEmailAddress(principal.getName());
        if (meUser.isEmpty()) {
            throw new UnauthorizedException();
        }

        return truckService.createTruck(truck, meUser.get());
    }

    @GetMapping("/trucks/{id}")
    public Truck findTruckById(@PathVariable Long id) {
        return truckService.findTruck(id).orElseThrow(ResourceNotFoundException::new);
    }

    @PutMapping("/trucks/{id}")
    public Truck saveTruck(@PathVariable Long id, @RequestBody Truck truck) {
        if (!truck.getId().equals(id)) {
            throw new BadRequestException("IDs don't match");
        }

        return truckService.saveTruck(truck);
    }

    @GetMapping("/users/{userID}/trucks")
    public List<Truck> findUserOwnedTrucks(@PathVariable Long userID) {
        Optional<User> user = userService.findUser(userID);

        if (user.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        return truckService.getTrucksOwnedByUser(user.get());
    }
}
