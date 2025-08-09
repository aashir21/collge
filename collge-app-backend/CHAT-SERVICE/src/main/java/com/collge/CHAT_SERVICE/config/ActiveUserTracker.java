package com.collge.CHAT_SERVICE.config;

import com.collge.CHAT_SERVICE.pojos.UserDataFromSocket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ActiveUserTracker {

    // In-memory map to track active users and their data
    private final Map<Long, UserDataFromSocket> activeUsers = new ConcurrentHashMap<>();

    /**
     * Mark a user as connected.
     */
    public void connectUser(UserDataFromSocket fromSocket) {
        activeUsers.put(fromSocket.getUserId(), fromSocket);
    }

    /**
     * Mark a user as disconnected.
     */
    public void disconnectUser(Long userId) {
        activeUsers.remove(userId);
    }

    /**
     * Check if a user is connected.
     */
    public boolean isUserConnected(Long userId) {
        return activeUsers.containsKey(userId);
    }

    /**
     * Set the active chat context for a user.
     */
    public void setActiveChat(Long userId, Long recipientId) {
        activeUsers.computeIfPresent(userId, (id, userData) -> {
            userData.setRecipientId(recipientId);
            return userData;
        });
    }

    public Long getActiveChat(Long userId) {
        UserDataFromSocket userData = activeUsers.get(userId);
        return userData != null ? userData.getRecipientId() : null;
    }

    public Long getUserIdByToken(String token) {
        for (Map.Entry<Long, UserDataFromSocket> entry : activeUsers.entrySet()) {
            if (token.equals(entry.getValue().getRefreshToken())) {
                return entry.getKey(); // Return the userId associated with the token
            }
        }
        return null; // Return null if no userId is found
    }


    /**
     * Get the refresh token for a user.
     */
    public String getRefreshToken(Long userId) {
        UserDataFromSocket userData = activeUsers.get(userId);
        return userData != null ? userData.getRefreshToken() : null;
    }

    /**
     * Clear the active chat context for a user.
     */
    public void clearActiveChat(Long userId) {
        activeUsers.computeIfPresent(userId, (id, userData) -> {
            // Clear additional user data if needed
            return null; // No changes here
        });
    }

    /**
     * Log active users for debugging.
     */
    public void logActiveUsers() {
        activeUsers.forEach((key, value) -> {
            System.out.println("UserId: " + key + ", RefreshToken: " + value.getRefreshToken());
        });
    }
}
