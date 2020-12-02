package food.truck.api.data.schedule;

import food.truck.api.data.truck.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByTruck(Truck truck);

    @Query(value = "SELECT * FROM " + Schedule.TABLE_NAME + " s0 WHERE ( 3959 * acos( cos( radians(?1) ) * cos( radians( truck_latitude ) ) " +
        "* cos( radians( truck_longitude ) - radians(?2) ) + sin( radians(?1) ) * sin(radians(truck_latitude)))) <= ?3 AND time_from < ?4 AND time_from >= ALL(SELECT time_from FROM " + Schedule.TABLE_NAME + " s1 WHERE s0.truck_id = s1.truck_id and s1.truck_id < ?4)", nativeQuery = true)
    List<Schedule> findAllSchedulesNearLocationAfterDate(double latitude, double longitude, double maxDistance, ZonedDateTime date);
}
