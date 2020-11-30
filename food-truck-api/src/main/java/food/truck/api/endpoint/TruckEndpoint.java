package food.truck.api.endpoint;

import food.truck.api.data.review.Review;
import food.truck.api.data.review.ReviewService;
import food.truck.api.data.tag.Tag;
import food.truck.api.data.tag.TagService;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.data.truck_tag.TruckTagRepository;
import food.truck.api.data.truck_tag.TruckTagService;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import food.truck.api.endpoint.error.BadRequestException;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import lombok.Data;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@RestController
public class TruckEndpoint {
    @Autowired
    private TruckService truckService;

    @Autowired
    private UserService userService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private TruckTagService truckTagService;

    @Autowired
    private TagService tagService;

    @DeleteMapping("/trucks/{id}")
    public ResponseEntity<String> deleteTruck(Principal principal, @PathVariable long id) {
        // Get the owner email
        if (principal == null) {
            throw new UnauthorizedException();
        }

        Optional<Truck> thisTruck = truckService.findTruck(id);

        if (thisTruck.isEmpty()){
            throw new UnauthorizedException();
        }

        List<Review> reviews = reviewService.getReviewsByTruck(thisTruck.get());
        for(Review r : reviews) {
            reviewService.deleteReview(r.getId());
        }

        // Get me user
        Optional<User> meUser = userService.findUserByEmailAddress(principal.getName());
        if (meUser.isEmpty()) {
            throw new UnauthorizedException();
        }



        if (!meUser.get().getId().equals(thisTruck.get().getOwner().getId())) {
            throw new UnauthorizedException();
        }

        try {
            truckService.deleteTruck(id);
        } catch (Exception e) {
            return new ResponseEntity<>("Fail to delete: " + e.getMessage(), HttpStatus.EXPECTATION_FAILED);
        }

        return new ResponseEntity<>("Truck has been deleted!", HttpStatus.OK);
    }

    @PostMapping("/trucks")
    public Truck createTruck(Principal principal, @RequestBody Truck truck) {
        // Get the owner email
        if (principal == null) {
            throw new UnauthorizedException();
        }

        // Get me user
        Optional<User> meUser = userService.findUserByEmailAddress(principal.getName());
        if (meUser.isEmpty()) {
            throw new UnauthorizedException();
        }

        return truckService.createTruck(truck, meUser.get());
    }

    @GetMapping("/trucks/{id}")
    public Truck findTruckById(@PathVariable Long id) {
        return truckService.findTruck(id).orElseThrow(ResourceNotFoundException::new);
    }

    @PatchMapping("/trucks/{id}")
    public Truck editTruck(Principal principal, @PathVariable Long id, @RequestBody Truck truck) {
        Truck dbTruck = truckService.findTruck(id).orElseThrow(ResourceNotFoundException::new);

        // Get the owner email
        if (principal == null) {
            throw new UnauthorizedException();
        }

        // Get me user
        Optional<User> meUser = userService.findUserByEmailAddress(principal.getName());
        if (meUser.isEmpty() || !Objects.equals(dbTruck.getOwner().getId(), meUser.get().getId())) {
            throw new UnauthorizedException();
        }

        if (!truck.getId().equals(id)) {
            throw new BadRequestException("IDs don't match");
        }

        dbTruck.setName(truck.getName());
        dbTruck.setDescription(truck.getDescription());
        dbTruck.setLicensePlate(truck.getLicensePlate());

        return truckService.saveTruck(dbTruck);
    }

    @Data
    static class TagList {
        List<Long> tags;
    }

    @PutMapping("/trucks/{id}/tags")
    public Truck editTruckTags(Principal principal, @PathVariable Long id, @RequestBody TagList tags) {
        Truck dbTruck = truckService.findTruck(id).orElseThrow(ResourceNotFoundException::new);

        // Get the owner email
        if (principal == null) {
            throw new UnauthorizedException();
        }

        // Get me user
        Optional<User> meUser = userService.findUserByEmailAddress(principal.getName());
        if (meUser.isEmpty() || !Objects.equals(dbTruck.getOwner().getId(), meUser.get().getId())) {
            throw new UnauthorizedException();
        }

        truckTagService.deleteAll(dbTruck);
        truckTagService.addAllTruckTags(dbTruck, tags.tags.stream().map(tid -> tagService.findTag(tid).orElse(null)).filter(Objects::nonNull).collect(Collectors.toList()));

        return truckService.saveTruck(dbTruck);
    }

    @GetMapping("/users/{userID}/trucks")
    public List<Truck> findUserOwnedTrucks(@PathVariable Long userID) {
        Optional<User> user = userService.findUser(userID);

        if (user.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        return truckService.getTrucksOwnedByUser(user.get());
    }
}
