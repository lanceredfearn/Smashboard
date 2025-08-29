package com.example.smashboard;

import com.example.smashboard.service.DatabaseSeeder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SmashboardApplication {
    private final DatabaseSeeder seeder;

    public SmashboardApplication(DatabaseSeeder seeder) {
        this.seeder = seeder;
    }

    public static void main(String[] args) {
        SpringApplication.run(SmashboardApplication.class, args);
    }

    @Bean
    CommandLineRunner runSeeder() {
        return args -> seeder.seed();
    }
}
