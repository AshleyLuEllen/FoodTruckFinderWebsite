package food.truck.api.data.subscription;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SubscriptionService {
    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public Optional<Subscription> findSubscription(User user, Truck truck) {
        return subscriptionRepository.findById(new SubscriptionId(user, truck));
    }

    public Subscription saveSubscription(Subscription subscription) {
        return subscriptionRepository.save(subscription);
    }

    public Subscription createSubscription(Subscription subscription) {
        return subscriptionRepository.save(subscription);
    }
}

