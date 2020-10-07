package food.truck.api.data.truck_tag;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TruckTagRepository extends JpaRepository<TruckTag, TruckTagId> {
}
