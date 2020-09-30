package food.truck.api.endpoint;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j2;

import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;

@Log4j2
@RestController
public class PingEndpoint {
    @GetMapping("/ping")
    public String ping() {
        return "pong!";
    }

    @GetMapping("/memory-ping") 
    public String memoryPing() {
        return String.format("Max available memory: %.3f MB (total: %.3f, free: %.3f)", 
            (Runtime.getRuntime().maxMemory() / (1024.0 * 1024.0)),
            (Runtime.getRuntime().totalMemory() / (1024.0 * 1024.0)),
            (Runtime.getRuntime().freeMemory() / (1024.0 * 1024.0))
        );
    }

    @GetMapping("/uptime")
    public double uptime() {
        RuntimeMXBean rb = ManagementFactory.getRuntimeMXBean();
        return rb.getUptime() / 1000.0;
    }
}