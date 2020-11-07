package food.truck.api.data.truck;

import food.truck.api.data.user.User;
import food.truck.api.util.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TruckService {
    @Autowired
    private TruckRepository truckRepository;

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

    public void deleteTruck(long truckid) {
        truckRepository.deleteById(truckid);
    }

    public List<Truck> getTrucksOwnedByUser(User owner) {
        return truckRepository.findAllByOwner(owner);
    }

    public List<Truck> findAll() {
        return truckRepository.findAll();
    }
}

