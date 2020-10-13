package food.truck.api.data.user;

import food.truck.api.endpoint.error.ResourceConflictException;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
class UserServiceTest {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void createUser() {
        assertNotNull(userService);

        // Create test user 1
        User user1 = new User();
        user1.setFirstName("Bob");
        user1.setLastName("Ross");
        user1.setEmailAddress("bob.ross@example.com");
        user1.setPassword("B0bRo$$43vr");

        // Create test user 2 (same email as user 1)
        User user2 = new User();
        user2.setFirstName("Robert");
        user2.setLastName("Ross");
        user2.setEmailAddress("bob.ross@example.com");
        user2.setPassword("B0bRo$$43vr2");

        assertDoesNotThrow(() -> userService.createUser(user1));

        assertThrows(ResourceConflictException.class, () -> userService.createUser(user1));
        assertThrows(ResourceConflictException.class, () -> userService.createUser(user2));
    }

    @Test
    void findByEmailAddress() {
        // Create test user
        User user = new User();
        user.setFirstName("Bob");
        user.setLastName("Ross");
        user.setEmailAddress("bob.ross@example.com");
        user.setPassword("B0bRo$$43vr");
        userService.createUser(user);

        assertTrue(userService.findUserByEmailAddress("bob.ross@example.com").isPresent());
        assertTrue(userService.findUserByEmailAddress("me@mattrm.dev").isEmpty());
    }
}