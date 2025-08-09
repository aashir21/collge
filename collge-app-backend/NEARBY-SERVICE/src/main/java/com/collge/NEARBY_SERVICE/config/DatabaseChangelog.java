package com.collge.NEARBY_SERVICE.config;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.util.ArrayList;

@ChangeLog(order = "001")
public class DatabaseChangelog {

    @ChangeSet(order = "001", id = "addIsDiscoverable", author = "aashir")
    public void addIsDiscoverable(MongoDatabase db) {
        MongoCollection<Document> collection = db.getCollection("locations");

        collection.find().forEach(document -> {
            document.append("isDiscoverable", true);

            collection.replaceOne(new Document("_id", document.getObjectId("_id")), document);
        });
    }

}
