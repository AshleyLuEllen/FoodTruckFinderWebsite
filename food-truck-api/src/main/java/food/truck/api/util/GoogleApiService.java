package food.truck.api.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.JSONPObject;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.NoSuchElementException;
import java.util.Objects;

@Log4j2
@Service
public class GoogleApiService {
    public static String PLACE_ID_TO_LOCATION_TEMPLATE = "https://maps.googleapis.com/maps/api/geocode/json?place_id={place_id}&key={api_key}";

    public Location getLocationFromPlaceId(String placeId) {
        if (placeId == null) return null;

        var restTemplate = new RestTemplate();

        var response = restTemplate.getForEntity(PLACE_ID_TO_LOCATION_TEMPLATE, String.class, placeId, System.getenv("GOOGLE_API_KEY"));

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            JsonNode node = objectMapper.readTree(Objects.requireNonNull(response.getBody()));

            JsonNode loc = node.get("results").elements().next().get("geometry").get("location");

            return new Location(loc.get("lat").doubleValue(), loc.get("lng").doubleValue());
        } catch (JsonProcessingException | NoSuchElementException e) {
            e.printStackTrace();
        }

        return null;
    }
}
