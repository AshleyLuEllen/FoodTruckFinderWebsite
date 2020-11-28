package food.truck.api.security;

import com.google.common.base.MoreObjects;

public class SecurityConstants {
    public static final String SECRET = MoreObjects.firstNonNull(System.getenv("JWT_SECRET"), "food-truck-finder-se2-group-1");
    public static final long EXPIRATION_TIME = 864_000_000; // 10 days
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
}
