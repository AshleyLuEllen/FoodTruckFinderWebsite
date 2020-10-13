package food.truck.api.data.schedule;

import food.truck.api.data.truck.Truck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

    public Schedule createSchedule(Schedule schedule, Truck truckId) {
        schedule.setTruck(truckId);
        return scheduleRepository.save(schedule);
    }
}

