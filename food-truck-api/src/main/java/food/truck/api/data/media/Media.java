package food.truck.api.data.media;

import food.truck.api.data.truck.Truck;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = Media.TABLE_NAME)
public class Media {
    public static final String TABLE_NAME = "truck_media";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
        name = TABLE_NAME + "_GENERATOR",
        sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "media_id")
    Long id;

    @JoinColumn(name = "truck_id")
    @ManyToOne
    Truck truck;

    @Column(name = "hidden")
    Boolean hidden;

    @Column(name = "data_type")
    @Enumerated(EnumType.STRING)
    MediaType dataType;

    @Column(name = "link")
    String url;
}

