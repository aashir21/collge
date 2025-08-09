package org.collge.universityservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;

@SpringBootApplication
@EnableDiscoveryClient
public class UniversityServiceApplication {

    @LoadBalanced
    public static void main(String[] args) {
        SpringApplication.run(UniversityServiceApplication.class, args);
    }

}
