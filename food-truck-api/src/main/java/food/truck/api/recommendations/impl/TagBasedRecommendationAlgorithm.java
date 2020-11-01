package food.truck.api.recommendations.impl;

import com.google.common.collect.Maps;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.ToDoubleFunction;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class TagBasedRecommendationAlgorithm implements IRecommendationAlgorithm {
    private ScheduleService scheduleService;

    private TruckTagService truckTagService;

    private Function<Long, Double> weightAdjustmentFunction;

    @Getter
    private double distanceWeight;

    @Getter
    private double maxDistance;

    @Getter
    private double ratingWeight;

    @Getter
    private double maxRating;

    public TagBasedRecommendationAlgorithm(ScheduleService scheduleService, TruckTagService truckTagService, Function<Long, Double> weightAdjustmentFunction, double distanceWeight, double maxDistance, double ratingWeight, double maxRating) {
        this.scheduleService = scheduleService;
        this.truckTagService = truckTagService;
        this.weightAdjustmentFunction = weightAdjustmentFunction;
        this.distanceWeight = distanceWeight;
        this.maxDistance = maxDistance;
        this.ratingWeight = ratingWeight;
        this.maxRating = maxRating;
    }

    @Override
    public Stream<Truck> getRecommendationStream(List<Truck> truckList, List<Truck> subscriptions, Location location, boolean includeSubscriptions) {
        // Compute raw weights
        Map<Tag, Long> rawWeights = Maps.newHashMap();
        truckList.forEach(t -> this.truckTagService.findTruckTags(t).forEach(tt -> rawWeights.put(tt, rawWeights.getOrDefault(tt, 0L) + 1)));

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
                        Schedule latest = schedules.stream().sorted(Comparator.comparing(Schedule::getTimeFrom).reversed()).findFirst().get();
                        currentDistance = LocationUtils.mToMi(LocationUtils.sphericalDistance(location, new Location(latest.getLatitude(), latest.getLongitude())));
                    }

                    // Compute tag relevance
                    double result = this.truckTagService.findTruckTags(t).stream().filter(adjustedWeights::containsKey).mapToDouble(adjustedWeights::get).sum();

                    // Compute location relevance
                    result += Math.max(0, (this.maxDistance - currentDistance) / this.maxDistance * this.distanceWeight);

                    // Compute rating relevance
                    double rating = t.getRating() == null ? 0 : t.getRating();
                    result += Math.max(0, rating / this.getMaxRating() * this.getRatingWeight());

                    return result;
                }
            ));

        // Sort and return
        return relevances.entrySet().stream()
            .sorted(Comparator.comparingDouble((ToDoubleFunction<Map.Entry<Truck, Double>>) Map.Entry::getValue).reversed())
            .map(Map.Entry::getKey);
    }

    public static TagBasedRecommendationAlgorithm noWeightAdjustment(ScheduleService scheduleService, TruckTagService truckTagService) {
        return new TagBasedRecommendationAlgorithm(scheduleService, truckTagService, Long::doubleValue, 5, 20, 10, 5);
    }

    public static TagBasedRecommendationAlgorithm cappedWeights(ScheduleService scheduleService, TruckTagService truckTagService, long maxWeight) {
        return new TagBasedRecommendationAlgorithm(scheduleService, truckTagService, w -> Math.min(w.doubleValue(), maxWeight), maxWeight, 20, 10, 5);
    }

    public static TagBasedRecommendationAlgorithm progressiveWeights(ScheduleService scheduleService, TruckTagService truckTagService, long maxWeight) {
        return new TagBasedRecommendationAlgorithm(scheduleService, truckTagService, w -> maxWeight * Math.sin((Math.PI * Math.min(w, 2 * maxWeight)) / (4 * maxWeight)), maxWeight, 20, 10, 5);
    }
}
