package food.truck.api.data.user;

import food.truck.api.data.schedule.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAddress(String email);

    @Query(value = "SELECT * FROM " + User.TABLE_NAME + " u0 WHERE ( 3959 * acos( cos( radians(?1) ) * cos( radians( u0.user_location_latitude ) ) " +
        "* cos( radians( u0.user_location_longitude ) - radians(?2) ) + sin( radians(?1) ) * sin(radians(u0.user_location_latitude)))) <= ?3", nativeQuery = true)
//    @Query(value = "SELECT * FROM " + Schedule.TABLE_NAME + " s0 WHERE ( 3959 * acos( cos( radians(?1) ) * cos( radians( truck_latitude ) ) " +
//        "* cos( radians( truck_longitude ) - radians(?2) ) + sin( radians(?1) ) * sin(radians(truck_latitude)))) <= ?3 AND time_from < ?4 AND time_from >= ALL(SELECT time_from FROM " + Schedule.TABLE_NAME + " s1 WHERE s0.truck_id = s1.truck_id)", nativeQuery = true)

    List<User> findAllUsersNearLocation(double latitude, double longitude, double maxDistance);

    List<User> findAllByFirstNameAndLastName(String firstName, String lastName);

    List<User> findAllByFirstName(String firstName);

    List<User> findAllByLastName(String lastName);
}