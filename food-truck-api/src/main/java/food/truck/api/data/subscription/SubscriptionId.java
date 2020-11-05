package food.truck.api.data.subscription;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class SubscriptionId implements Serializable {
    private Long user;
    private Long truck;
}
