package food.truck.api.endpoint;

import food.truck.api.data.user.UserService;
import food.truck.api.endpoint.error.ResourceNotFoundException;
import food.truck.api.security.AuthenticationBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class AuthEndpoint {
    @Autowired
    private UserService userService;

    @GetMapping(path = "/basicauth")
    public AuthenticationBean authenticate(Principal principal) {
        return new AuthenticationBean("You are authenticated", userService.findUserByEmailAddress(principal.getName()).orElseThrow(ResourceNotFoundException::new));
    }
}
