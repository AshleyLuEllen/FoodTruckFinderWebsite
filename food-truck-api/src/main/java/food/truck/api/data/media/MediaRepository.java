package food.truck.api.data.media;

import food.truck.api.data.truck.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
    void deleteAllByTruck(Truck truck);
}
