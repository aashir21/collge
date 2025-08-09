package com.collge.APIGATEWAY.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig_V2 {

    @Autowired
    private AuthenticationFilter filter;

    @Bean(name = "API_VERSION_2")
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("POST-SERVICE", r -> r.path("/api/v2/comment/**")
                        .filters(f -> f.filters(filter))
                        .uri("lb://POST-SERVICE"))
                .route("POST-SERVICE", r -> r.path("/api/v2/reply/**")
                        .filters(f -> f.filters(filter))
                        .uri("lb://POST-SERVICE"))
                .route("POST-SERVICE", r -> r.path("/api/v2/post/**")
                        .filters(f -> f.filters(filter))
                        .uri("lb://POST-SERVICE"))
                .route("NOTIFICATION-SERVICE", r -> r.path("/api/v2/notification/**")
                        .filters(f -> f.filters(filter))
                        .uri("lb://NOTIFICATION-SERVICE"))
                .route("SEARCH-SERVICE", r -> r.path("/api/v2/search/**")
                        .uri("lb://SEARCH-SERVICE"))

                .build();
    }

}
