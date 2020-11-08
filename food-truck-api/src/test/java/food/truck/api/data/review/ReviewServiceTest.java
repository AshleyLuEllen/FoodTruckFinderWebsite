package food.truck.api.data.review;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckRepository;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
public class ReviewServiceTest {

    private long [] reviewIDs = new long [4];

    private double average;

    private Truck truck;

    private User user;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private UserRepository userRepository;

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
        user1.setPassword("B0bRo5543vr");

        review1.setTruck(truck1);
        review1.setUser(user1);
        review1.setComment("COMMENT 1");
        review1.setRating((short)4.5);

        review2.setTruck(truck1);
        review2.setUser(user1);
        review2.setComment("COMMENT 2");
        review2.setRating((short)2);

        review3.setTruck(truck1);
        review3.setUser(user1);
        review3.setComment("COMMENT 3");
        review3.setRating((short)3);

        review4.setTruck(truck1);
        review4.setUser(user1);
        review4.setComment("COMMENT 4");
        review4.setRating((short)4);

        reviewIDs[0] = reviewRepository.save(review1).getId();
        reviewIDs[1] = reviewRepository.save(review2).getId();
        reviewIDs[2] = reviewRepository.save(review3).getId();
        reviewIDs[3] = reviewRepository.save(review4).getId();

        user1.setId(1l);
        truck1.setId(1l);
        truck = truck1;
        user = user1;
        average = (review1.rating + review2.rating + review3.rating + review4.rating) / 4.0;
    }

    @Test
    void findReviewById() {
        Optional<Review> temp = reviewService.findReviewById(reviewIDs[0]);
        assert(!temp.isEmpty());
        assertEquals("COMMENT 1", temp.get().getComment(), "Comments match");
    }

    @Test
    void saveReview() {
        Truck truck1 = new Truck();
        User user1 = new User();
        Review review1 = new Review();

        truck1.setOwner(user1);
        truck1.setName("Trucky");
        truck1.setDescription("Best truck ever");
        truck1.setLicensePlate("LVN 6982");
        truck1.setOwner(user1);

        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo5543vr");

        review1.setComment("COMMENT 1");
        review1.setRating((short)4.5);

        Review temp = reviewService.saveReview(review1, truck1, user1);

        assertEquals("Bob", temp.getUser().getFirstName());
        assertEquals("Trucky", temp.getTruck().getName());
    }

    @Test
    void createReview() {
        Truck truck1 = new Truck();
        User user1 = new User();
        Review review1 = new Review();

        truck1.setOwner(user1);
        truck1.setName("Trucky");
        truck1.setDescription("Best truck ever");
        truck1.setLicensePlate("LVN 6982");
        truck1.setOwner(user1);

        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo5543vr");

        review1.setComment("COMMENT 1");
        review1.setRating((short)4.5);

        Review temp = reviewService.createReview(review1, user1, truck1);

        assertEquals("Bob", temp.getUser().getFirstName());
        assertEquals("Trucky", temp.getTruck().getName());
    }

//    @Test
//    void getReviewsByTruck() {
//        truckRepository.save(truck);
//        List<Review> reviews = reviewRepository.findAllByTruck(truck);
//        assert(reviews.size() == 4);
//        System.out.println("REVIEW ID = " + reviews.get(0).getId() + " " + reviewIDs[0]);
//        System.out.println(reviews.get(1).getId() + " " + reviewIDs[1]);
//        System.out.println(reviews.get(2).getId() + " " + reviewIDs[2]);
//        System.out.println(reviews.get(3).getId() + " " + reviewIDs[3]);
//        long []tempIds = {reviews.get(0).getId(), reviews.get(1).getId(), reviews.get(2).getId(), reviews.get(3).getId()};
//        assertTrue(tempIds[0] == reviewIDs[0] && tempIds[1] == reviewIDs[1] && tempIds[2] == reviewIDs[2] && tempIds[3] == reviewIDs[3], "REVIEW ID = " + reviews.get(0).getId() + " " + reviewIDs[0]);
//    }

    @Test
    void deleteReview() {
        reviewService.deleteReview(reviewIDs[0]);
        assertTrue(reviewService.findReviewById(reviewIDs[0]).isEmpty());
    }

}
