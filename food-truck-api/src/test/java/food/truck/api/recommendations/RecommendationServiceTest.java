package food.truck.api.recommendations;

import food.truck.api.data.review.Review;
import food.truck.api.data.review.ReviewService;
import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.schedule.ScheduleRepository;
import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.subscription.SubscriptionService;
import food.truck.api.data.tag.Tag;
import food.truck.api.data.tag.TagRepository;
import food.truck.api.data.tag.TagService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.truck_tag.TruckTagService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserRepository;
import food.truck.api.data.user.UserService;
import food.truck.api.util.Location;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
@Log4j2
class RecommendationServiceTest {
    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private TruckTagService truckTagService;

    @Autowired
    private TagService tagService;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private TruckService truckService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private ReviewService reviewService;

    private User owner;
    private Tag tagA;
    private Tag tagB;
    private Tag tagC;

    @BeforeEach
    private void setupRecommendationTest() {
        // Test user
        User testUser = new User();
        testUser.setPassword("B@yl0rR0cks!");
        testUser.setFirstName("Bobby");
        testUser.setLastName("Baylor");
        testUser.setEmailAddress("Bobby_Baylor@baylor.edu");
        testUser.setSinceTime(ZonedDateTime.now());
        testUser.setLongitude(0.0);
        testUser.setLatitude(0.0);
        final long userId = this.userService.createUser(testUser).getId();
        log.info("Created test user");

        // Test tags
        Tag tagA = new Tag();
        tagA.setName("Tag A");
        tagA.setDescription("Desc A");
        final long tagAId = this.tagService.createTag(tagA).getId();
        log.info("Created tag A");

        Tag tagB = new Tag();
        tagB.setName("Tag B");
        tagB.setDescription("Desc B");
        final long tagBId = this.tagService.createTag(tagB).getId();
        log.info("Created tag B");

        Tag tagC = new Tag();
        tagC.setName("Tag C");
        tagC.setDescription("Desc C");
        final long tagCId = this.tagService.createTag(tagC).getId();
        log.info("Created tag C");

        // Get DAO objects
        Optional<User> ownerOpt = this.userService.findUser(userId);
        assertTrue(ownerOpt.isPresent());
        this.owner = ownerOpt.get();

        Optional<Tag> tagAOpt = this.tagService.findTag(tagAId);
        assertTrue(tagAOpt.isPresent());
        this.tagA = tagAOpt.get();

        Optional<Tag> tagBOpt = this.tagService.findTag(tagBId);
        assertTrue(tagBOpt.isPresent());
        this.tagB = tagBOpt.get();

        Optional<Tag> tagCOpt = this.tagService.findTag(tagCId);
        assertTrue(tagCOpt.isPresent());
        this.tagC = tagCOpt.get();
    }

    @AfterEach
    private void cleanUpRecommendationTest() {
        this.userRepository.deleteAll();
        this.tagRepository.deleteAll();
    }

    private Schedule createTestSchedule() {
        Schedule testSchedule = new Schedule();
        testSchedule.setLatitude(0.0);
        testSchedule.setLongitude(0.0);
        testSchedule.setLocation("Location 1");
        testSchedule.setTimeFrom(ZonedDateTime.now().minusDays(1));
        testSchedule.setTimeTo(ZonedDateTime.now().plusDays(1));
        return testSchedule;
    }

    private Schedule createFurtherTestSchedule() {
        Schedule testSchedule = new Schedule();
        testSchedule.setLatitude(0.0);
        testSchedule.setLongitude(0.01);
        testSchedule.setLocation("Location 2");
        testSchedule.setTimeFrom(ZonedDateTime.now().minusDays(1));
        testSchedule.setTimeTo(ZonedDateTime.now().plusDays(1));
        return testSchedule;
    }

    private Schedule createTooFarTestSchedule() {
        Schedule testSchedule = new Schedule();
        testSchedule.setLatitude(0.0);
        testSchedule.setLongitude(1.0);
        testSchedule.setLocation("Location 3");
        testSchedule.setTimeFrom(ZonedDateTime.now().minusDays(1));
        testSchedule.setTimeTo(ZonedDateTime.now().plusDays(1));
        return testSchedule;
    }

    private Review createHighReview() {
        Review review = new Review();
        review.setRating(4.0);
        return review;
    }

    private Review createLowReview() {
        Review review = new Review();
        review.setRating(2.0);
        return review;
    }

    @Test
    public void testRecommendationsLocation() {
        int numTrucks = 0;

        // Create close truck
        Truck closeTruck = new Truck();
        closeTruck.setName("Close Truck");
        closeTruck.setDescription("This is the truck that is close.");
        final long closeTruckId = this.truckService.createTruck(closeTruck, this.owner).getId();
        this.scheduleService.createSchedule(this.createTestSchedule(), closeTruck);
        ++numTrucks;
        log.info("Created close truck");

        // Create far truck
        Truck farTruck = new Truck();
        farTruck.setName("Far Truck");
        farTruck.setDescription("This is the truck that is far.");
        final long farTruckId = this.truckService.createTruck(farTruck, this.owner).getId();
        this.scheduleService.createSchedule(this.createFurtherTestSchedule(), farTruck);
        ++numTrucks;
        log.info("Created far truck");

        // Create further truck
        Truck furtherTruck = new Truck();
        furtherTruck.setName("Further Truck");
        furtherTruck.setDescription("This is the truck that is further.");
        final long furtherTruckId = this.truckService.createTruck(furtherTruck, this.owner).getId();
        this.scheduleService.createSchedule(this.createTooFarTestSchedule(), furtherTruck);
        ++numTrucks;
        log.info("Created further truck");

        // Ensure that trucks were created
        assertEquals(numTrucks, this.truckService.findAll().size());

        // Ensure that all schedules were created
        assertEquals(numTrucks, this.scheduleRepository.findAll().size());

        // Get list of applicable trucks
        List<Truck> subscribedTrucks = this.subscriptionService.findUserSubscriptions(this.owner);

        // Get recommendations
        List<Truck> recommendationsWithoutSubscriptions = this.recommendationService.getRecommendations(subscribedTrucks, Location.fromUser(this.owner), false, 5);
        assertArrayEquals(Stream.of(new Truck[] {
            closeTruck,
            farTruck
        }).map(Truck::getName).toArray(), recommendationsWithoutSubscriptions.stream().map(Truck::getName).toArray());
    }


    @Test
    public void testRecommendationsRating() {
        int numTrucks = 0;

        // Create no rating truck
        Truck noRatingTruck = new Truck();
        noRatingTruck.setName("No Rating Truck");
        noRatingTruck.setDescription("This is the truck with no rating.");
        final long noRatingTruckId = this.truckService.createTruck(noRatingTruck, this.owner).getId();
        this.scheduleService.createSchedule(this.createTestSchedule(), noRatingTruck);
        ++numTrucks;
        assertDoesNotThrow(() -> assertNull(this.truckService.findTruck(noRatingTruckId).get().getRating()));
        log.info("Created no rating truck");

        // Create high rating Truck
        Truck highRatingTruck = new Truck();
        highRatingTruck.setName("High Rating Truck");
        highRatingTruck.setDescription("This is the truck with a high rating.");
        final long highRatingTruckId = this.truckService.createTruck(highRatingTruck, this.owner).getId();
        this.scheduleService.createSchedule(this.createTestSchedule(), highRatingTruck);
        this.reviewService.createReview(this.createHighReview(), this.owner, highRatingTruck);
        ++numTrucks;
        assertDoesNotThrow(() -> assertEquals(4.0, this.reviewService.getAverageReviewByTruckID(highRatingTruckId), 0.1));
        log.info("Created high rating truck");

        // Create low rating Truck
        Truck lowRatingTruck = new Truck();
        lowRatingTruck.setName("Low Rating Truck");
        lowRatingTruck.setDescription("This is the truck with a low rating.");
        final long lowRatingTruckId = this.truckService.createTruck(lowRatingTruck, this.owner).getId();
        this.scheduleService.createSchedule(this.createTestSchedule(), lowRatingTruck);
        this.reviewService.createReview(this.createLowReview(), this.owner, lowRatingTruck);
        assertDoesNotThrow(() -> assertEquals(2.0, this.reviewService.getAverageReviewByTruckID(lowRatingTruckId), 0.1));
        ++numTrucks;
        log.info("Created low rating truck");

        // Ensure that trucks were created
        assertEquals(numTrucks, this.truckService.findAll().size());

        // Ensure that all schedules were created
        assertEquals(numTrucks, this.scheduleRepository.findAll().size());

        // Get list of applicable trucks
        List<Truck> subscribedTrucks = this.subscriptionService.findUserSubscriptions(this.owner);

        // Get recommendations
        List<Truck> recommendationsWithoutSubscriptions = this.recommendationService.getRecommendations(subscribedTrucks, Location.fromUser(this.owner), false, 5);
        assertArrayEquals(Stream.of(new Truck[] {
            highRatingTruck,
            lowRatingTruck,
            noRatingTruck
        }).map(Truck::getName).toArray(), recommendationsWithoutSubscriptions.stream().map(Truck::getName).toArray());
    }

    @Test
    public void testRecommendationsTags() {
        int numTrucks = 0;

        // Create subscribed truck
        Truck subscribedTruck = new Truck();
        subscribedTruck.setName("Subscribed Truck");
        subscribedTruck.setDescription("This is the subscribed truck.");
        this.truckService.createTruck(subscribedTruck, this.owner);
        this.truckTagService.addTruckTag(subscribedTruck, this.tagA);
        this.truckTagService.addTruckTag(subscribedTruck, this.tagB);
        this.scheduleService.createSchedule(this.createTestSchedule(), subscribedTruck);
        this.subscriptionService.addUserSubscription(this.owner, subscribedTruck);
        ++numTrucks;
        log.info("Created subscribed truck 1");

        // Create other subscribed truck
        Truck otherSubscribedTruck = new Truck();
        otherSubscribedTruck.setName("Other Subscribed Truck");
        otherSubscribedTruck.setDescription("This is the other subscribed truck.");
        this.truckService.createTruck(otherSubscribedTruck, this.owner);
        this.truckTagService.addTruckTag(otherSubscribedTruck, this.tagB);
        this.scheduleService.createSchedule(this.createTestSchedule(), otherSubscribedTruck);
        this.subscriptionService.addUserSubscription(this.owner, otherSubscribedTruck);
        ++numTrucks;
        log.info("Created subscribed truck 2");

        // Create no tag truck
        Truck noTagTruck = new Truck();
        noTagTruck.setName("No Tag Truck");
        noTagTruck.setDescription("This is the truck with no tags.");
        this.truckService.createTruck(noTagTruck, this.owner);
        this.scheduleService.createSchedule(this.createTestSchedule(), noTagTruck);
        ++numTrucks;
        log.info("Created no tag truck");

        // Create one tag truck
        Truck oneTagTruck = new Truck();
        oneTagTruck.setName("One Tag Truck");
        oneTagTruck.setDescription("This is the truck with one tag.");
        this.truckService.createTruck(oneTagTruck, this.owner);
        this.scheduleService.createSchedule(this.createTestSchedule(), oneTagTruck);
        this.truckTagService.addTruckTag(oneTagTruck, this.tagA);
        this.truckTagService.addTruckTag(oneTagTruck, this.tagC);
        ++numTrucks;
        log.info("Created one tag truck");

        // Create other one tag truck
        Truck otherOneTagTruck = new Truck();
        otherOneTagTruck.setName("Other One Tag Truck");
        otherOneTagTruck.setDescription("This is the other truck with one tag.");
        this.truckService.createTruck(otherOneTagTruck, this.owner);
        this.scheduleService.createSchedule(this.createTestSchedule(), otherOneTagTruck);
        this.truckTagService.addTruckTag(otherOneTagTruck, this.tagB);
        ++numTrucks;
        log.info("Created other tag truck");

        // Create two tag truck
        Truck twoTagTruck = new Truck();
        twoTagTruck.setName("Two Tag Truck");
        twoTagTruck.setDescription("This is the other truck with two tags.");
        this.truckService.createTruck(twoTagTruck, this.owner);
        this.scheduleService.createSchedule(this.createTestSchedule(), twoTagTruck);
        this.truckTagService.addTruckTag(twoTagTruck, this.tagA);
        this.truckTagService.addTruckTag(twoTagTruck, this.tagB);
        ++numTrucks;
        log.info("Created two tag truck");

        // Ensure that trucks were created
        assertEquals(numTrucks, this.truckService.findAll().size());

        // Ensure that all schedules were created
        assertEquals(numTrucks, this.scheduleRepository.findAll().size());

        // Get list of applicable trucks
        List<Truck> subscribedTrucks = this.subscriptionService.findUserSubscriptions(this.owner);

        // Get recommendations with subscriptions
        List<Truck> recommendationsWithSubscriptions = this.recommendationService.getRecommendations(subscribedTrucks, Location.fromUser(this.owner), true, 5);
        assertEquals(5, recommendationsWithSubscriptions.size());

        // Get recommendations without subscriptions
        List<Truck> recommendationsWithoutSubscriptions = this.recommendationService.getRecommendations(subscribedTrucks, Location.fromUser(this.owner), false, 5);
        assertArrayEquals(Stream.of(new Truck[] {
            twoTagTruck,
            otherOneTagTruck,
            oneTagTruck,
            noTagTruck
        }).map(Truck::getName).toArray(), recommendationsWithoutSubscriptions.stream().map(Truck::getName).toArray());
    }
}