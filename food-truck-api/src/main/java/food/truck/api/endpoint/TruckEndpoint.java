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
import java.util.Objects;

@Log4j2
@RestController
public class TruckEndpoint {
    @Autowired
    private TruckService truckService;

    @GetMapping("/truck/{id}")
    public Truck findTruckById(@PathVariable Long id) {
        return truckService.findTruck(id).orElseThrow(ResourceNotFoundException::new);
    }

    @PostMapping("/createtruck")
    public Truck createTruck(@RequestBody Truck truck) {
        return truckService.createTruck(truck);
    }

    @DeleteMapping("/deletetruck")
    public void deleteTruck(@RequestBody long truckid) {
        truckService.deleteTruck(truckid);
    }

    @PostMapping("/savetruck")
    public Truck saveTruck(@RequestBody Truck truck) {
        return truckService.saveTruck(truck);
    }
}
