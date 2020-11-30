package food.truck.api.endpoint;

import food.truck.api.data.tag.Tag;
import food.truck.api.data.tag.TagService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.truck_tag.TruckTagService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import lombok.extern.log4j.Log4j2;

import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
public class TruckTagEndpoint {
    @Autowired
    TruckTagService truckTagService;

    @Autowired
    TruckService truckService;

    @Autowired
    TagService tagService;

    @Autowired
    UserService userService;

    @GetMapping("/trucks/{truckId}/tags")
    public List<Tag> getTruckTags(@PathVariable Long truckId){
        // Check if truck exists
        Truck truck = truckService.findTruck(truckId).orElseThrow(ResourceNotFoundException::new);
        return truckTagService.findTruckTags(truck);
    }

    @PostMapping("/trucks/{truckId}/tags/{tagId}")
    public Tag addTruckTag(Principal principal, @PathVariable Long truckId, @PathVariable Long tagId){
        // Check if truck exists
        Truck truck = truckService.findTruck(truckId).orElseThrow(ResourceNotFoundException::new);

        // Check if tag exists
        Tag tag = tagService.findTag(tagId).orElseThrow(ResourceNotFoundException::new);

        // Check if user is owner
        if (principal == null) {
            throw new UnauthorizedException();
        }
        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new);
        if (!truck.getOwner().equals(user)) {
            throw new UnauthorizedException();
        }

        return truckTagService.addTruckTag(truck, tag);
    }

    @DeleteMapping("/trucks/{truckId}/tags/{tagId}")
    public void deleteTruckTag(Principal principal, @PathVariable Long truckId, @PathVariable Long tagId){
        if (principal == null) {
            throw new UnauthorizedException();
        }

        User user = userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new);
        Truck truck = truckService.findTruck(truckId).orElseThrow(ResourceNotFoundException::new);
        Tag tag = tagService.findTag(tagId).orElseThrow(ResourceNotFoundException::new);

        if (!truck.getOwner().equals(user)) {
            throw new UnauthorizedException();
        }

        // Check if truck tag association exists
        if (truckTagService.findTruckTag(truck, tag).isEmpty()) {
            throw new ResourceNotFoundException();
        }

        truckTagService.deleteTruckTag(truck, tag);
    }
}