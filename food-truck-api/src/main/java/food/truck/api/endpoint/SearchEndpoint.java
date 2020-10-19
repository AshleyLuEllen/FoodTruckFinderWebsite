package food.truck.api.endpoint;

import food.truck.api.data.search.SearchQuery;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckService;
import food.truck.api.endpoint.error.NotImplementedException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@Log4j2
@RestController
public class SearchEndpoint {
    @Autowired
    private TruckService truckService;

    @GetMapping("/search")
    public List<Truck> search(@RequestBody SearchQuery searchObj, Principal principal) {
       throw new NotImplementedException();
    }

    @GetMapping("/recommendations")
    public List<Truck> recommendations(@RequestBody SearchQuery searchObj, Principal principal) {
       throw new NotImplementedException();
    }
}
