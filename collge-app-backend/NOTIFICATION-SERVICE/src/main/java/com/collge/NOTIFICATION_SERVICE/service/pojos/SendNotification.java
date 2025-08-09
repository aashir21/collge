package com.collge.NOTIFICATION_SERVICE.service.pojos;

import com.collge.NOTIFICATION_SERVICE.dto.CreateNotificationDTO;
import com.collge.NOTIFICATION_SERVICE.dto.GetUserPostDataDTO;
import com.collge.NOTIFICATION_SERVICE.repository.UserRepository;
import com.collge.NOTIFICATION_SERVICE.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import com.google.gson.Gson;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class SendNotification {

    @Autowired
    private UserRepository userRepository;

    private static final String NOTIFICATION_POST_SCREEN = "/home/post/[id]";
    private static final String NOTIFICATION_ACTOR_PROFILE_PAGE = "/(tabs)/home/user/[id]";

    private static final String NOTIFICATION_DEFAULT_SCREEN = "/(tabs)/home/notifications/forYou";

    private static final String CHAT_SCREEN = "/chat/home";

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationService.class);

    private String createJsonMessage(List<String> tokens, NotificationData notificationData) {
        Gson gson = new Gson();
        Map<String, Object> jsonMap = new HashMap<>();

        jsonMap.put("to", tokens);
        jsonMap.put("sound", "default");
        jsonMap.put("title", notificationData.getTitle());
        jsonMap.put("body", notificationData.getBody());

        Map<String, Object> data = new HashMap<>();
        data.put("route", notificationData.getNotificationScreenData().getScreenName());

        Map<String, Object> params = new HashMap<>();
        params.put("actorId", notificationData.getNotificationScreenData().getActorId());
        params.put("username", notificationData.getNotificationScreenData().getUsername());
        params.put("commentId", notificationData.getNotificationScreenData().getCommentId());
        params.put("recipientId", notificationData.getNotificationScreenData().getRecipientId());
        params.put("postId", notificationData.getNotificationScreenData().getPostId());
        params.put("notificationType", notificationData.getNotificationScreenData().getNotificationType());
        data.put("params", params);

        jsonMap.put("data", data);
        jsonMap.put("ttl", 86400);

        return gson.toJson(jsonMap);
    }
    public void sendNotificationToUser(List<String> tokens, CreateNotificationDTO createNotificationDTO) {
        NotificationData notificationData = checkNotificationType(createNotificationDTO);

        try {
            URL url = new URL("https://exp.host/--/api/v2/push/send");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Accept-encoding", "gzip, deflate");
            connection.setRequestProperty("Content-Type", "application/json; charset=utf-8");
            connection.setDoOutput(true);

            // Generate the JSON message string
            String jsonMessage = createJsonMessage(tokens, notificationData);

            // Write the JSON message to the request body
            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonMessage.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            // Check the response code
            int responseCode = connection.getResponseCode();
            String responseBody = connection.getResponseMessage();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                LOGGER.info("Notification sent successfully.");
            } else {
                LOGGER.info("Failed to send notification. Response Message: " + responseBody);
            }

            connection.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private NotificationData checkNotificationType(CreateNotificationDTO createNotificationDTO){

        NotificationData notificationData = new NotificationData();
        NotificationScreenData notificationScreenData = new NotificationScreenData();

        GetUserPostDataDTO actorDetails = userRepository.getUserPostDataById(createNotificationDTO.getActorId());

        String notificationMessage = createNotificationDTO.getMessage();
        String notificationType = createNotificationDTO.getNotificationType();

        Long receiverId = createNotificationDTO.getUserIds().get(0);

        int randomIndex = (int) (Math.random() * 3);

        notificationData.setTitle("Collge");

        switch (notificationType){

            case "NEW_COMMENT":
                notificationData.setBody(actorDetails.getUsername() + " commented on your post: " + notificationMessage.trim());
                notificationScreenData.setScreenName(NOTIFICATION_POST_SCREEN);
                notificationScreenData.setNotificationType("NEW_COMMENT");
                notificationScreenData.setUsername(actorDetails.getUsername());
                notificationScreenData.setPostId(createNotificationDTO.getPostId());
                break;
            case "NEW_REPLY":
                notificationData.setBody(actorDetails.getUsername() + " replied to your comment: " + notificationMessage.trim());
                notificationScreenData.setScreenName(NOTIFICATION_POST_SCREEN);
                notificationScreenData.setNotificationType("NEW_REPLY");
                notificationScreenData.setUsername(actorDetails.getUsername());
                notificationScreenData.setPostId(createNotificationDTO.getPostId());
                break;
            case "CHAT_MESSAGE":
                notificationData.setBody(actorDetails.getUsername() + ": " + notificationMessage.trim());
                notificationScreenData.setScreenName(CHAT_SCREEN);
                notificationData.setTitle("New Message");
                notificationScreenData.setNotificationType("CHAT_MESSAGE");
                notificationScreenData.setUsername(actorDetails.getUsername());
                notificationScreenData.setRecipientId(receiverId);
                notificationScreenData.setPostId(createNotificationDTO.getPostId());
                notificationScreenData.setActorId(createNotificationDTO.getActorId());
                break;
            case "POST_SHARE":
                notificationData.setTitle("New Message");
                notificationData.setBody(actorDetails.getUsername() + ": sent a post.");
                notificationScreenData.setScreenName(CHAT_SCREEN);
                notificationData.setTitle("New Message");
                notificationScreenData.setNotificationType("CHAT_MESSAGE");
                notificationScreenData.setRecipientId(receiverId);
                notificationScreenData.setUsername(actorDetails.getUsername());
                notificationScreenData.setPostId(createNotificationDTO.getPostId());
                notificationScreenData.setActorId(createNotificationDTO.getActorId());

                break;
            case "LINKUP_COLLAB_REQUEST":
                notificationData.setBody(actorDetails.getUsername() + " wants to collaborate on a LinkUp with you!");
                notificationScreenData.setScreenName(NOTIFICATION_DEFAULT_SCREEN);
                notificationScreenData.setNotificationType("LINKUP_COLLAB_REQUEST");
                notificationScreenData.setUsername(actorDetails.getUsername());
                notificationScreenData.setActorId(createNotificationDTO.getActorId());
                break;

            case "LINKUP_COLLAB_REQ_ACCEPTED":
                notificationData.setBody(actorDetails.getUsername() + " accepted your LinkUp collaboration request!");
                notificationScreenData.setScreenName(NOTIFICATION_DEFAULT_SCREEN);
                notificationScreenData.setNotificationType("LINKUP_COLLAB_REQ_ACCEPTED");
                notificationScreenData.setUsername(actorDetails.getUsername());
                notificationScreenData.setActorId(createNotificationDTO.getActorId());
                break;

            case "LINKUP_COLLAB_REQ_REJECTED":
                notificationData.setBody(actorDetails.getUsername() + " rejected your LinkUp collaboration request.");
                notificationScreenData.setScreenName(NOTIFICATION_DEFAULT_SCREEN);
                notificationScreenData.setNotificationType("LINKUP_COLLAB_REQ_REJECTED");
                notificationScreenData.setUsername(actorDetails.getUsername());
                notificationScreenData.setActorId(createNotificationDTO.getActorId());
                break;
            case "FRIEND_REQUEST":
                notificationData.setBody(actorDetails.getUsername() + " sent you a friend request");
                notificationScreenData.setScreenName(NOTIFICATION_ACTOR_PROFILE_PAGE);
                notificationScreenData.setNotificationType("FRIEND_REQUEST");
                notificationScreenData.setUsername(actorDetails.getUsername());
                notificationScreenData.setActorId(createNotificationDTO.getActorId());
                break;

            case "ACCEPTED_FRIEND_REQUEST":
                notificationData.setBody( actorDetails.getUsername() + " accepted your friend request");
                notificationScreenData.setScreenName(NOTIFICATION_ACTOR_PROFILE_PAGE);
                notificationScreenData.setNotificationType("ACCEPTED_FRIEND_REQUEST");
                notificationScreenData.setActorId(createNotificationDTO.getActorId());
                notificationScreenData.setUsername(actorDetails.getUsername());
                break;

            case "POST_MENTION":
                notificationData.setBody(actorDetails.getUsername() + " mentioned you in a post");
                notificationScreenData.setScreenName(NOTIFICATION_POST_SCREEN);
                notificationScreenData.setPostId(createNotificationDTO.getPostId());
                notificationScreenData.setNotificationType("POST_MENTION");
                notificationScreenData.setUsername(actorDetails.getUsername());
                break;

            case "COMMENT_MENTION":
                notificationData.setBody(actorDetails.getUsername() + " mentioned you in a comment: " + notificationMessage.trim());
                notificationScreenData.setScreenName(NOTIFICATION_POST_SCREEN);
                notificationScreenData.setPostId(createNotificationDTO.getPostId());
                notificationScreenData.setNotificationType("COMMENT_MENTION");
                notificationScreenData.setCommentId(createNotificationDTO.getCommentId());
                notificationScreenData.setUsername(actorDetails.getUsername());
                break;

            case "TAGGED":
                notificationData.setBody(actorDetails.getUsername() + " tagged you in a post");
                notificationScreenData.setScreenName(NOTIFICATION_POST_SCREEN);
                notificationScreenData.setNotificationType("TAGGED");
                notificationScreenData.setPostId(createNotificationDTO.getPostId());
                notificationScreenData.setUsername(actorDetails.getUsername());
                break;

            case "UPVOTE":
                notificationData.setBody(actorDetails.getUsername() + " up voted your post");
                notificationScreenData.setScreenName(NOTIFICATION_POST_SCREEN);
                notificationScreenData.setNotificationType("UPVOTE");
                notificationScreenData.setPostId(createNotificationDTO.getPostId());
                notificationScreenData.setUsername(actorDetails.getUsername());
                break;

            case "DOWNVOTE":
                notificationData.setBody(actorDetails.getUsername() + " down voted your post");
                notificationScreenData.setScreenName(NOTIFICATION_POST_SCREEN);
                notificationScreenData.setNotificationType("DOWNVOTE");
                notificationScreenData.setPostId(createNotificationDTO.getPostId());
                notificationScreenData.setUsername(actorDetails.getUsername());
                break;

            case "PROFILE_VISIT":
                notificationData.setBody(profileVisitMessages[randomIndex]);
                notificationScreenData.setScreenName(NOTIFICATION_ACTOR_PROFILE_PAGE);
                notificationScreenData.setNotificationType("PROFILE_VISIT");
                notificationScreenData.setActorId(createNotificationDTO.getActorId());
                notificationScreenData.setUsername(actorDetails.getUsername());
                break;

            case "WINK":
                notificationData.setBody(winkMessages[randomIndex]);
                notificationScreenData.setScreenName(NOTIFICATION_ACTOR_PROFILE_PAGE);
                notificationScreenData.setNotificationType("WINK");
                notificationScreenData.setActorId(createNotificationDTO.getActorId());
                notificationScreenData.setUsername(actorDetails.getUsername());
                break;

            case "LINKUP_INTEREST":
                notificationData.setBody(linkUpInterest[randomIndex]);
                notificationScreenData.setScreenName(NOTIFICATION_ACTOR_PROFILE_PAGE);
                notificationScreenData.setNotificationType("LINKUP_INTEREST");
                notificationScreenData.setActorId(createNotificationDTO.getActorId());
                notificationScreenData.setUsername(actorDetails.getUsername());
                break;

            case "LINKUP_ACCEPTED":
                notificationData.setBody(linkUpAccepted[randomIndex]);
                notificationScreenData.setScreenName(NOTIFICATION_ACTOR_PROFILE_PAGE);
                notificationScreenData.setNotificationType("LINKUP_ACCEPTED");
                notificationScreenData.setActorId(createNotificationDTO.getActorId());
                notificationScreenData.setUsername(actorDetails.getUsername());
                break;
            case "NEARBY":
                notificationData.setBody(actorDetails.getUsername() + " found you using Nearby!");
                notificationScreenData.setScreenName(NOTIFICATION_ACTOR_PROFILE_PAGE);
                notificationScreenData.setNotificationType("NEARBY");
                notificationScreenData.setActorId(createNotificationDTO.getActorId());
                notificationScreenData.setUsername(actorDetails.getUsername());
                break;
        }

        notificationData.setNotificationScreenData(notificationScreenData);

        return notificationData;
    }

    // IF YOU ADD MORE NOTIFICATION MESSAGES THEN ENSURE THAT
    // EVERY ARRAY HAS THE SAME NUMBER OF MESSAGES OTHERWISE
    // THE FUNCTION CAN THROW A NULL POINTER EXCEPTION.
    private static final String[] profileVisitMessages = new String[]{
            "Your profile just got a visit from a friendly face.",
            "A curious mind is exploring your profile.",
            "Your profile just got a visit from a potential new BFF."
    };

    private static final String[] winkMessages = new String[]{
            "A wink has been sent your way! Are you ready to decode it?",
            "A new friend has winked at you! Say hello!",
            "You got winked!",
    };

    private static final String[] linkUpInterest = new String[]{
            "A new hangout buddy is on board!",
            "Hey, your Link Up post caught someone’s eye! They’re interested!",
            "Someone wants to Link Up. Beginning of something special?"
    };

    private static final String[] linkUpAccepted = new String[]{
            "It's a yes! Get ready!",
            "You made the cut! Get ready for some serious fun at the hangout!",
            "You got the green light for the hangout! Excitement level: 100%!"
    };

}
