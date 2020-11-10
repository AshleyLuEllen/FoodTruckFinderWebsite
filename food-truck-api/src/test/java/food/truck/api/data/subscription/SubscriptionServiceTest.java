package food.truck.api.data.subscription;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
@Log4j2
public class SubscriptionServiceTest {
    @BeforeEach
    void setUp() {

    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void findSubscription() {
    }

    @Test
    void findUserSubscriptions() {
    }

    @Test
    void addUserSubscription() {
    }

    @Test
    void deleteUserSubscription() {
    }
}
