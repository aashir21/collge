package com.collge.USERSERVICE.controller;

import com.collge.USERSERVICE.service.AWSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequestMapping("/api/v1/aws")
@RestController
public class AWSController {

    @Autowired
    private AWSService awsService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFileToSpaces(@RequestParam("bucketName") String bucketName,
                                                     @RequestParam("directoryName") String directoryName,
                                                     @RequestParam("fileName") String fileName,
                                                     @RequestParam("file") MultipartFile multipartFile) {
        try {
            awsService.uploadFileToSpaces(bucketName, directoryName, fileName, multipartFile);
            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file");
        }
    }

}
