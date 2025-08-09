package com.collge.POSTSERVICE.config;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoCollection;
import org.bson.Document;

@ChangeLog(order = "002")
public class DatabaseChangelogRollback {

    @ChangeSet(order = "001", id = "removeUserLikesAndDislikes", author = "aashir")
    public void removeUserLikesAndDislikes(MongoDatabase db) {
        MongoCollection<Document> collection = db.getCollection("posts");

        collection.updateMany(
                new Document(), // Empty filter to match all documents
                new Document("$unset", new Document("user_likes", "").append("user_dislikes", ""))
        );
    }

    @ChangeSet(order = "002", id = "removeUserLikesAndDislikesFromComments", author = "aashir")
    public void removeUserLikesAndDislikesFromComments(MongoDatabase db) {
        MongoCollection<Document> collection = db.getCollection("comments");

        collection.updateMany(
                new Document(), // Empty filter to match all documents
                new Document("$unset", new Document("user_likes", "").append("user_dislikes", ""))
        );
    }
}
