package food.truck.api.data.subscription;

import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck_tag.TruckTag;
import food.truck.api.data.truck_tag.TruckTagId;
import food.truck.api.data.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {
    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public Optional<Subscription> findSubscription(User user, Truck truck) {
        return subscriptionRepository.findById(new SubscriptionId(user.getId(), truck.getId()));
    }

    public List<Truck> findUserSubscriptions(User user) {
        return subscriptionRepository.findByUser(user).stream().map(Subscription::getTruck).collect(Collectors.toList());
    }

    public void addUserSubscription(User user, Truck truck) {
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setTruck(truck);

        subscriptionRepository.save(subscription);
    }

    public void deleteUserSubscription(User user, Truck truck) {
        subscriptionRepository.deleteById(new SubscriptionId(user.getId(), truck.getId()));
    }
}

