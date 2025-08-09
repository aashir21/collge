package com.collge.CHAT_SERVICE.repository;

import com.collge.CHAT_SERVICE.model.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    @Query("{chatId :  ?0}")
    Page<ChatMessage> findByChatId(String chatId, Pageable pageable);

}
