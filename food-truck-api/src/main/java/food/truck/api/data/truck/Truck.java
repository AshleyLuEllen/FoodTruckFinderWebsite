package food.truck.api.data.truck;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import food.truck.api.data.truck_tag.TruckTag;
import food.truck.api.data.user.User;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = Truck.TABLE_NAME)
public class Truck {
    public static final String TABLE_NAME = "trucks";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
        name = TABLE_NAME + "_GENERATOR",
        sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "truck_id")
    Long id;

    @Column(name = "truck_name")
    String name;

    @Column(name = "truck_description")
    String description;

    @Column(name = "license_plate")
    String licensePlate;

    @Column(name = "payment_types")
    Long paymentTypes;

    @JoinColumn(name = "owner")
    @ManyToOne
    User owner;

    @OneToMany(mappedBy = "truck")
    @JsonIgnoreProperties("truck")
    List<TruckTag> tags;
}

