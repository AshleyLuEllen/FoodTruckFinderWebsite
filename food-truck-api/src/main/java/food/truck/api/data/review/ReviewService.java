package food.truck.api.data.review;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    public Optional<Review> findReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId);
    }

    public Review createReview(Review review, User user, Truck truck) {
        review.setUser(user);
        review.setTruck(truck);
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByTruck(Truck truck) {
        return reviewRepository.findAllByTruck(truck);
    }

    public List<Review> getReviewsByUser(User user) {
        return reviewRepository.findAllByUser(user);
    }

    public void deleteReview(long reviewID) {
        reviewRepository.deleteById(reviewID);
    }
}

