package com.collge.CHAT_SERVICE.service;

import com.collge.CHAT_SERVICE.DTO.ChatPostDTO;
import com.collge.CHAT_SERVICE.DTO.ChatTabDTO;
import com.collge.CHAT_SERVICE.DTO.NewChatMessageDTO;
import com.collge.CHAT_SERVICE.config.ActiveUserTracker;
import com.collge.CHAT_SERVICE.config.AuthorizationContextHolder;
import com.collge.CHAT_SERVICE.config.EncryptUtility;
import com.collge.CHAT_SERVICE.model.ChatMessage;
import com.collge.CHAT_SERVICE.model.ChatNotification;
import com.collge.CHAT_SERVICE.model.ChatRoom;
import com.collge.CHAT_SERVICE.repository.ChatMessageRepository;
import com.collge.CHAT_SERVICE.repository.ChatRoomRepository;
import com.collge.CHAT_SERVICE.repository.PostRepository;
import com.collge.CHAT_SERVICE.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.java.Log;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ActiveUserTracker activeUserTracker;

    private static final Logger LOGGER = LoggerFactory.getLogger(ChatMessageService.class);

    public ChatMessage save(NewChatMessageDTO newChatMessageDTO){

        var chatId = chatRoomService.getChatRoomId(newChatMessageDTO.getSenderId(),
                newChatMessageDTO.getRecipientId(),
                true).orElseThrow();

        String encryptedMessage = null;
        try{
            encryptedMessage = EncryptUtility.encrypt(newChatMessageDTO.getContent().trim());
        }catch (Exception e){
            throw new RuntimeException("Could not encrypt chat message: " + e.getMessage());
        }

        //Update the last sent time for sender
        getChatRoomAndUpdate(newChatMessageDTO.getSenderId(), newChatMessageDTO.getRecipientId());

        //Update the last sent time for receiver
        getChatRoomAndUpdate(newChatMessageDTO.getRecipientId(), newChatMessageDTO.getSenderId());

        ChatMessage chatMessage = ChatMessage.builder()
                .chatId(chatId)
                .senderId(newChatMessageDTO.getSenderId())
                .recipientId(newChatMessageDTO.getRecipientId())
                .content(encryptedMessage)
                .createdAt(LocalDateTime.now())
                .postId(newChatMessageDTO.getPostId())
                .build();

        chatMessageRepository.save(chatMessage);

        return chatMessage;
    }

    public List<ChatNotification> findChatMessagesBySenderAndRecipientId(Long senderId, Long recipientId, Integer offset, Integer pageSize){

        List<ChatNotification> convertedMessages = new ArrayList<>();

        Boolean isChatRoomPresent = chatRoomService.isChatRoomPresent(senderId,recipientId);

        var chatId = chatRoomService.getChatRoomId(senderId, recipientId, isChatRoomPresent);

        if(chatId.isEmpty()){
            return List.of();
        }

        Pageable pageable = PageRequest.of(offset, pageSize, Sort.by("createdAt").descending());
        String extractedChatId = chatId.get();

        Page<ChatMessage> messagesPage = chatMessageRepository.findByChatId(extractedChatId, pageable);
        List<ChatMessage> messages = messagesPage.getContent();

        messages.forEach((message) -> {

            ChatNotification messageToSendBack = buildChatMessage(message);
            messageToSendBack.setChatId(extractedChatId);
            convertedMessages.add(messageToSendBack);
        });

        return convertedMessages;

    }

    public ResponseEntity<?> getAllChatsByUserId(Long userId) {

        try{

            List<Long> blockedUsers = userRepository.getBlockedUsersIds(userId);

            List<ChatRoom> rooms = chatRoomRepository.findAllBySenderId(userId, blockedUsers);

            // Sort chat rooms by lastActivity before converting
            rooms.sort((room1, room2) -> room2.getLastActivity().compareTo(room1.getLastActivity()));

            List<ChatTabDTO> convertedChatRooms = convertAllChatTabsForUser(rooms);
            return new ResponseEntity<>(convertedChatRooms, HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> sharePost(NewChatMessageDTO newChatMessageDTO) {

        try{

            var chatId = chatRoomService.getChatRoomId(newChatMessageDTO.getSenderId(),
                    newChatMessageDTO.getRecipientId(),
                    true).orElseThrow();

            //Update the last sent time for sender
            getChatRoomAndUpdate(newChatMessageDTO.getSenderId(), newChatMessageDTO.getRecipientId());

            //Update the last sent time for receiver
            getChatRoomAndUpdate(newChatMessageDTO.getRecipientId(), newChatMessageDTO.getSenderId());

            ChatMessage chatMessage = ChatMessage.builder()
                    .chatId(chatId)
                    .senderId(newChatMessageDTO.getSenderId())
                    .recipientId(newChatMessageDTO.getRecipientId())
                    .content("")
                    .createdAt(LocalDateTime.now())
                    .postId(newChatMessageDTO.getPostId())
                    .build();

            chatMessageRepository.save(chatMessage);

            return new ResponseEntity<>("Sent!", HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    private List<ChatTabDTO> convertAllChatTabsForUser(List<ChatRoom> chatRooms){

        List<ChatTabDTO> convertedTabs = new ArrayList<>();

        chatRooms.forEach(room -> {

            ChatTabDTO chatTabDTO = userRepository.getUserChatData(room.getRecipientId());
            chatTabDTO.setLastActivity(room.getLastActivity());

            convertedTabs.add(chatTabDTO);

        });

        return convertedTabs;
    }

    public ChatNotification createChatMessage(ChatMessage savedMsg) {

        return buildChatMessage(savedMsg);

    }

    public ResponseEntity<?> getRecipientDetails(Long userId) {

        try{
            ChatTabDTO chatTabDTO = userRepository.getUserChatData(userId);

            return new ResponseEntity<>(chatTabDTO, HttpStatus.OK);

        }catch (Exception e){

            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    private ChatNotification buildChatMessage(ChatMessage chatMessage){

        ChatNotification newChatMessage = null;
        ChatPostDTO postData = new ChatPostDTO();
        ChatTabDTO userData = new ChatTabDTO();

        String postId = chatMessage.getPostId();

        if(postId != null){
            postData = postRepository.getMediaThumbnail(postId);
            if(postData.getUserId() != null){
                userData = userRepository.getUserChatData(postData.getUserId());
            }
        }

        String decryptedContent;
        try {
            decryptedContent = EncryptUtility.decrypt(chatMessage.getContent());
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting chat message content", e);
        }

        if(postId != null){

            newChatMessage = ChatNotification.builder()
                    .createdAt(chatMessage.getCreatedAt())
                    .messageId(chatMessage.getMessageId())
                    .senderId(chatMessage.getSenderId())
                    .recipientId(chatMessage.getRecipientId())
                    .content("")
                    .postId(chatMessage.getPostId())
                    .username(userData.getUsername())
                    .role(userData.getRole())
                    .isTextOnly(postData.getIsTextOnly())
                    .isPremiumUser(userData.isPremiumUser())
                    .avatar(userData.getAvatar())
                    .caption(postData.getCaption())
                    .mediaThumbnailUrl(postData.getMediaThumbnailUrl())
                    .isPostFound(postData.getIsPostFound())
                    .postType(postData.getPostType())
                    .build();
        }
        else{
            newChatMessage = ChatNotification.builder()
                    .createdAt(chatMessage.getCreatedAt())
                    .messageId(chatMessage.getMessageId())
                    .senderId(chatMessage.getSenderId())
                    .recipientId(chatMessage.getRecipientId())
                    .content(decryptedContent)
                    .postId(null)
                    .build();

        }

        return newChatMessage;
    }
    private void getChatRoomAndUpdate(Long senderId, Long recipientId){

        Optional<ChatRoom> optionalChatRoom = chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId);

        if(optionalChatRoom.isPresent()){

            ChatRoom chatRoom = optionalChatRoom.get();
            chatRoom.setLastActivity(LocalDateTime.now());

            chatRoomRepository.save(chatRoom);
        }

    }


}
