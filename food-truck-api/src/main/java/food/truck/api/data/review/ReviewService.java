package food.truck.api.data.review;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    public Optional<Review> findReview(Long reviewId) {
        return reviewRepository.findById(reviewId);
    }

    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByTruck(Truck truck) {
        return reviewRepository.findAllByTruck(truck);
    }

    public List<Review> getReviewsByUser(User user) {
        return reviewRepository.findAllByUser(user);
    }
}

