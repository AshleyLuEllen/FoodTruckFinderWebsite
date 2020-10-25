package food.truck.api.util;

public class LocationUtils {
    private static final double MEAN_RADIUS_OF_EARTH = 6371e3;
    private static final double M_TO_MI = 100.0 / 2.54 / 12.0 / 5280.0;

    public static double euclideanDistance(Location loc1, Location loc2) {
        return Math.sqrt(
            Math.pow(loc1.getLatitude() - loc2.getLatitude(), 2) +
                Math.pow(loc1.getLongitude() - loc2.getLongitude(), 2)
        );
    }

    // haversine formula (in meters)
    public static double sphericalDistance(Location loc1, Location loc2) {
        final double lat1 = Math.toRadians(loc1.getLatitude());
        final double lat2 = Math.toRadians(loc2.getLatitude());
        final double latDiff = Math.toRadians(loc2.getLatitude() - loc1.getLatitude());
        final double lonDiff = Math.toRadians(loc2.getLongitude() - loc1.getLongitude());

        final double a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
        final double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return MEAN_RADIUS_OF_EARTH * c;
    }

    public static double mToMi(double m) {
        return m * M_TO_MI;
    }
}
