package food.truck.api.recommendations.impl;

import com.google.common.collect.Maps;
import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.UserLocation;
import food.truck.api.recommendations.IRecommendationAlgorithm;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Stream;

public class TagBasedRecommendationAlgorithm implements IRecommendationAlgorithm {
    private Function<long, double> weightAdjustmentFunction;

    private TagBasedRecommendationAlgorithm(Function<long, double> weightAdjustmentFunction) {
        this.weightAdjustmentFunction = weightAdjustmentFunction;
    }

    @Override
    public Stream<Truck> getRecommendationStream(List<Truck> truckList, List<Truck> subscriptions, UserLocation location) {
        Map<Tag, Double> rawWeights = Maps.newHashMap();


        return null;
    }

    public static TagBasedRecommendationAlgorithm noWeightAdjustment() {
        return new TagBasedRecommendationAlgorithm(w -> w);
    }

    public static TagBasedRecommendationAlgorithm cappedWeights(long maxWeight) {
        return new TagBasedRecommendationAlgorithm(w -> Math.min(w, maxWeight));
    }

    public static TagBasedRecommendationAlgorithm progressiveWeights(long maxWeight) {
        return new TagBasedRecommendationAlgorithm(w -> maxWeight * Math.sin((Math.PI * Math.min(w, 2 * maxWeight)) / (4 * maxWeight)));
    }
}
