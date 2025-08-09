package com.collge.CHAT_SERVICE.service;

import com.collge.CHAT_SERVICE.model.ChatRoom;
import com.collge.CHAT_SERVICE.repository.ChatRoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    private static final Logger LOGGER = LoggerFactory.getLogger(ChatRoomService.class);

    public Optional<String> getChatRoomId(Long senderId, Long recipientId, boolean isChatRoomPresent){


        return chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId)
                .map(ChatRoom::getChatId)
                .or(() -> {
                    if(isChatRoomPresent){
                        var chatId = createChatId(senderId, recipientId);
                        return Optional.of(chatId);
                    }

                    return Optional.empty();
                });

    }

    public Boolean isChatRoomPresent(Long senderId, Long recipientId){

        Optional<ChatRoom> optionalChatRoom = chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId);
        boolean isPresent = false;

        if(optionalChatRoom.isPresent()){
            isPresent = true;
        }

        return isPresent;
    }

    private String createChatId(Long senderId, Long recipientId){


        var chatId = String.format(("%d_%d"), senderId, recipientId);

        ChatRoom senderRecipient = ChatRoom.builder()
                .chatId(chatId)
                .senderId(senderId)
                .recipientId(recipientId)
                .lastActivity(LocalDateTime.now())
                .build();

        ChatRoom recipientSender = ChatRoom.builder()
                .chatId(chatId)
                .senderId(recipientId)
                .recipientId(senderId)
                .lastActivity(LocalDateTime.now())
                .build();

        chatRoomRepository.save(senderRecipient);
        chatRoomRepository.save(recipientSender);

        return chatId;
    }

}
