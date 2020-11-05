package food.truck.api.data.truck_tag;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class TruckTagId implements Serializable {
    private Long truck;
    private Long tag;
}
