package com.collge.CHAT_SERVICE.config;

import feign.RequestInterceptor;
import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;

public class WebSocketFeignConfig {

    private static final String AUTHORIZATION_HEADER = "Authorization";

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            // Use a thread-safe storage (like ThreadLocal or directly pass headers) instead of RequestContextHolder
            String authorizationHeader = AuthorizationContextHolder.getAuthorizationHeader(); // Implement this

            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                requestTemplate.header(AUTHORIZATION_HEADER, authorizationHeader);
            } else {
                throw new RuntimeException("Authorization header is missing or invalid");
            }
        };
    }

}
