package food.truck.api.endpoint;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.endpoint.error.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import lombok.extern.log4j.Log4j2;
import java.security.Principal;
import java.security.Provider;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
<<<<<<< HEAD
=======
import java.util.Objects;
>>>>>>> origin/owner

@Log4j2
@RestController
public class TruckEndpoint {
    @Autowired
    private TruckService truckService;

    @Autowired
    private UserService userService;

    @DeleteMapping("/deletetruck")
    public void deleteTruck(Principal principal, @RequestBody long truckid) {
        // Get the owner email
        if (principal == null) {
            throw new UnauthorizedException();
        }
        // Get me user
        Optional<User> meUser = userService.findUserByEmailAddress(principal.getName());
        if (meUser.isEmpty()) {
            throw new UnauthorizedException();
        }
        
        truckService.deleteTruck(truckid);
    }

    @PostMapping("/createtruck")
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

    @GetMapping("/truck/{id}")
    public Truck findTruckById(@PathVariable Long id) {
        return truckService.findTruck(id).orElseThrow(ResourceNotFoundException::new);
    }
    @PostMapping("/savetruck")
    public Truck saveTruck(@RequestBody Truck truck) {
        return truckService.saveTruck(truck);
    }
}
