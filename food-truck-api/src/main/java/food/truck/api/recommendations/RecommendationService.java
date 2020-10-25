package food.truck.api.recommendations;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import food.truck.api.recommendations.impl.TagBasedRecommendationAlgorithm;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationService {
    private IRecommendationAlgorithm recommendationComputer = TagBasedRecommendationAlgorithm.progressiveWeights(5);

    public List<Truck> getRecommendationsForUser(User user) {

    }
}
