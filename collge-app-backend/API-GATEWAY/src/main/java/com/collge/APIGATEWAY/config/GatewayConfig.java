package com.collge.APIGATEWAY.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

        @Autowired
        private AuthenticationFilter filter;

        @Bean
        public RouteLocator routes(RouteLocatorBuilder builder) {
                return builder.routes()
                                .route("UNIVERSITY-SERVICE", r -> r.path("/api/v1/university/**")
                                                .uri("lb://UNIVERSITY-SERVICE"))
                                .route("USER-SERVICE", r -> r.path("/api/v1/auth/**")
                                                .uri("lb://USER-SERVICE"))
                                .route("USER-SERVICE", r -> r.path("/api/v1/user/**")
                                                .uri("lb://USER-SERVICE"))
                                .route("USER-SERVICE", r -> r.path("/api/v1/otp/**")
                                                .uri("lb://USER-SERVICE"))
                                .route("USER-SERVICE", r -> r.path("/api/v1/friend/**")
                                                .filters(f -> f.filters(filter))
                                                .uri("lb://USER-SERVICE"))
                                .route("SEARCH-SERVICE", r -> r.path("/api/v1/search/**")
                                                .uri("lb://SEARCH-SERVICE"))
                                .route("POST-SERVICE", r -> r.path("/api/v1/post/**")
                                                .filters(f -> f.filters(filter))
                                                .uri("lb://POST-SERVICE"))
                                .route("POST-SERVICE", r -> r.path("/api/v1/home/**")
                                                .filters(f -> f.filters(filter))
                                                .uri("lb://POST-SERVICE"))
                                .route("POST-SERVICE", r -> r.path("/api/v1/comment/**")
                                                .filters(f -> f.filters(filter))
                                                .uri("lb://POST-SERVICE"))
                                .route("POST-SERVICE", r -> r.path("/api/v1/reply/**")
                                                .filters(f -> f.filters(filter))
                                                .uri("lb://POST-SERVICE"))
                                .route("NOTIFICATION-SERVICE", r -> r.path("/api/v1/notification/**")
                                                .filters(f -> f.filters(filter))
                                                .uri("lb://NOTIFICATION-SERVICE"))
                                .route("NOTIFICATION-SERVICE", r -> r.path("/api/v1/notificationToken/**")
                                                .filters(f -> f.filters(filter))
                                                .uri("lb://NOTIFICATION-SERVICE"))
                                .route("ADMIN-SERVICE", r -> r.path("/api/v1/userInterest/**")
                                                .uri("lb://ADMIN-SERVICE"))
                                .route("ADMIN-SERVICE", r -> r.path("/api/v1/admin/verify/**")
                                                .uri("lb://ADMIN-SERVICE"))
                                .route("ADMIN-SERVICE", r -> r.path("/api/v1/admin/report/**")
                                                .filters(f -> f.filters(filter))
                                                .uri("lb://ADMIN-SERVICE"))
                                .route("POST-SERVICE", r -> r.path("/api/v1/linkup/**")
                                                .filters(f -> f.filters(filter))
                                                .uri("lb://POST-SERVICE"))
                                .route("POST-SERVICE", r -> r.path("/api/v1/data/chat/getMediaThumbnail")
                                                .uri("lb://POST-SERVICE"))
                                .route("POST-SERVICE", r -> r.path("/api/v1/data/user/getPostCount")
                                                .uri("lb://POST-SERVICE"))
                                .route("USER-SERVICE", r -> r.path("/api/v1/user/chat/**")
                                                .uri("lb://USER-SERVICE"))
                                .route("CHAT-SERVICE", r -> r.path("/api/v1/chat/**")
                                                .uri("lb://CHAT-SERVICE"))
                                .route("CHAT-SERVICE", r -> r.path("/api/v1/app/**")
                                                .uri("lb://CHAT-SERVICE"))
                                .route("POST-SERVICE", r -> r.path("/api/v1/user/post/**")
                                                .uri("lb://POST-SERVICE"))
                                .route("NEARBY-SERVICE", r -> r.path("/api/v1/nearby/**")
                                                .filters(f -> f.filters(filter))
                                                .uri("lb://NEARBY-SERVICE"))
                                .route("USER-SERVICE", r -> r.path("/api/v1/profile/**")
                                                .filters(f -> f.filters(filter))
                                                .uri("lb://USER-SERVICE"))
                                .build();
        }
}
