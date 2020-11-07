package food.truck.api.recommendations;

import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck.Truck;
import food.truck.api.util.Location;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public interface IRecommendationAlgorithm {
    Stream<Truck> getRecommendationStream(List<Truck> truckList, List<Truck> subscriptions, Location location, boolean includeSubscriptions);

    Stream<Truck> getSearchResultsStream(List<Truck> truckList, String query, List<Tag> tags, Location location, long minRating);

    default Stream<Truck> getSearchResultsStream(List<Truck> truckList, String query, List<Tag> tags, Location location, long minRating, long maxNum) {
        return getSearchResultsStream(truckList, query, tags, location, minRating).limit(maxNum);
    }

    default List<Truck> getSearchResults(List<Truck> truckList, String query, List<Tag> tags, Location location, long minRating, long maxNum) {
        return getSearchResultsStream(truckList, query, tags, location, minRating).limit(maxNum).collect(Collectors.toList());
    }

    double getMaxDistance();

    default Stream<Truck> getRecommendationStream(List<Truck> truckList, List<Truck> subscriptions, Location location) {
        return getRecommendationStream(truckList, subscriptions, location, false);
    }

    default List<Truck> getRecommendations(List<Truck> truckList, List<Truck> subscriptions, Location location, boolean includeSubscriptions, long maxNum) {
         return getRecommendationStream(truckList, subscriptions, location, includeSubscriptions).limit(maxNum).collect(Collectors.toList());
    }
}
