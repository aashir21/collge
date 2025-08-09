package com.collge.CHAT_SERVICE.config;

import com.collge.CHAT_SERVICE.model.ChatMessage;
import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.util.ArrayList;

@ChangeLog(order = "001")
public class DatabaseChangelog {

    @ChangeSet(order = "001", id = "addPostId", author = "aashir")
    public void addPostId(MongoDatabase db) {
        MongoCollection<Document> collection = db.getCollection("chat-message");

        collection.find().forEach(document -> {
            document.append("postId", null);
            collection.replaceOne(new Document("_id", document.getObjectId("_id")), document);
        });
    }

}
