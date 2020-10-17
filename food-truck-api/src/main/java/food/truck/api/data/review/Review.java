package food.truck.api.data.review;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import lombok.Data;

import javax.persistence.*;
import java.time.ZonedDateTime;

@Data
@Entity
@Table(name = Review.TABLE_NAME)
public class Review {
    public static final String TABLE_NAME = "truck_reviews";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
        name = TABLE_NAME + "_GENERATOR",
        sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "review_id")
    Long id;

    @JoinColumn(name = "user_id")
    @ManyToOne
    User user;

    @JoinColumn(name = "truck_id")
    @ManyToOne
    Truck truck;

    @Column(name = "review_rating")
    short rating;

    @Column(name = "review_comment")
    String comment;

    @Column(name = "review_timestamp", columnDefinition = "TIMESTAMP")
    ZonedDateTime reviewTimestamp;
}

