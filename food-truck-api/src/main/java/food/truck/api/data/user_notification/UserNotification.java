package food.truck.api.data.user_notification;

import food.truck.api.data.truck_notification.TruckNotification;
import food.truck.api.data.user.User;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = UserNotification.TABLE_NAME)
@IdClass(UserNotificationId.class)
public class UserNotification {
    public static final String TABLE_NAME = "user_notifications";

    @Id
    @JoinColumn(name = "user_id")
    @ManyToOne
    User user;

    @Id
    @JoinColumn(name = "notification_id")
    @ManyToOne
    TruckNotification notification;

    @Column(name = "saved")
    Boolean saved;
}

