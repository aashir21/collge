package com.collge.NEARBY_SERVICE;

import com.github.cloudyrock.spring.v5.EnableMongock;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableFeignClients
@EnableDiscoveryClient
@EnableMongoRepositories(basePackages = "com.collge.NEARBY_SERVICE.repository")
@EnableMongock
public class NearbyServiceApplication {

	@LoadBalanced
	public static void main(String[] args) {
		SpringApplication.run(NearbyServiceApplication.class, args);
	}

}
