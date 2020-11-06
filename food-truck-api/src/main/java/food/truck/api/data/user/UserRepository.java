package food.truck.api.data.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAddress(String email);

    @Query(value = "SELECT * FROM " + User.TABLE_NAME + " u0 WHERE ( 3959 * acos( cos( radians(?1) ) * cos( radians( user_location_latitude ) ) " +
        "* cos( radians( user_location_longitude ) - radians(?2) ) + sin( radians(?1) ) * sin(radians(user_location_latitude)))) <= ?3", nativeQuery = true)
    List<User> findAllUsersNearLocation(double latitude, double longitude, double maxDistance);
}