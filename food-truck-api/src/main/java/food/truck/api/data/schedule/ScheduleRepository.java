package food.truck.api.data.schedule;

import food.truck.api.data.truck.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByTruck(Truck truck);
}
