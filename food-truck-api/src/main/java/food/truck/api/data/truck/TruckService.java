package food.truck.api.data.truck;

import food.truck.api.data.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TruckService {
    @Autowired
    private TruckRepository truckRepository;

    @PersistenceContext
    private EntityManager em;

    public Optional<Truck> findTruck(Long truckId) {
        return truckRepository.findById(truckId);
    }

    public Truck saveTruck(Truck truck) {
        return truckRepository.save(truck);
    }

    public Truck createTruck(Truck truck, User owner) {
        truck.setOwner(owner);

        return truckRepository.save(truck);
    }

    public List<Truck> getTrucksOwnedByUser(User user) {
        return truckRepository.findByOwner(user);
    }
}

