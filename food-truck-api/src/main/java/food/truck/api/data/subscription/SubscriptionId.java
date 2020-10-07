package food.truck.api.data.subscription;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;

import java.io.Serializable;
import java.util.Objects;

public class SubscriptionId implements Serializable {
    private User user;
    private Truck truck;

    public SubscriptionId() {
    }

    public SubscriptionId(User user, Truck truck) {
        this.user = user;
        this.truck = truck;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SubscriptionId that = (SubscriptionId) o;
        return Objects.equals(user, that.user) &&
            Objects.equals(truck, that.truck);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, truck);
    }
}
