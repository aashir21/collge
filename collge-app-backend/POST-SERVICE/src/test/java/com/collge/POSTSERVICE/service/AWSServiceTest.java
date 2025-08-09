package com.collge.POSTSERVICE.service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.collge.POSTSERVICE.dto.PostDTO;
import com.collge.POSTSERVICE.model.PostData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AWSServiceTest {

    @Mock
    private AmazonS3 mockSpace;

    @InjectMocks
    private AWSService awsServiceUnderTest;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(awsServiceUnderTest, "DO_ACCESS_KEY", "DO00EAX6XU3288KMZDC3");
        ReflectionTestUtils.setField(awsServiceUnderTest, "DO_SECRET_KEY",
                "X9Ienx/Fyvrtio3cvJU4p14WqYzazze4VJqDCdrTYJQ");
    }

    @Test
    void testInit() {
        // Setup
        // Run the test
        awsServiceUnderTest.init();

        // Verify the results
    }

    @Test
    void testUploadFileToSpaces() throws Exception {
        // Setup
        final MultipartFile multipartFile = new MockMultipartFile("name", "content".getBytes());

        // Run the test
        awsServiceUnderTest.uploadFileToSpaces("bucketName", "directoryName", "fileName", multipartFile);

        // Verify the results
        verify(mockSpace).putObject(any(PutObjectRequest.class));
    }

    @Test
    void testUploadFileToSpaces_AmazonS3ThrowsSdkClientException() {
        // Setup
        final MultipartFile multipartFile = new MockMultipartFile("name", "content".getBytes());
        when(mockSpace.putObject(any(PutObjectRequest.class))).thenThrow(SdkClientException.class);

        // Run the test
        assertThatThrownBy(() -> awsServiceUnderTest.uploadFileToSpaces("bucketName", "directoryName", "fileName",
                multipartFile)).isInstanceOf(SdkClientException.class);
    }

    @Test
    void testUploadFileToSpaces_AmazonS3ThrowsAmazonServiceException() {
        // Setup
        final MultipartFile multipartFile = new MockMultipartFile("name", "content".getBytes());
        when(mockSpace.putObject(any(PutObjectRequest.class))).thenThrow(AmazonServiceException.class);

        // Run the test
        assertThatThrownBy(() -> awsServiceUnderTest.uploadFileToSpaces("bucketName", "directoryName", "fileName",
                multipartFile)).isInstanceOf(AmazonServiceException.class);
    }

    @Test
    void testDeleteFileFromBucket() {
        // Setup
        // Run the test
        awsServiceUnderTest.deleteFileFromBucket("bucketName", "directoryName", "fileUrl");

        // Verify the results
        verify(mockSpace).deleteObject(any(DeleteObjectRequest.class));
    }

    @Test
    void testDeleteFileFromBucket_AmazonS3ThrowsSdkClientException() {
        // Setup
        doThrow(SdkClientException.class).when(mockSpace).deleteObject(any(DeleteObjectRequest.class));

        // Run the test
        assertThatThrownBy(
                () -> awsServiceUnderTest.deleteFileFromBucket("bucketName", "directoryName", "fileUrl"))
                .isInstanceOf(RuntimeException.class);
    }

    @Test
    void testDeleteFileFromBucket_AmazonS3ThrowsAmazonServiceException() {
        // Setup
        doThrow(AmazonServiceException.class).when(mockSpace).deleteObject(any(DeleteObjectRequest.class));

        // Run the test
        assertThatThrownBy(
                () -> awsServiceUnderTest.deleteFileFromBucket("bucketName", "directoryName", "fileUrl"))
                .isInstanceOf(RuntimeException.class);
    }

    @Test
    void testConvertToPostData() {
        // Setup
        final PostDTO PostDTO = com.collge.POSTSERVICE.dto.PostDTO.builder()
                .userId(0L)
                .universityId(0)
                .caption("caption")
                .build();

        // Run the test
        final PostData result = awsServiceUnderTest.convertToPostData(PostDTO, List.of("value"), "postType");

        // Verify the results
    }
}
