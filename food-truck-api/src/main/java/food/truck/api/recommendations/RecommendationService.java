package food.truck.api.recommendations;

import food.truck.api.data.review.ReviewService;
import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.subscription.SubscriptionService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.truck_tag.TruckTagService;
import food.truck.api.data.user.User;
import food.truck.api.recommendations.impl.TagBasedRecommendationAlgorithm;
import food.truck.api.util.GoogleApiService;
import food.truck.api.util.Location;
import food.truck.api.util.SearchQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationService {
    @Autowired
    SubscriptionService subscriptionService;

    @Autowired
    ScheduleService scheduleService;

    @Autowired
    TruckTagService truckTagService;

    @Autowired
    TruckService truckService;

    @Autowired
    ReviewService reviewService;

    @Autowired
    GoogleApiService googlePlaceService;

    private IRecommendationAlgorithm recommendationComputer = null;

    private IRecommendationAlgorithm getRecommendationComputer() {
        if (recommendationComputer == null) {
            this.recommendationComputer = TagBasedRecommendationAlgorithm.progressiveWeights(scheduleService, truckTagService,reviewService, 5);
        }

        return this.recommendationComputer;
    }

    public List<Truck> getRecommendationsWithoutLocation(List<Truck> subscriptions, boolean includeSubscriptions, long maxNum) {
        List<Truck> truckList = truckService.findAll();

        return this.getRecommendationComputer().getRecommendations(truckList, subscriptions, null, includeSubscriptions, maxNum);
    }

    public List<Truck> getRecommendations(List<Truck> subscriptions, Location location, boolean includeSubscriptions, long maxNum) {
        List<Truck> trucksWithinDistanceFromLocation = scheduleService.getAllTrucksWithinDistanceFromLocation(location, this.getRecommendationComputer().getMaxDistance());

        return this.getRecommendationComputer().getRecommendations(trucksWithinDistanceFromLocation, subscriptions, location, includeSubscriptions, maxNum);
    }

    public List<Truck> getRecommendations(List<Truck> subscriptions, Location location, boolean includeSubscriptions) {
        return this.getRecommendations(subscriptions, location, includeSubscriptions, 10);
    }

    public List<Truck> getRecommendationsForLocation(Location location) {
        return this.getRecommendations(List.of(), location, true);
    }

    public List<Truck> getRecommendationsForUser(User user, long maxCount, boolean includeSubscriptions) {
        List<Truck> subscribedTrucks = subscriptionService.findUserSubscriptions(user);

        if (user.getLongitude() != null && user.getLatitude() != null) {
            Location location = new Location(user.getLatitude(), user.getLongitude());
            return this.getRecommendations(subscribedTrucks, location, includeSubscriptions, maxCount);
        } else {
            return this.getRecommendationsWithoutLocation(subscribedTrucks, includeSubscriptions, maxCount);
        }
    }

    public List<Truck> getRecommendationsForUser(User user, long maxCount) {
        return this.getRecommendationsForUser(user, maxCount, false);
    }

    public List<Truck> getRecommendationsForUser(User user) {
        return this.getRecommendationsForUser(user, 10);
    }

    public List<Truck> getSearchResults(SearchQuery query) {
        return this.getRecommendationComputer().getSearchResults(
            truckService.findAll(),
            query.getQuery(),
            query.getTags(),
            query.getPlaceId() != null ? googlePlaceService.getLocationFromPlaceId(query.getPlaceId()) : query.getLocation(),
            query.getPreferredRating() != null ? query.getPreferredRating() : 0,
            20
        );
    }
}
