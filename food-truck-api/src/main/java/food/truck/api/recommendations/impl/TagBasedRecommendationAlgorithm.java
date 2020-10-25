package food.truck.api.recommendations.impl;

import com.google.common.collect.Maps;
import food.truck.api.data.schedule.ScheduleService;
import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.truck_tag.TruckTagService;
import food.truck.api.util.Location;
import food.truck.api.recommendations.IRecommendationAlgorithm;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.ToDoubleFunction;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class TagBasedRecommendationAlgorithm implements IRecommendationAlgorithm {
    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private TruckTagService truckTagService;

    private Function<Long, Double> weightAdjustmentFunction;
    @Getter
    private double distanceWeight;
    @Getter
    private double maxDistance;

    public TagBasedRecommendationAlgorithm(Function<Long, Double> weightAdjustmentFunction, double distanceWeight, double maxDistance) {
        this.weightAdjustmentFunction = weightAdjustmentFunction;
        this.distanceWeight = distanceWeight;
        this.maxDistance = maxDistance;
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
                    double currentDistance = 0.0;
                    double result = this.truckTagService.findTruckTags(t).stream().filter(adjustedWeights::containsKey).mapToDouble(adjustedWeights::get).sum();

                    result += Math.max(0, (this.maxDistance - currentDistance) / this.maxDistance * this.distanceWeight);

                    return result;
                }
            ));

        // Sort and return
        return relevances.entrySet().stream()
            .sorted(Comparator.comparingDouble((ToDoubleFunction<Map.Entry<Truck, Double>>) Map.Entry::getValue).reversed())
            .map(Map.Entry::getKey);
    }

    public static TagBasedRecommendationAlgorithm noWeightAdjustment() {
        return new TagBasedRecommendationAlgorithm(Long::doubleValue, 5, 20);
    }

    public static TagBasedRecommendationAlgorithm cappedWeights(long maxWeight) {
        return new TagBasedRecommendationAlgorithm(w -> Math.min(w.doubleValue(), maxWeight), maxWeight, 20);
    }

    public static TagBasedRecommendationAlgorithm progressiveWeights(long maxWeight) {
        return new TagBasedRecommendationAlgorithm(w -> maxWeight * Math.sin((Math.PI * Math.min(w, 2 * maxWeight)) / (4 * maxWeight)), maxWeight, 20);
    }
}
