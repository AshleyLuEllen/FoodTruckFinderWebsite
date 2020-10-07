package food.truck.api.data.truck_tag;

import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck.Truck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TruckTagService {
    @Autowired
    private TruckTagRepository truckTagRepository;

    public Optional<TruckTag> findTruckTag(Truck truck, Tag tag) {
        return truckTagRepository.findById(new TruckTagId(tag, truck));
    }

    public TruckTag saveTruckTag(TruckTag truckTag) {
        return truckTagRepository.save(truckTag);
    }

    public TruckTag createTruckTag(TruckTag truckTag) {
        return truckTagRepository.save(truckTag);
    }
}

