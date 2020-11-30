package food.truck.api.data.truck_tag;

import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck.Truck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class TruckTagService {
    @Autowired
    private TruckTagRepository truckTagRepository;

    public Optional<TruckTag> findTruckTag(Truck truck, Tag tag) {
        return truckTagRepository.findById(new TruckTagId(truck.getId(), tag.getId()));
    }

    public List<Tag> findTruckTags(Truck truck) {
        return truckTagRepository.findByTruck(truck).stream().map(TruckTag::getTag).collect(Collectors.toList());
    }

    public Tag addTruckTag(Truck truck, Tag tag) {
        TruckTag truckTag = new TruckTag();
        truckTag.setTruck(truck);
        truckTag.setTag(tag);

        truckTagRepository.save(truckTag);

        return tag;
    }

    public void deleteTruckTag(Truck truck, Tag tag) {
        truckTagRepository.deleteById(new TruckTagId(truck.getId(), tag.getId()));
    }

    @Transactional
    public void deleteAll(Truck dbTruck) {
        truckTagRepository.deleteAllByTruck(dbTruck);
    }

    public void addAllTruckTags(Truck truck, List<Tag> tags) {
        truckTagRepository.saveAll(tags.stream().map(tag -> {
            TruckTag truckTag = new TruckTag();
            truckTag.setTag(tag);
            truckTag.setTruck(truck);
            return truckTag;
        }).collect(Collectors.toList()));
    }
}

