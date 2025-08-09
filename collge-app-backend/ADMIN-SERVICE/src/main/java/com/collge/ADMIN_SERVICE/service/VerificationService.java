package com.collge.ADMIN_SERVICE.service;

import com.collge.ADMIN_SERVICE.dto.*;
import com.collge.ADMIN_SERVICE.model.Verification;
import com.collge.ADMIN_SERVICE.repository.NotificationRepository;
import com.collge.ADMIN_SERVICE.repository.UserRepository;
import com.collge.ADMIN_SERVICE.repository.VerificationRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.aggregation.ArrayOperators;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VerificationService {

    @Autowired
    private VerificationRepository verificationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AWSService awsService;

    public static final String LINKUP_VERIFICATION_TYPE = "LINKUP";
    public static final String APP_SIGN_UP_VERIFICATION_TYPE = "SIGN_UP";

    private static final String BUCKET_NAME = "collge-stag-bucket";
    private static final String DIRECTORY_NAME = "verification";

    private static final Logger LOGGER = LoggerFactory.getLogger(VerificationService.class);

    public ResponseEntity<?> submitVerification(String verificationDataRequest, MultipartFile[] files) {

        try {
            // Deserialize the JSON data to PostDTO
            SubmitVerificationDTO submitVerificationDTO = objectMapper.readValue(verificationDataRequest, SubmitVerificationDTO.class);

            List<String> oldVerificationPhotoUrl = getOldVerificationPhotos(submitVerificationDTO.getEmail());

            if(!oldVerificationPhotoUrl.isEmpty()){
                deleteOldVerificationPhotosAndRequest(oldVerificationPhotoUrl, submitVerificationDTO.getEmail());
            }

            // If PostDTO can hold file paths, initialize the list here (or ensure it's initialized in the DTO)
            List<String> filePaths = new ArrayList<>();

            // Process each file
            if(files !=null && files.length > 0){
                for (MultipartFile file : files) {
                    String fileName = System.currentTimeMillis() + "_" + submitVerificationDTO.getEmail() + "_" + file.getOriginalFilename();
                    try {

                        if(!file.isEmpty()){
                            // Upload file to DigitalOcean Spaces
                            //upload to digital ocean
                            awsService.uploadFileToSpaces(BUCKET_NAME,DIRECTORY_NAME, fileName, file);
                            // Construct the file URL
                            String fileUrl = "https://collge-stag-bucket.ams3.cdn.digitaloceanspaces.com/verification/"+ fileName;

                            // Collect or process the generated file URL as needed
                            filePaths.add(fileUrl);
                        }

                    } catch (IOException e) {
                        LOGGER.error("Error uploading file to Spaces: {}", e.getMessage());
                        throw new RuntimeException("Error uploading file", e);
                    }
                }
            }

            // If applicable, associate filePaths with your DTO or the entity to be saved
            // For demonstration, assuming PostData can hold these URLs directly or via a related mechanism
            Verification verification = Verification.builder()
            .email(submitVerificationDTO.getEmail())
            .filePaths(filePaths)
            .status("PENDING")
                    .verificationType(submitVerificationDTO.getVerificationType())
                    .createdAt(LocalDateTime.now())
            .build();

            verificationRepository.save(verification);

            return new ResponseEntity<>("Verification Submitted", HttpStatus.OK); // Adjust based on what you need to return

        } catch (JsonProcessingException e) {
            LOGGER.error("Error processing post data: {}", e.getMessage());
            return new ResponseEntity<>("Error processing post data", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            LOGGER.error("General error: {}", e.getMessage());
            return new ResponseEntity<>("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    public ResponseEntity<?> getVerificationStatusByEmail(String email) {

        try{

            Optional<Verification> optionalVerification = verificationRepository.getVerificationByEmail(email);

            if(optionalVerification.isEmpty()) {
                return new ResponseEntity<>("NOT_PRESENT", HttpStatus.OK);
            }

            Verification verification = optionalVerification.get();

            return new ResponseEntity<>(verification.getStatus(), HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }
    public ResponseEntity<?> getVerificationRequest(String email) {

        Optional<Verification> optionalVerification = verificationRepository.getVerificationByEmail(email);

        if(optionalVerification.isEmpty()){
            return new ResponseEntity<>("Request not found", HttpStatus.NOT_FOUND);
        }

        Verification verification = optionalVerification.get();
        UserAccountVerificationData userAccountVerificationData = userRepository.getUserAccountVerificationData(email);

        VerificationDTO verificationDTO = VerificationDTO.builder()
                .verificationId(verification.getVerificationId())
                .email(verification.getEmail())
                .filePaths(verification.getFilePaths())
                .status(verification.getStatus())
                .verificationType(verification.getVerificationType())
                .createdAt(verification.getCreatedAt())
                .userData(userAccountVerificationData)
                .build();
        return new ResponseEntity<>(verificationDTO, HttpStatus.OK);

    }

    public ResponseEntity<?> getAllVerificationRequests(Integer offset, Integer pageSize) {

        try{
            Pageable pageable = PageRequest.of(offset, pageSize, Sort.by("createdAt").ascending());
            List<String> excludedTypes = List.of("VERIFIED", "REJECTED");

            Page<Verification> verificationPage = verificationRepository.getVerificationsWithoutApproved(excludedTypes, pageable);
            List<Verification> verifications = verificationPage.getContent();
            List<RequestDTO> getRequestDTOs = convertVerificationToRequestDTOS(verifications);

            return new ResponseEntity<>(getRequestDTOs, HttpStatus.OK);
        }
        catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<?> rejectVerificationRequest(VerificationRejectionDTO verificationRejectionDTO) {
        try{

            String email = verificationRejectionDTO.getEmail();

            Optional<Verification> optionalVerification = verificationRepository.getVerificationByEmail(email);

            if(optionalVerification.isEmpty()){
                return new ResponseEntity<>("Request not found", HttpStatus.NOT_FOUND);
            }

            Verification verification = optionalVerification.get();

            verification.setStatus("REJECTED");
            verification.setRejectionReasons(verificationRejectionDTO.getRejectionReasons());
            verificationRepository.save(verification);


            String rejectionReasons = convertListToNumberedString(verificationRejectionDTO.getRejectionReasons());
            VerificationRejectionReasons verificationRejectionReasons = VerificationRejectionReasons
                    .builder()
                    .email(email)
                    .reasonsString(rejectionReasons)
                    .build();

            userRepository.sendRejectionEmail(verificationRejectionReasons);

            return new ResponseEntity<>("User request rejected!", HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<?> approveVerificationRequest(String email) {

        try{
            Optional<Verification> optionalVerification = verificationRepository.getVerificationByEmail(email);

            if(optionalVerification.isEmpty()){
                return new ResponseEntity<>("Request not found", HttpStatus.NOT_FOUND);
            }


            Verification verification = optionalVerification.get();
            ResponseEntity<String> response = userRepository.updateUserLinkUp(email, verification.getVerificationType());

            if(response.getStatusCode().equals(HttpStatus.NOT_FOUND)){
                return new ResponseEntity<>(response.getBody(), response.getStatusCode());
            }

            verification.setStatus("VERIFIED");
            verificationRepository.save(verification);

            return new ResponseEntity<>("User verified!", HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    private CreateNotificationDTO createNotificationDTO(Long userId, Integer universityId, String verificationType){

        String typeOfVerification = "LINKUP_VERIFICATION_APPROVED";
        if(!verificationType.equals(LINKUP_VERIFICATION_TYPE)){
            typeOfVerification = "APP_SIGN_UP_VERIFICATION_APPROVED";
        }

        CreateNotificationDTO createNotificationDTO = CreateNotificationDTO.builder()
                .actorId(0L)
                .userIds(List.of(userId))
                .universityIds(List.of(universityId))
                .postId(null)
                .commentId(null)
                .message(null)
                .notificationType(typeOfVerification)
                .build();

        return createNotificationDTO;
    }

    private List<RequestDTO> convertVerificationToRequestDTOS(List<Verification> verifications){

        List<RequestDTO> requestDTOS = new ArrayList<>();

        verifications.forEach(verification -> {

            RequestDTO convertedRequest = RequestDTO.builder()
                    .verificationId(verification.getVerificationId())
                    .email(verification.getEmail())
                    .createdAt(verification.getCreatedAt())
                    .status(verification.getStatus())
                    .verificationType(verification.getVerificationType())
                    .build();

            requestDTOS.add(convertedRequest);
        });

        return requestDTOS;
    }

    private void deleteOldVerificationPhotosAndRequest(List<String> fileUrls, String email){

        Optional<Verification> optionalVerification = verificationRepository.getVerificationByEmail(email);

        if(optionalVerification.isPresent()){
            Verification verification = optionalVerification.get();
            verificationRepository.delete(verification);
        }

        fileUrls.forEach((url) -> {
            awsService.deleteFileFromBucket(BUCKET_NAME, DIRECTORY_NAME, url);
        });

    }

    private List<String> getOldVerificationPhotos(String email){

        Optional<Verification> optionalVerification = verificationRepository.getVerificationByEmail(email);
        List<String> oldPhotoUrls = new ArrayList<>();

        if(optionalVerification.isPresent()){
            Verification verification = optionalVerification.get();
            oldPhotoUrls = verification.getFilePaths();
        }

        return oldPhotoUrls;

    }

    private String convertListToNumberedString(List<String> list) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < list.size(); i++) {
            sb.append(i + 1) // Numbering starts at 1
                    .append(". ") // Add numbering format
                    .append(list.get(i)) // Append the string
                    .append(" "); // Add a space (or newline for better formatting)
        }
        return sb.toString().trim(); // Remove trailing space
    }

}
