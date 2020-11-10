package food.truck.api.data.schedule;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import food.truck.api.data.truck.Truck;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

@Data
@Entity
@Table(name = Schedule.TABLE_NAME)
public class Schedule implements Serializable {
    public static final String TABLE_NAME = "truck_schedules";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
        name = TABLE_NAME + "_GENERATOR",
        sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "schedule_id")
    Long id;

    @JoinColumn(name = "truck_id", nullable = false)
    @ManyToOne
    @JsonIgnoreProperties({ "currentLocation" })
    Truck truck;

    @Column(name = "truck_location")
    String location;

    @Column(name = "truck_latitude")
    Double latitude;

    @Column(name = "truck_longitude")
    Double longitude;

    @Column(name = "time_from", columnDefinition = "TIMESTAMP")
    ZonedDateTime timeFrom;

    @Column(name = "time_to", columnDefinition = "TIMESTAMP")
    ZonedDateTime timeTo;

    @Transient
    String placeId;
}

