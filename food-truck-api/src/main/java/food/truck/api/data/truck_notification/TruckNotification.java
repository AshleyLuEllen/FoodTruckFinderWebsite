package food.truck.api.data.truck_notification;

import food.truck.api.data.media.Media;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import lombok.Data;

import javax.persistence.*;
import java.time.ZonedDateTime;

@Data
@Entity
@Table(name = TruckNotification.TABLE_NAME)
public class TruckNotification {
    public static final String TABLE_NAME = "truck_notifications";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
        name = TABLE_NAME + "_GENERATOR",
        sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "notification_id")
    Long id;

    @JoinColumn(name = "truck_id")
    @ManyToOne
    Truck truck;

    @JoinColumn(name = "user_id")
    @ManyToOne
    User user;

    @JoinColumn(name = "media_id")
    @OneToOne
    Media media;

    @Column(name = "notification_type")
    @Enumerated(EnumType.STRING)
    NotificationType type;

    @Column(name = "notification_subject")
    String subject;

    @Column(name = "notification_description", columnDefinition = "VARCHAR(2000)")
    String description;

    @Column(name = "published")
    Boolean published;

    @Column(name = "posted_timestamp", columnDefinition = "TIMESTAMP")
    ZonedDateTime postedTimestamp;

    @Transient
    boolean unread;
}

