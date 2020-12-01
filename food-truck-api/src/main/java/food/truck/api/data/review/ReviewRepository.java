package food.truck.api.data.review;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByTruck(Truck t);

    List<Review> findAllByUser(User u);

    @Query (value = "SELECT COALESCE(AVG(review_rating), 0) FROM " + Review.TABLE_NAME + " WHERE truck_id = ?1",
        nativeQuery = true)
    double getAverageReviewByTruckID(long truckID);

    void deleteAllByTruck(Truck truck);
}
