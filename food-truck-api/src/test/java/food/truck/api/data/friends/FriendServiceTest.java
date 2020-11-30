package food.truck.api.data.friends;

import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserRepository;
import food.truck.api.data.user.UserService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
@Log4j2
class FriendServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendService friendService;

    @Autowired
    private FriendPairRepository friendPairRepository;

    private User user;
    private User user2;
    private User user3;

    @BeforeEach
    void setUp() {
        User testUser = new User();
        testUser.setPassword("B@yl0rR0cks!");
        testUser.setFirstName("Bobby");
        testUser.setLastName("Baylor");
        testUser.setEmailAddress("Bobby_Baylor@baylor.edu");
        testUser.setLongitude(0.1);
        testUser.setLatitude(0.0);
        user = this.userService.createUser(testUser);

        User testUser2 = new User();
        testUser2.setPassword("B@yl0rR0cks!");
        testUser2.setFirstName("Bob");
        testUser2.setLastName("Baylor");
        testUser2.setEmailAddress("Bob_Baylor@baylor.edu");
        testUser2.setLongitude(0.1);
        testUser2.setLatitude(0.1);
        user2 = this.userService.createUser(testUser2);

        User testUser3 = new User();
        testUser3.setPassword("B@yl0rR0cks!");
        testUser3.setFirstName("Billy");
        testUser3.setLastName("Baylor");
        testUser3.setEmailAddress("billy@baylor.edu");
        testUser3.setLongitude(0.0);
        testUser3.setLatitude(0.1);
        user3 = this.userService.createUser(testUser3);
    }

    @AfterEach
    void tearDown() {
        friendPairRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void areFriends() {
        assertFalse(friendService.areFriends(user, user2));
        friendService.becomeFriends(user, user2);
        assertTrue(friendService.areFriends(user, user2));
    }

    @Test
    void findFriendPair() {
        FriendPair friendPair = friendService.becomeFriends(user, user2);
        assertEquals(friendPair, friendService.findFriendPair(user, user2).orElse(null));
    }

    @Test
    void findAllFriendsOfUser() {
        FriendPair friendPair2 = friendService.becomeFriends(user, user2);
        assertArrayEquals(List.of(friendPair2).stream().mapToLong(friendPair -> friendPair.getUser2().getId()).sorted().toArray(),
            this.friendService.findAllFriendsOfUser(user).stream().mapToLong(User::getId).sorted().toArray());
        FriendPair friendPair3 = friendService.becomeFriends(user, user3);
        assertArrayEquals(List.of(friendPair2, friendPair3).stream().mapToLong(friendPair -> friendPair.getUser2().getId()).sorted().toArray(),
            this.friendService.findAllFriendsOfUser(user).stream().mapToLong(User::getId).sorted().toArray());
    }

    @Test
    void removeFriends() {
        assertFalse(friendService.areFriends(user, user2));
        friendService.becomeFriends(user, user2);
        assertTrue(friendService.areFriends(user, user2));
        friendService.removeFriends(user, user2);
        assertFalse(friendService.areFriends(user, user2));
    }
}