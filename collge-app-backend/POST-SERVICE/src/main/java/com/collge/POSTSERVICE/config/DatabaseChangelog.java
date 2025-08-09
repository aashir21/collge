package com.collge.POSTSERVICE.config;
import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import com.mongodb.client.MongoCollection;

import java.util.ArrayList;

@ChangeLog(order = "001")
public class DatabaseChangelog {

    @ChangeSet(order = "001", id = "addUserLikesAndDislikes", author = "aashir")
    public void addUserLikesAndDislikes(MongoDatabase db) {
        MongoCollection<Document> collection = db.getCollection("posts");

        collection.find().forEach(document -> {
            document.append("user_likes", new ArrayList<Document>());
            document.append("user_dislikes", new ArrayList<Document>());

            collection.replaceOne(new Document("_id", document.getObjectId("_id")), document);
        });
    }

    @ChangeSet(order = "002", id = "addUserLikesAndDislikesToComments", author = "aashir")
    public void addUserLikesAndDislikesToComments(MongoDatabase db) {
        MongoCollection<Document> collection = db.getCollection("comments");

        collection.find().forEach(document -> {
            document.append("user_likes", new ArrayList<Document>());
            document.append("user_dislikes", new ArrayList<Document>());

            collection.replaceOne(new Document("_id", document.getObjectId("_id")), document);
        });
    }

    @ChangeSet(order = "003", id = "addIsPostGlobalFlag", author = "aashir")
    public void addIsPostGlobalFlag(MongoDatabase db) {
        MongoCollection<Document> collection = db.getCollection("posts");

        collection.find().forEach(document -> {
            document.append("isGlobal", true);
            collection.replaceOne(new Document("_id", document.getObjectId("_id")), document);
        });
    }

    @ChangeSet(order = "004", id = "addIsPostGlobalFlagToTrueByDefault", author = "aashir")
    public void addIsPostGlobalFlagToTrueByDefault(MongoDatabase db) {
        MongoCollection<Document> collection = db.getCollection("posts");

        collection.find().forEach(document -> {
            document.append("isGlobal", true);
            collection.replaceOne(new Document("_id", document.getObjectId("_id")), document);
        });
    }

    @ChangeSet(order = "005", id = "addMediaThumbnail", author = "aashir")
    public void addMediaThumbnail(MongoDatabase db) {
        MongoCollection<Document> collection = db.getCollection("posts");

        collection.find().forEach(document -> {
            document.append("mediaThumbnail", "");
            collection.replaceOne(new Document("_id", document.getObjectId("_id")), document);
        });
    }

}
