package food.truck.api.data.search;

import food.truck.api.data.location.Location;
import food.truck.api.data.tag.Tag;
import lombok.Data;

import java.util.List;

@Data
public class SearchQuery {
   public String truckName;

   public List<Tag> tagFilters;

   public Double ratingMin;

   public Location location;
   public Double maxDistanceFromLocation;
}
