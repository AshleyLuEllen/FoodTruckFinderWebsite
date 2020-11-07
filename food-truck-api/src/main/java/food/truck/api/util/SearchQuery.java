package food.truck.api.util;

import food.truck.api.data.tag.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchQuery {
    String query;
    List<Tag> tags;
    String placeId;
    Location location;
    Long preferredRating;
}
