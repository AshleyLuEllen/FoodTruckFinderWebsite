package food.truck.api.data.truck_tag;

import food.truck.api.data.review.Review;
import food.truck.api.data.tag.Tag;
import food.truck.api.data.tag.TagRepository;
import food.truck.api.data.tag.TagService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckRepository;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
class TruckTagServiceTest {

    @Autowired
    private TagService tagService;

    @Autowired
    private TruckService truckService;

    @Autowired
    private UserService userService;

    @Autowired
    private TruckTagService truckTagService;

    private Tag []tags;
    private Truck truck;
    private User user;

    @BeforeEach
    void setup() {
        Truck truck1 = new Truck();
        User user1 = new User();

        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo$$43vr");

        truck1.setName("Trucky");
        truck1.setDescription("Best truck ever");
        truck1.setLicensePlate("LVN 6982");
        truck1.setOwner(user1);

        user = userService.createUser(user1);
        truck = truckService.createTruck(truck1, user);

        String []tagNames = {"food", "health", "kids", "drinks", "fresh"};
        String []tagDesc = {"desc 1", "desc 2", "desc 3", "desc 4", "desc 5"};
        tags = new Tag[5];

        for(int i = 0; i < 5; i++) {
            tags[i] = new Tag();
            tags[i].setName(tagNames[i]);
            tags[i].setDescription(tagDesc[i]);
            tags[i] = tagService.createTag(tags[i]);
            tags[i] = truckTagService.addTruckTag(truck, tags[i]);
        }
    }

    @Test
    void findTruckTag() {
        Optional<TruckTag> tt = truckTagService.findTruckTag(truck, tags[0]);
        assertTrue(tt.isPresent());
        assertEquals("desc 1", tt.get().tag.getDescription(), tt.get().getTag().getDescription());
        assertEquals("food", tt.get().tag.getName());
    }

    @Test
    void addTruckTag() {
        Tag t = new Tag();
        t.setName("new tag");
        t.setDescription("new desc");
        t = tagService.createTag(t);
        truckTagService.addTruckTag(truck, t);

        assertEquals("new tag", truckTagService.findTruckTag(truck, t).get().getTag().getName());
        assertEquals("new desc", truckTagService.findTruckTag(truck, t).get().getTag().getDescription());
    }

    @Test
    void deleteTruckTag() {
        truckTagService.deleteTruckTag(truck, tags[0]);
        assertTrue(truckTagService.findTruckTag(truck, tags[0]).isEmpty());
    }
}