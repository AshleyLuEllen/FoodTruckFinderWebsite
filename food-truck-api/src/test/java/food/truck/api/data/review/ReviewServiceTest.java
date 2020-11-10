package food.truck.api.data.review;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckRepository;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserRepository;
import food.truck.api.data.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
public class ReviewServiceTest {

    private long [] reviewIDs = new long [4];

    private Review [] theReviews = new Review[4];

    private double average;

    private Truck truck;

    private User user;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private TruckService truckService;

    @Autowired
    private UserService userService;

    @BeforeEach
    void setup() {
        Truck truck1 = new Truck();
        User user1 = new User();
        Review review1 = new Review();
        Review review2 = new Review();
        Review review3 = new Review();
        Review review4 = new Review();

        truck1.setOwner(user1);
        truck1.setName("Harry");
        truck1.setDescription("Best truck ever");
        truck1.setLicensePlate("LVN 6982");
        truck1.setOwner(user1);

        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo$$43vr");

        user = userService.createUser(user1);
        truck = truckService.createTruck(truck1, user1);

        review1.setComment("COMMENT 1");
        review1.setRating(4.5);

        review2.setComment("COMMENT 2");
        review2.setRating(2.0);

        review3.setComment("COMMENT 3");
        review3.setRating(3.0);

        review4.setComment("COMMENT 4");
        review4.setRating(4.0);

        theReviews[0] = reviewService.saveReview(review1, truck, user);
        theReviews[1] = reviewService.saveReview(review2, truck, user);
        theReviews[2] = reviewService.saveReview(review3, truck, user);
        theReviews[3] = reviewService.saveReview(review4, truck, user);

        reviewIDs[0] = theReviews[0].getId();
        reviewIDs[1] = theReviews[1].getId();
        reviewIDs[2] = theReviews[2].getId();
        reviewIDs[3] = theReviews[3].getId();

        average = (theReviews[0].rating + theReviews[1].rating + theReviews[2].rating + theReviews[3].rating) / 4.0;
    }

    @Test
    void testFindReviewById() {
        Optional<Review> temp = reviewService.findReviewById(reviewIDs[0]);
        assertFalse(temp.isEmpty());
        assertEquals("COMMENT 1", temp.get().getComment(), "Comments match");
    }

    @Test
    void testCreateReview() {
        Review fresh = new Review();
        fresh.setComment("COMMENT 7");
        fresh.setRating(4.5);

        Review temp = reviewService.createReview(fresh, user, truck);

        assertEquals("Bob", temp.getUser().getFirstName());
        assertEquals("COMMENT 7", temp.getComment());
    }

    @Test
    void testGetReviewsByTruck() {
        truckService.saveTruck(truck);
        List<Review> reviews = reviewService.getReviewsByTruck(truck);
        assertArrayEquals(theReviews, reviews.toArray());
        assertTrue(reviews.size() == 4);
    }

    @Test
    void testDeleteReview() {
        reviewService.deleteReview(reviewIDs[0]);
        assertTrue(reviewService.findReviewById(reviewIDs[0]).isEmpty());
    }
}
