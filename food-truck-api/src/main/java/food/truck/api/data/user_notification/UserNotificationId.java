package food.truck.api.data.user_notification;

import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.user.User;

import java.io.Serializable;
import java.util.Objects;

public class UserNotificationId implements Serializable {
    private User user;
    private TruckNotification notification;

    public UserNotificationId() {
    }

    public UserNotificationId(User user, TruckNotification notification) {
        this.user = user;
        this.notification = notification;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserNotificationId that = (UserNotificationId) o;
        return Objects.equals(user, that.user) &&
            Objects.equals(notification, that.notification);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, notification);
    }
}
