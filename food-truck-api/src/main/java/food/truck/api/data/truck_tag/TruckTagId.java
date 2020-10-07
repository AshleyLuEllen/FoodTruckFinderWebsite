package food.truck.api.data.truck_tag;

import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck.Truck;

import java.io.Serializable;
import java.util.Objects;

public class TruckTagId implements Serializable {
    private Tag tag;
    private Truck truck;

    public TruckTagId() {
    }

    public TruckTagId(Tag tag, Truck truck) {
        this.tag = tag;
        this.truck = truck;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TruckTagId that = (TruckTagId) o;
        return Objects.equals(tag, that.tag) &&
            Objects.equals(truck, that.truck);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tag, truck);
    }
}
