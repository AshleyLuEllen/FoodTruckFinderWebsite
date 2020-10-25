package food.truck.api.recommendations;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.UserLocation;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public interface IRecommendationAlgorithm {
    Stream<Truck> getRecommendationStream(List<Truck> truckList, List<Truck> subscriptions, UserLocation location);

    default List<Truck> getRecommendations(List<Truck> truckList, List<Truck> subscriptions, UserLocation location, long maxNum) {
         return getRecommendationStream(truckList, subscriptions, location).limit(maxNum).collect(Collectors.toList());
    }
}
