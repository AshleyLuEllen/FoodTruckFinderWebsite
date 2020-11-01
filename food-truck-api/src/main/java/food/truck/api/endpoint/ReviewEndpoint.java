package food.truck.api.endpoint;

import food.truck.api.data.review.Review;
import food.truck.api.data.review.ReviewService;
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

import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Log4j2
@RestController
public class ReviewEndpoint {
    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserService userService;

    @Autowired
    private TruckService truckService;

    // Checked
    @PostMapping("/trucks/{truckID}/reviews")
    public Review createReview(Principal principal, @RequestBody Review review, @PathVariable long truckID) {
        // Get the associated Truck
        Optional<Truck> truck = truckService.findTruck(truckID);
        if(truck.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        // Get the associated User
        if (principal == null) {
            throw new UnauthorizedException();
        }
        log.info(principal.getName());
        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new);
        if (!Objects.equals(principal.getName(), user.getEmailAddress())) {
            throw new UnauthorizedException();
        }

        return reviewService.createReview(review, user, truck.get());
    }

    // Checked
    @GetMapping("/trucks/{truckID}/reviews")
    public List<Review> findReviewsByTruck(@PathVariable Long truckID) {
        Optional<Truck> truck = truckService.findTruck(truckID);

        if(truck.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        return reviewService.getReviewsByTruck(truck.get());
    }

    @GetMapping("/trucks/{truckID}/rating")
    public double getAverageReviewsByTruck(@PathVariable long truckID) {
        Optional<Truck> truck = truckService.findTruck(truckID);
        if(truck.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        return reviewService.getAverageReviewByTruckID(truckID);
    }

    // Checked
    @GetMapping("/trucks/{truckID}/reviews/{reviewID}")
    public Review findReviewById(@PathVariable Long reviewID, @PathVariable Long truckID) {
        Review rev = reviewService.findReviewById(reviewID).orElseThrow(ResourceNotFoundException::new);

        Optional<Truck> truck = truckService.findTruck(truckID);

        // If the returned review doesn't match the truck provided
        if(rev.getTruck().getId() != truck.get().getId()) {
            throw new BadRequestException("Truck IDs don't match");
        }

        return rev;
    }

    // Checked
    @PutMapping("/trucks/{truckID}/reviews/{reviewID}")
    public Review saveReview(Principal principal, @PathVariable Long reviewID, @PathVariable long truckID, @RequestBody Review review) {
        // If the review doesn't match the reviewID provided
        if (!review.getId().equals(reviewID)) {
            throw new BadRequestException("Review IDs don't match");
        }

        // Get the associated Truck
        Optional<Truck> truck = truckService.findTruck(truckID);
        if(truck.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        // Get the associated User
        if (principal == null) {
            throw new UnauthorizedException();
        }
        log.info(principal.getName());
        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new);
        if (!Objects.equals(principal.getName(), user.getEmailAddress())) {
            throw new UnauthorizedException();
        }

        Review rev = reviewService.saveReview(review, truck.get(), user);

        // If the review's truck id doesn't match the path variable
        if(rev.getTruck().getId() != truckID) {
            throw new BadRequestException("Truck ID's don't match");
        }

        return rev;
    }


    /** User Reviews Endpoints **/

    // Checked
    @GetMapping("/users/{userID}/reviews")
    public List<Review> findReviewsByUser(@PathVariable Long userID) {
        Optional<User> user = userService.findUser(userID);

        if(user.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        return reviewService.getReviewsByUser(user.get());
    }

    // Checked
    @GetMapping("/users/{userID}/reviews/{reviewID}")
    public Review findReviewByUser(@PathVariable Long userID, @PathVariable long reviewID) {
        Optional<Review> rev = reviewService.findReviewById(reviewID);
        if (rev.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        if (rev.get().getId() != reviewID) {
            throw new BadRequestException("Review ID's don't match");
        }

        return rev.get();
    }

    // Checked
    @DeleteMapping("/users/{userID}/reviews/{reviewID}")
    public ResponseEntity<String> deleteReviewByUser(Principal principal, @PathVariable Long userID, @PathVariable long reviewID) {
        // Get the owner email
        if (principal == null) {
            throw new UnauthorizedException();
        }

        // Get me user
        Optional<User> meUser = userService.findUserByEmailAddress(principal.getName());
        if (meUser.isEmpty()) {
            throw new UnauthorizedException();
        }

        try {
            reviewService.deleteReview(reviewID);
        } catch (Exception e) {
            return new ResponseEntity<>("Fail to delete!", HttpStatus.EXPECTATION_FAILED);
        }

        return new ResponseEntity<>("Review has been deleted!", HttpStatus.OK);
    }
}
