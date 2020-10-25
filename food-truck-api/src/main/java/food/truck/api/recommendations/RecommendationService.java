package food.truck.api.recommendations;

import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.subscription.SubscriptionService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.user.User;
import food.truck.api.recommendations.impl.TagBasedRecommendationAlgorithm;
import food.truck.api.util.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationService {
    @Autowired
    SubscriptionService subscriptionService;

    @Autowired
    ScheduleService scheduleService;

    private IRecommendationAlgorithm recommendationComputer = TagBasedRecommendationAlgorithm.progressiveWeights(5);

    public List<Truck> getRecommendations(List<Truck> subscriptions, Location location, boolean includeSubscriptions, long maxNum) {
        List<Truck> trucksWithinDistanceFromLocation = scheduleService.getAllTrucksWithinDistanceFromLocation(location, recommendationComputer.getMaxDistance());

        return this.recommendationComputer.getRecommendations(trucksWithinDistanceFromLocation, subscriptions, location, includeSubscriptions, maxNum);
    }

    public List<Truck> getRecommendations(List<Truck> subscriptions, Location location, boolean includeSubscriptions) {
        return this.getRecommendations(subscriptions, location, includeSubscriptions, 10);
    }

    public List<Truck> getRecommendationsForLocation(Location location) {
        return this.getRecommendations(List.of(), location, true);
    }

    public List<Truck> getRecommendationsForUser(User user, long maxCount, boolean includeSubscriptions) {
        List<Truck> subscribedTrucks = subscriptionService.findUserSubscriptions(user);

        return this.getRecommendations(subscribedTrucks, new Location(user.getLatitude(), user.getLongitude()), includeSubscriptions, maxCount);
    }

    public List<Truck> getRecommendationsForUser(User user, long maxCount) {
        return this.getRecommendationsForUser(user, maxCount, false);
    }

    public List<Truck> getRecommendationsForUser(User user) {
        return this.getRecommendationsForUser(user, 10);
    }
}
