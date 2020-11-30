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
        Truck truck = truckService.findTruck(truckID).orElseThrow(ResourceNotFoundException::new);

        // Get the associated User
        if (principal == null) {
            throw new UnauthorizedException();
        }

        log.info(principal.getName());
        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new);
        if (!Objects.equals(principal.getName(), user.getEmailAddress())) {
            throw new UnauthorizedException();
        }

        return reviewService.createReview(review, user, truck);
    }

    // Checked
    @GetMapping("/trucks/{truckID}/reviews")
    public List<Review> findReviewsByTruck(@PathVariable Long truckID) {
        Truck truck = truckService.findTruck(truckID).orElseThrow(ResourceNotFoundException::new);
        return reviewService.getReviewsByTruck(truck);
    }

    // Checked
    @GetMapping("/trucks/{truckID}/reviews/{reviewID}")
    public Review findReviewById(@PathVariable Long reviewID, @PathVariable Long truckID) {
        Review review = reviewService.findReviewById(reviewID).orElseThrow(ResourceNotFoundException::new);
        Truck truck = truckService.findTruck(truckID).orElseThrow(ResourceNotFoundException::new);

        // If the returned review doesn't match the truck provided
        if(!review.getTruck().getId().equals(truck.getId())) {
            throw new BadRequestException("Truck IDs don't match");
        }

        return review;
    }

    @GetMapping("/trucks/{truckID}/rating")
    public double getAverageReviewsByTruck(@PathVariable long truckID) {
        Truck truck = truckService.findTruck(truckID).orElseThrow(ResourceNotFoundException::new);
        return reviewService.getAverageReviewByTruckID(truck.getId());
    }

    /** User Reviews Endpoints **/
    // Checked
    @GetMapping("/users/{userID}/reviews")
    public List<Review> findReviewsByUser(@PathVariable Long userID) {
        User user = userService.findUser(userID).orElseThrow(ResourceNotFoundException::new);
        return reviewService.getReviewsByUser(user);
    }

    // Checked
    @GetMapping("/users/{userID}/reviews/{reviewID}")
    public Review findReviewByUser(@PathVariable Long userID, @PathVariable long reviewID) {
        Review review = reviewService.findReviewById(reviewID).orElseThrow(ResourceNotFoundException::new);
        User user = userService.findUser(userID).orElseThrow(ResourceNotFoundException::new);

        if (review.getId() != reviewID) {
            throw new BadRequestException("Review ID's don't match");
        }

        if (review.getUser().getId() != user.getId()){
            throw new BadRequestException("User ID's don't match");
        }

        return review;
    }
}
