package food.truck.api.endpoint;

import food.truck.api.data.review.Review;
import food.truck.api.data.review.ReviewService;
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

import java.security.Principal;
import java.util.List;
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

    @PostMapping("/reviews")
    public Review createReview(@RequestBody Review review) {
        return reviewService.createReview(review);
    }

    @GetMapping("/review/{reviewID}")
    public Review findReviewById(@PathVariable Long reviewID) {
        return reviewService.findReview(reviewID).orElseThrow(ResourceNotFoundException::new);
    }

    @PutMapping("/reviews/{reviewID}")
    public Review saveReview(@PathVariable Long reviewID, @RequestBody Review review) {
        if (!review.getId().equals(reviewID)) {
            throw new BadRequestException("IDs don't match");
        }

        return reviewService.saveReview(review);
    }

    @GetMapping("/trucks/{truckID}/reviews")
    public List<Review> findReviewsByTruck(@PathVariable Long truckID) {
        Optional<Truck> truck = truckService.findTruck(truckID);

        if(truck.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        return reviewService.getReviewsByTruck(truck.get());
    }

    @GetMapping("/users/{userID}/reviews")
    public List<Review> findReviewsByUser(@PathVariable Long userID) {
        Optional<User> user = userService.findUser(userID);

        if(user.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        return reviewService.getReviewsByUser(user.get());
    }
}
