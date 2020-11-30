package food.truck.api.data.truck;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import food.truck.api.data.media.Media;
import food.truck.api.data.review.Review;
import food.truck.api.data.schedule.Schedule;
import food.truck.api.data.truck_tag.TruckTag;
import food.truck.api.data.user.User;
import lombok.Data;
import org.hibernate.annotations.*;
import org.springframework.data.jpa.repository.Query;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.List;
import java.util.Objects;

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

    @JoinColumn(name = "truck_menu")
    @OneToOne
    Media menu;

    @Formula("(SELECT AVG(r.review_rating) FROM " + Review.TABLE_NAME + " r WHERE r.truck_id = truck_id)")
//    @Formula("(SELECT 10)")
    Double rating;

    @ManyToOne(fetch=FetchType.LAZY)
    @NotFound(action = NotFoundAction.IGNORE)
    @JoinColumnsOrFormulas({
        @JoinColumnOrFormula(formula=@JoinFormula(value="(SELECT s0.schedule_id FROM " + Schedule.TABLE_NAME + " s0 WHERE s0.truck_id = truck_id AND s0.time_from <= CURRENT_TIMESTAMP() AND s0.time_from >= ALL(SELECT s1.time_from FROM " + Schedule.TABLE_NAME + " s1 WHERE s1.truck_id = truck_id AND s1.time_from <= CURRENT_TIMESTAMP()) LIMIT 1)", referencedColumnName = "schedule_id"))
    })
//    @Where(clause = "")
    @JsonIgnoreProperties("truck")
    private Schedule currentLocation;

    @Transient
    private Double currentDistance;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Truck truck = (Truck) o;
        return Objects.equals(id, truck.id) &&
            Objects.equals(name, truck.name) &&
            Objects.equals(description, truck.description) &&
            Objects.equals(licensePlate, truck.licensePlate) &&
            Objects.equals(paymentTypes, truck.paymentTypes) &&
            Objects.equals(owner, truck.owner);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, licensePlate, paymentTypes, owner);
    }
}

