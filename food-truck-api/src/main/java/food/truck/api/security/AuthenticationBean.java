package food.truck.api.security;

import food.truck.api.data.user.User;
import lombok.Data;

@Data
public class AuthenticationBean {
    private final String message;
    private final User user;
}