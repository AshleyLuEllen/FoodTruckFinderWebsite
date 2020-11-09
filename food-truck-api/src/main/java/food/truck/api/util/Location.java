package food.truck.api.util;

import food.truck.api.data.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    private Double latitude;
    private Double longitude;

    public static Location fromUser(User user) {
        return new Location(user.getLatitude(), user.getLongitude());
    }
}
