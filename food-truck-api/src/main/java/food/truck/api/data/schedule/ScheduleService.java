package food.truck.api.data.schedule;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.truck.TruckRepository;
import food.truck.api.util.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScheduleService {
    @Autowired
    private ScheduleRepository scheduleRepository;

    public Optional<Schedule> findSchedule(Long scheduleId) {
        return scheduleRepository.findById(scheduleId);
    }

    public Schedule saveSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public Schedule createSchedule(Schedule schedule, Truck truck) {
        schedule.setTruck(truck);
        return scheduleRepository.save(schedule);
    }

    public List<Schedule> findSchedulesOfTruck(Truck truck) {
        return scheduleRepository.findByTruck(truck);
    }

    public void deleteSchedule(Long scheduleId) {
        scheduleRepository.deleteById(scheduleId);
    }

    public List<Truck> getAllTrucksWithinDistanceFromLocation(Location location, double maxDistance) {
        return scheduleRepository.findAllSchedulesNearLocationAfterDate(location.getLatitude(), location.getLongitude(), maxDistance, ZonedDateTime.now()).stream()
            .map(Schedule::getTruck).distinct().collect(Collectors.toList());
    }
}
