package food.truck.api.endpoint;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import food.truck.api.data.user.UserService;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.recommendations.RecommendationService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
public class RecommendationEndpoint {
    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private UserService userService;

    @GetMapping("/users/{userId}/recommendations")
    public List<Truck> getUserRecommendations(@PathVariable Long userId) {
        User user = userService.findUser(userId).orElseThrow(ResourceNotFoundException::new);

        return recommendationService.getRecommendationsForUser(user);
    }
}