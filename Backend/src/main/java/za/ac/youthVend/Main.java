package za.ac.youthVend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Main application entry point.
 * EnableAsync allows asynchronous email sending to avoid blocking the main application flow.
 */
@SpringBootApplication
@EnableAsync
public class Main {

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}
