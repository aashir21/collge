package com.collge.POSTSERVICE.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignClientConfig {


    @Bean
    public RequestInterceptor requestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate requestTemplate) {
                // Add Authorization header
                String token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGkiLCJpYXQiOjE3MzMwNjc0NTYsImV4cCI6MTczODI1MTQ1Nn0.SQ4kzMWbRKJQEh2j9oIgd9UyHJYpBKCmYDRbZFUUxsg"; // Replace with a token retrieval logic
                requestTemplate.header("Authorization", token);
            }
        };
    }

}
