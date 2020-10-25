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
    List<Tag> getTruckTags(@PathVariable Long truckId){
        // Check if truck exists
        Optional<Truck> truckOpt = truckService.findTruck(truckId);
        if (truckOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        return truckTagService.findTruckTags(truckOpt.get());
    }

    @PostMapping("/trucks/{truckId}/tags/{tagId}")
    Tag addTruckTag(@PathVariable Long truckId, @PathVariable Long tagId, Principal principal){
        // Check if truck exists
        Optional<Truck> truckOpt = truckService.findTruck(truckId);
        if (truckOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        // Check if tag exists
        Optional<Tag> tagOpt = tagService.findTag(tagId);
        if (tagOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        // Check if user is owner
        if (principal == null) {
            throw new UnauthorizedException();
        }
        Optional<User> userOpt = userService.findUserByEmailAddress(principal.getName());
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }
        if (!truckOpt.get().getOwner().equals(userOpt.get())) {
            throw new UnauthorizedException();
        }

        return truckTagService.addTruckTag(truckOpt.get(), tagOpt.get());
    }

    @DeleteMapping("/trucks/{truckId}/tags/{tagId}")
    void deleteTruckTag(@PathVariable Long truckId, @PathVariable Long tagId, Principal principal){
        // Check if truck exists
        Optional<Truck> truckOpt = truckService.findTruck(truckId);
        if (truckOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        // Check if tag exists
        Optional<Tag> tagOpt = tagService.findTag(tagId);
        if (tagOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        // Check if user is owner
        if (principal == null) {
            throw new UnauthorizedException();
        }
        Optional<User> userOpt = userService.findUserByEmailAddress(principal.getName());
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException();
        }
        if (!truckOpt.get().getOwner().equals(userOpt.get())) {
            throw new UnauthorizedException();
        }

        // Check if truck tag association exists
        if (truckTagService.findTruckTag(truckOpt.get(), tagOpt.get()).isEmpty()) {
            throw new ResourceNotFoundException();
        }

        truckTagService.deleteTruckTag(truckOpt.get(), tagOpt.get());
    }
}