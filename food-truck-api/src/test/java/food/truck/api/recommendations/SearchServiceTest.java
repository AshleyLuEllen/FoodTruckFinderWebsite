package food.truck.api.recommendations;

import food.truck.api.data.review.Review;
import food.truck.api.data.review.ReviewRepository;
import food.truck.api.data.review.ReviewService;
import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.schedule.ScheduleRepository;
import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.subscription.SubscriptionService;
import food.truck.api.data.tag.Tag;
import food.truck.api.data.tag.TagRepository;
import food.truck.api.data.tag.TagService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckRepository;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.truck_tag.TruckTagService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserRepository;
import food.truck.api.data.user.UserService;
import food.truck.api.util.Location;
import food.truck.api.util.SearchQuery;
import lombok.extern.log4j.Log4j2;
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
class SearchServiceTest {
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
    private TruckRepository truckRepository;

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

    @Autowired
    private ReviewRepository reviewRepository;

    private User owner;
    private Tag tagA;
    private Tag tagB;
    private Tag tagC;
    private Truck closeTruck;
    private Truck farTruck;
    private Truck furtherTruck;

    private void setupSearchTest() {
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

        // Create test trucks
        int numTrucks = 0;

        // Create close truck
        Truck closeTruck = new Truck();
        closeTruck.setName("Close Truck");
        closeTruck.setDescription("This is the truck that is close ABC DEF");
        final long closeTruckId = this.truckService.createTruck(closeTruck, this.owner).getId();
        this.scheduleService.createSchedule(this.createTestSchedule(), closeTruck);
        this.truckTagService.addTruckTag(closeTruck, this.tagA);
        this.truckTagService.addTruckTag(closeTruck, this.tagB);
        ++numTrucks;
        log.info("Created close truck");

        // Create far truck
        Truck farTruck = new Truck();
        farTruck.setName("Far Truck ABC DEF");
        farTruck.setDescription("This is the truck that is far");
        final long farTruckId = this.truckService.createTruck(farTruck, this.owner).getId();
        this.scheduleService.createSchedule(this.createFarSchedule(), farTruck);
        this.truckTagService.addTruckTag(closeTruck, this.tagA);
        this.reviewService.createReview(this.createLowReview(), this.owner, farTruck);
        ++numTrucks;
        log.info("Created far truck");

        // Create further truck
        Truck furtherTruck = new Truck();
        furtherTruck.setName("Further Truck GHI");
        furtherTruck.setDescription("This is the truck that is further ABC DEF");
        final long furtherTruckId = this.truckService.createTruck(furtherTruck, this.owner).getId();
        this.scheduleService.createSchedule(this.createFurtherSchedule(), furtherTruck);
        this.reviewService.createReview(this.createHighReview(), this.owner, furtherTruck);
        ++numTrucks;
        log.info("Created further truck");

        // Ensure that trucks were created
        assertEquals(numTrucks, this.truckService.findAll().size());

        // Ensure that all schedules were created
        assertEquals(numTrucks, this.scheduleRepository.findAll().size());

        // Get DAOs
        Optional<Truck> closeTruckOpt = this.truckService.findTruck(closeTruckId);
        assertTrue(closeTruckOpt.isPresent());
        this.closeTruck = closeTruckOpt.get();

        Optional<Truck> farTruckOpt = this.truckService.findTruck(farTruckId);
        assertTrue(farTruckOpt.isPresent());
        this.farTruck = farTruckOpt.get();

        Optional<Truck> furtherTruckOpt = this.truckService.findTruck(furtherTruckId);
        assertTrue(furtherTruckOpt.isPresent());
        this.furtherTruck = furtherTruckOpt.get();
    }

    private void cleanUpSearchTest() {
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

    private Schedule createFarSchedule() {
        Schedule testSchedule = new Schedule();
        testSchedule.setLatitude(0.0);
        testSchedule.setLongitude(0.01);
        testSchedule.setLocation("Location 2");
        testSchedule.setTimeFrom(ZonedDateTime.now().minusDays(1));
        testSchedule.setTimeTo(ZonedDateTime.now().plusDays(1));
        return testSchedule;
    }

    private Schedule createFurtherSchedule() {
        Schedule testSchedule = new Schedule();
        testSchedule.setLatitude(0.0);
        testSchedule.setLongitude(0.02);
        testSchedule.setLocation("Location 3");
        testSchedule.setTimeFrom(ZonedDateTime.now().minusDays(1));
        testSchedule.setTimeTo(ZonedDateTime.now().plusDays(1));
        return testSchedule;
    }

    private Review createHighReview() {
        Review review = new Review();
        review.setRating((short) 5);
        return review;
    }

    private Review createLowReview() {
        Review review = new Review();
        review.setRating((short) 3);
        return review;
    }

    @Test
    public void testSearchByLocation() {
        this.setupSearchTest();

        // Get search results
        SearchQuery searchQuery = new SearchQuery();
        searchQuery.setPreferredRating(6L);
        searchQuery.setLocation(new Location(0.0, 0.0));
        List<Truck> searchResults = this.recommendationService.getSearchResults(searchQuery);
        assertArrayEquals(Stream.of(new Truck[] {
            this.closeTruck,
            this.farTruck,
            this.furtherTruck,
        }).map(Truck::getName).toArray(), searchResults.stream().map(Truck::getName).toArray());

        this.cleanUpSearchTest();
    }

    @Test
    public void testSearchByRating() {
        this.setupSearchTest();

        // Get search results
        SearchQuery searchQuery = new SearchQuery();
        List<Truck> searchResults = this.recommendationService.getSearchResults(searchQuery);
        assertArrayEquals(Stream.of(new Truck[] {
            this.furtherTruck,
            this.farTruck,
            this.closeTruck,
        }).map(Truck::getName).toArray(), searchResults.stream().map(Truck::getName).toArray());

        this.cleanUpSearchTest();
    }

    @Test
    public void testSearchByQuery() {
        this.setupSearchTest();

        // Get search results
        SearchQuery searchQuery = new SearchQuery();
        searchQuery.setQuery("abc ghi def");
        searchQuery.setPreferredRating(6L);
        searchQuery.setLocation(new Location(0.0, 0.0));
        List<Truck> searchResults = this.recommendationService.getSearchResults(searchQuery);
        assertArrayEquals(Stream.of(new Truck[] {
            this.furtherTruck,
            this.closeTruck,
            this.farTruck,
        }).map(Truck::getName).toArray(), searchResults.stream().map(Truck::getName).toArray());

        this.cleanUpSearchTest();
    }

    @Test
    public void testSearchByTags() {
        this.setupSearchTest();

        // Get search results
        SearchQuery searchQuery = new SearchQuery();
        searchQuery.setTags(List.of(this.tagA, this.tagB, this.tagC));
        searchQuery.setPreferredRating(6L);
        searchQuery.setLocation(new Location(0.0,0.0));
        List<Truck> searchResults = this.recommendationService.getSearchResults(searchQuery);
        assertArrayEquals(Stream.of(new Truck[] {
            this.closeTruck,
            this.farTruck,
            this.furtherTruck,
        }).map(Truck::getName).toArray(), searchResults.stream().map(Truck::getName).toArray());

        this.cleanUpSearchTest();
    }
}