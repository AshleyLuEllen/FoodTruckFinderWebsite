package food.truck.api.util;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
class GooglePlaceServiceTest {
    @Autowired
    GoogleApiService googlePlaceService;

    @Test
    void getLocationFromPlaceId() {
        googlePlaceService.getLocationFromPlaceId("ChIJCZu4QDKCT4YRHA7hXumYhyw");
    }
}