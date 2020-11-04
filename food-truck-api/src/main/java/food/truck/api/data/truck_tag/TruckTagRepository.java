package food.truck.api.data.truck_tag;

import food.truck.api.data.truck.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TruckTagRepository extends JpaRepository<TruckTag, TruckTagId> {
    List<TruckTag> findByTruck(Truck truck);
}
