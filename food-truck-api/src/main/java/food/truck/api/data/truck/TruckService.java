package food.truck.api.data.truck;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Truck createTruck(Truck truck) {
        return truckRepository.save(truck);
    }

}

