package food.truck.api.recommendations.impl;

import com.google.common.collect.Maps;
import food.truck.api.data.review.ReviewService;
import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.truck_tag.TruckTagService;
import food.truck.api.util.Location;
import food.truck.api.recommendations.IRecommendationAlgorithm;
import food.truck.api.util.LocationUtils;
import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.function.ToDoubleFunction;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Log4j2
public class TagBasedRecommendationAlgorithm implements IRecommendationAlgorithm {
    private ScheduleService scheduleService;

    private TruckTagService truckTagService;

    private ReviewService reviewService;

    private Function<Long, Double> weightAdjustmentFunction;

    @Getter
    private double distanceWeight;

    @Getter
    private double maxDistance;

    @Getter
    private double ratingWeight;

    @Getter
    private double maxRating;

    public TagBasedRecommendationAlgorithm(ScheduleService scheduleService, TruckTagService truckTagService, ReviewService reviewService, Function<Long, Double> weightAdjustmentFunction, double distanceWeight, double maxDistance, double ratingWeight, double maxRating) {
        this.scheduleService = scheduleService;
        this.truckTagService = truckTagService;
        this.reviewService = reviewService;
        this.weightAdjustmentFunction = weightAdjustmentFunction;
        this.distanceWeight = distanceWeight;
        this.maxDistance = maxDistance;
        this.ratingWeight = ratingWeight;
        this.maxRating = maxRating;
    }

    private double computeQueryRelevance(String base, String query) {
        String[] baseWordsRaw = base.strip().toLowerCase().split("\\W+");
        Stream<String> baseWords = List.of(baseWordsRaw).stream()
            .filter(word -> word.length() > 0);
        Set<String> queryWords = List.of(query.strip().toLowerCase().split("\\W+")).stream()
            .filter(word -> word.length() > 0).collect(Collectors.toSet());
        return (double) baseWords.filter(queryWords::contains).count() / queryWords.size();
    }

    @Override
    public Stream<Truck> getSearchResultsStream(List<Truck> truckList, String query, List<Tag> tags, Location location, long minRating) {
        // Compute relevance
        Map<Truck, Double> relevances = truckList.stream()
            .collect(Collectors.toMap(
                t -> t,
                t -> {
                    // Get latest location of truck
                    double currentDistance;
                    List<Schedule> schedules = scheduleService.findSchedulesOfTruck(t);
                    if (schedules.isEmpty() || location == null) {
                        currentDistance = 0.0;
                    } else {
                        Schedule latest = schedules.stream().max(Comparator.comparing(Schedule::getTimeFrom)).get();
                        currentDistance = LocationUtils.mToMi(LocationUtils.sphericalDistance(location, new Location(latest.getLatitude(), latest.getLongitude())));
                        t.setCurrentDistance(currentDistance);
                    }
                    log.info(currentDistance);

                    // Compute tag relevance
                    double result = 0.0;

                    if (tags != null)
                        result += this.truckTagService.findTruckTags(t).stream().filter(tags::contains).count() * 4;

                    // Compute query relevance
                    if (query != null) {
                        result += 12 * (computeQueryRelevance(t.getName(), query) + computeQueryRelevance(t.getDescription(), query));
                    }

                    // Compute location relevance
                    result += Math.max(0, (this.maxDistance * 2 - currentDistance) / (this.maxDistance * 2) * this.distanceWeight);

                    // Compute rating relevance
                    if (minRating > this.getMaxRating()) {
                        result += 0.0;
                    } else {
                        log.info("here");
                        double rating = this.reviewService.getAverageReviewByTruckID(t.getId());
                        double comp = (rating - minRating) / (this.getMaxRating() - minRating);
                        result += Math.min(1, Math.max(0, Double.isNaN(comp) ? 1.0 : comp)) * this.getRatingWeight();
                    }
                    log.info(t.getName() + " " + result);

                    return result;
                }
            ));

        // Sort and return
        return relevances.entrySet().stream()
            .sorted(Comparator.comparingDouble((ToDoubleFunction<Map.Entry<Truck, Double>>) Map.Entry::getValue).reversed())
            .map(Map.Entry::getKey);
    }

    @Override
    public Stream<Truck> getRecommendationStream(List<Truck> truckList, List<Truck> subscriptions, Location location, boolean includeSubscriptions) {
        // Compute raw weights
        Map<Tag, Long> rawWeights = Maps.newHashMap();
        subscriptions.forEach(t -> this.truckTagService.findTruckTags(t).forEach(tt -> rawWeights.put(tt, rawWeights.getOrDefault(tt, 0L) + 1)));

        // Adjust weights
        Map<Tag, Double> adjustedWeights = Maps.newHashMap();
        rawWeights.forEach((t, w) -> adjustedWeights.put(t, this.weightAdjustmentFunction.apply(w)));

        // Filter trucks
        if (!includeSubscriptions) {
            truckList.removeAll(subscriptions);
        }

        // Compute relevance
        Map<Truck, Double> relevances = truckList.stream()
            .collect(Collectors.toMap(
                t -> t,
                t -> {
                    // Get latest location of truck
                    double currentDistance;
                    List<Schedule> schedules = scheduleService.findSchedulesOfTruck(t);
                    if (schedules.isEmpty() || location == null) {
                        currentDistance = 0.0;
                    } else {
                        Schedule latest = schedules.stream().max(Comparator.comparing(Schedule::getTimeFrom)).get();
                        currentDistance = LocationUtils.mToMi(LocationUtils.sphericalDistance(location, new Location(latest.getLatitude(), latest.getLongitude())));
                        t.setCurrentDistance(currentDistance);
                    }

                    // Compute tag relevance
                    double result = this.truckTagService.findTruckTags(t).stream().filter(adjustedWeights::containsKey).mapToDouble(adjustedWeights::get).sum();

                    // Compute location relevance
                    result += Math.max(0, (this.maxDistance - currentDistance) / this.maxDistance * this.distanceWeight);

                    // Compute rating relevance
                    double rating = this.reviewService.getAverageReviewByTruckID(t.getId());
                    result += Math.max(0, rating / this.getMaxRating() * this.getRatingWeight());

                    return result;
                }
            ));

        // Sort and return
        return relevances.entrySet().stream()
            .sorted(Comparator.comparingDouble((ToDoubleFunction<Map.Entry<Truck, Double>>) Map.Entry::getValue).reversed())
            .map(Map.Entry::getKey);
    }

    public static TagBasedRecommendationAlgorithm noWeightAdjustment(ScheduleService scheduleService, TruckTagService truckTagService, ReviewService reviewService) {
        return new TagBasedRecommendationAlgorithm(scheduleService, truckTagService, reviewService, Long::doubleValue, 5, 20, 10, 5);
    }

    public static TagBasedRecommendationAlgorithm cappedWeights(ScheduleService scheduleService, TruckTagService truckTagService, ReviewService reviewService, long maxWeight) {
        return new TagBasedRecommendationAlgorithm(scheduleService, truckTagService, reviewService, w -> Math.min(w.doubleValue(), maxWeight), maxWeight, 20, 10, 5);
    }

    public static TagBasedRecommendationAlgorithm progressiveWeights(ScheduleService scheduleService, TruckTagService truckTagService, ReviewService reviewService, long maxWeight) {
        return new TagBasedRecommendationAlgorithm(scheduleService, truckTagService, reviewService, w -> maxWeight * Math.sin((Math.PI * Math.min(w, 2 * maxWeight)) / (4 * maxWeight)), maxWeight, 20, 10, 5);
    }
}
