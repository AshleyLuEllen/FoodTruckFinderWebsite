package food.truck.api.recommendations;

import food.truck.api.data.truck.Truck;
import food.truck.api.util.Location;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public interface IRecommendationAlgorithm {
    Stream<Truck> getRecommendationStream(List<Truck> truckList, List<Truck> subscriptions, Location location, boolean includeSubscriptions);

    double getMaxDistance();

    default Stream<Truck> getRecommendationStream(List<Truck> truckList, List<Truck> subscriptions, Location location) {
        return getRecommendationStream(truckList, subscriptions, location, false);
    }

    default List<Truck> getRecommendations(List<Truck> truckList, List<Truck> subscriptions, Location location, boolean includeSubscriptions, long maxNum) {
         return getRecommendationStream(truckList, subscriptions, location, includeSubscriptions).limit(maxNum).collect(Collectors.toList());
    }
}
