package food.truck.api.data.subscription;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck_tag.TruckTag;
import food.truck.api.data.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, SubscriptionId> {
        List<Subscription> findByUser(User user);
        List<Subscription> findAllByTruck(Truck truck);

        void deleteAllByTruck(Truck truck);
}
