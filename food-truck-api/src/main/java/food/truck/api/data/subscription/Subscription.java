package food.truck.api.data.subscription;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = Subscription.TABLE_NAME)
@IdClass(SubscriptionId.class)
public class Subscription {
    public static final String TABLE_NAME = "user_subscriptions";

    @Id
    @JoinColumn(name = "user_id")
    @ManyToOne
    User user;

    @Id
    @JoinColumn(name = "truck_id")
    @ManyToOne
    Truck truck;
}

