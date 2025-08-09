package com.collge.ADMIN_SERVICE.config;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.util.ArrayList;

@ChangeLog(order = "001")
public class DatabaseChangelog {

    @ChangeSet(order = "001", id = "addRejectionReasons", author = "aashir")
    public void addRejectionReasons(MongoDatabase db) {
        MongoCollection<Document> collection = db.getCollection("verifications");

        collection.find().forEach(document -> {
            document.append("rejection_reasons", new ArrayList<String>());

            collection.replaceOne(new Document("_id", document.getObjectId("_id")), document);
        });
    }

}
