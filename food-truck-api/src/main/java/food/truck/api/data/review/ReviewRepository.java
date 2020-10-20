package food.truck.api.data.review;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    public List<Review> findAllByTruck(Truck t);

    public List<Review> findAllByUser(User u);
}
