package com.collge.APIGATEWAY.config;

import com.collge.APIGATEWAY.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class AuthenticationFilter implements GatewayFilter {

    @Autowired
    private RouteValidator validator;

    @Autowired
    private JWTService jwtUtils;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        List<String> authorizationHeaders = exchange.getRequest().getHeaders().getOrEmpty("Authorization");
        String token = authorizationHeaders.isEmpty() ? null : authorizationHeaders.get(0).substring(7);

        if (token != null && jwtUtils.validateToken(token)) {
            return chain.filter(exchange);  // Token is valid, proceed with the request
        } else {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();  // Stop the request here
        }
    }

    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }

    private boolean authMissing(ServerHttpRequest request) {
        return !request.getHeaders().containsKey("Authorization");
    }
}
