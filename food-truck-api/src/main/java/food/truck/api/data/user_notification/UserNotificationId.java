package food.truck.api.data.user_notification;

import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.user.User;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UserNotificationId implements Serializable {
    private Long user;
    private Long notification;
}
