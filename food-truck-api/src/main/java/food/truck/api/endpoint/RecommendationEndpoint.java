package food.truck.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.security.Principal;

@Log4j2
@RestController
public class RecommendationEndpoint {
    @GetMapping("/recommendations/{userId}")
    public void getUserRecommendations(@PathVariable Long userId) {

    }
}