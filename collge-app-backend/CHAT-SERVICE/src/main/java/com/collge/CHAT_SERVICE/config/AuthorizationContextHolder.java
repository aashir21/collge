package com.collge.CHAT_SERVICE.config;

public class AuthorizationContextHolder {
    private static final ThreadLocal<String> authorizationHolder = new ThreadLocal<>();

    public static void setAuthorizationHeader(String header) {
        authorizationHolder.set(header);
    }

    public static String getAuthorizationHeader() {
        return authorizationHolder.get();
    }

    public static void clear() {
        authorizationHolder.remove();
    }
}
