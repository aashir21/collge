package com.collge.ADMIN_SERVICE.service;


import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.amazonaws.services.s3.model.DeleteObjectRequest;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AWSService {

    private AmazonS3 space;

    @Value("${do.spaces.accessKey}")
    private String DO_ACCESS_KEY;

    @Value("${do.spaces.secretKey}")
    private String DO_SECRET_KEY;


    @PostConstruct
    protected void init() {

        AWSCredentialsProvider awsCredentialsProvider = new AWSStaticCredentialsProvider(
                new BasicAWSCredentials(DO_ACCESS_KEY, DO_SECRET_KEY)
        );

        this.space = AmazonS3ClientBuilder
                .standard()
                .withCredentials(awsCredentialsProvider)
                .withEndpointConfiguration(
                        new AwsClientBuilder.EndpointConfiguration("https://ams3.digitaloceanspaces.com", "ams3")
                )
                .build();

    }

    public void uploadFileToSpaces(String bucketName, String directoryName, String fileName, MultipartFile multipartFile) throws IOException {
        // Convert MultipartFile to a File or to a byte array to support retries
        File tempFile = Files.createTempFile("upload-", ".tmp").toFile();
        multipartFile.transferTo(tempFile);

        if (!directoryName.endsWith("/")) {
            directoryName += "/";
        }

        String key = directoryName + fileName;

        try (InputStream inputStream = new FileInputStream(tempFile)) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(multipartFile.getSize());
            metadata.setContentType(multipartFile.getContentType());

            // Set the Canned ACL as needed
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, key, inputStream, metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead);

            space.putObject(putObjectRequest);
        } finally {
            // Clean up the temporary file
            if (tempFile.exists()) {
                tempFile.delete();
            }
        }
    }

    public void deleteFileFromBucket(String bucketName, String directoryName, String fileUrl) {
        try {
            if (!directoryName.endsWith("/")) {
                directoryName += "/";
            }

            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

            String key = directoryName + fileName;
            DeleteObjectRequest deleteObjectRequest = new DeleteObjectRequest(bucketName, key);

            space.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }
}
