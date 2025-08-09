package com.collge.CHAT_SERVICE.config;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

@ChangeLog(order = "001")
public class DatabaseChangelogRollback {

    @ChangeSet(order = "001", id = "removePostId", author = "aashir")
    public void removePostId(MongoDatabase db) {
        MongoCollection<Document> collection = db.getCollection("chats");

        collection.updateMany(
                new Document(), // Empty filter to match all documents
                new Document("$unset", new Document("chats", "").append("chats", ""))
        );
    }

}
