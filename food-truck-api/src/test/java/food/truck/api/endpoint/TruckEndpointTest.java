package food.truck.api.endpoint;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
@RunWith(SpringRunner.class)
@DataJpaTest
class TruckEndpointTest {
    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TruckService truckService;

    @BeforeEach
    void setUp() throws SQLException {

    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void findTruckById() {
        Truck t = new Truck();
        t.setDescription("description");
        t.setId(12345l);
        t.setName("Food Truck");

        entityManager.persist(t);
        entityManager.flush();

        Optional<Truck> found = truckService.findTruck(t.getId());
        assert(!found.isEmpty());
        assertThat(t.getId() == found.get().getId());
    }

    @Test
    void createTruck() {
    }

    @Test
    void saveTruck() {
    }
}