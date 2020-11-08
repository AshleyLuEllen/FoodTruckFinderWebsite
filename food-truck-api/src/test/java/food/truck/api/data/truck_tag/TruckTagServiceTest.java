package food.truck.api.data.truck_tag;

import food.truck.api.data.review.Review;
import food.truck.api.data.tag.Tag;
import food.truck.api.data.tag.TagRepository;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckRepository;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.user.User;
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
    private TagRepository tagRepository;

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private TruckTagService truckTagService;

    @Autowired
    private TruckTagRepository truckTagRepository;

    private TruckTag []truckTags;
    private Tag []tags;
    private Truck truck1;

    @BeforeEach
    void setup() {
        truck1 = new Truck();
        User user1 = new User();

        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo5543vr");

        truck1.setOwner(user1);
        truck1.setName("Trucky");
        truck1.setDescription("Best truck ever");
        truck1.setLicensePlate("LVN 6982");
        truck1.setOwner(user1);
        truck1 = truckRepository.save(truck1);

        truckTags = new TruckTag[5];
        String []tagNames = {"food", "health", "kids", "drinks", "fresh"};
        String []tagDesc = {"desc 1", "desc 2", "desc 3", "desc 4", "desc 5"};
        tags = new Tag[5];

        for(int i = 0; i < 5; i++) {
            tags[i] = new Tag();
            tags[i].setName(tagNames[i]);
            tags[i].setDescription(tagDesc[i]);
            tags[i] = tagRepository.save(tags[i]);
            truckTags[i] = new TruckTag();
            truckTags[i].setTag(tags[i]);
            truckTags[i].setTruck(truck1);
            truckTags[i] = truckTagRepository.save(truckTags[i]);
        }
    }

    @Test
    void findTruckTag() {
        Optional<TruckTag> tt = truckTagService.findTruckTag(truck1, tags[0]);
        assert(tt.isPresent());
        assertEquals("desc 1", tt.get().tag.getDescription(), tt.get().getTag().getDescription());
        assertEquals("food", tt.get().tag.getName());
    }

    @Test
    void addTruckTag() {
        Tag t = new Tag();
        t.setName("new tag");
        t.setDescription("new desc");
        t = tagRepository.save(t);
        truckTagService.addTruckTag(truck1, t);

        assertEquals("new tag", truckTagService.findTruckTag(truck1, t).get().getTag().getName());
        assertEquals("new desc", truckTagService.findTruckTag(truck1, t).get().getTag().getDescription());
    }

    @Test
    void deleteTruckTag() {
        truckTagService.deleteTruckTag(truck1, tags[0]);
        TruckTagId ttt = new TruckTagId();
        assertTrue(truckTagService.findTruckTag(truck1, tags[0]).isEmpty());
    }
}