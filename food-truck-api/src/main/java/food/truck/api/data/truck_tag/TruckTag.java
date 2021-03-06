package food.truck.api.data.truck_tag;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck.Truck;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = TruckTag.TABLE_NAME)
@IdClass(TruckTagId.class)
public class TruckTag {
    public static final String TABLE_NAME = "truck_tags";

    @Id
    @JoinColumn(name = "truck_id")
    @ManyToOne
    @JsonIgnoreProperties({ "tags" })
    Truck truck;

    @Id
    @JoinColumn(name = "tag_id")
    @ManyToOne
    Tag tag;
}


