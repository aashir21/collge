package com.collge.POSTSERVICE.service;

import com.collge.POSTSERVICE.dto.*;
import com.collge.POSTSERVICE.model.*;
import com.collge.POSTSERVICE.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
public class LinkUpService{

    @Autowired
    private LinkUpRepository linkUpRepository;

    @Autowired
    private LinkUpCollabsRepository linkUpCollabsRepository;

    @Autowired
    private LinkUpInterestRepository linkUpInterestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private LinkUpMediaRepository linkUpMediaRepository;

    @Autowired
    private AWSService awsService;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String LINKUP_REQUEST_IDLE_STATUS = "NOT_INTERESTED";
    private static final String LINKUP_REQUEST_INTERESTED_STATUS = "INTERESTED";

    private static final Logger LOGGER = LoggerFactory.getLogger(LinkUpService.class);

    public ResponseEntity<?> createNewLinkUpPost(NewLinkUpPostDTO newLinkUpPostDTO) {

        try{
            if(newLinkUpPostDTO.getUserId() == null){
                return new ResponseEntity<>("No user Id present", HttpStatus.BAD_REQUEST);
            }

            Optional<LinkUp> optionalLinkUp = linkUpRepository.findByUserIdAndStatus(newLinkUpPostDTO.getUserId(), "OPEN");

            if(optionalLinkUp.isPresent()){
                return new ResponseEntity<>("There is another LinkUp post active, please delete it before you create a new one!", HttpStatus.CONFLICT);
            }

            String userCampus = userRepository.getUserCampusByUserId(newLinkUpPostDTO.getUserId());

            LinkUp newLinkUp = LinkUp.builder()
                    .userId(newLinkUpPostDTO.getUserId())
                    .friendId(newLinkUpPostDTO.getFriendId())
                    .universityId(newLinkUpPostDTO.getUniversityId())
                    .caption(newLinkUpPostDTO.getCaption())
                    .date(newLinkUpPostDTO.getDate())
                    .time(newLinkUpPostDTO.getTime())
                    .location(newLinkUpPostDTO.getLocation())
                    .createdAt(LocalDateTime.now())
                    .status("OPEN")
                    .campus(userCampus)
                    .collaborativePost(newLinkUpPostDTO.isCollaborativePost())
                    .locationHidden(newLinkUpPostDTO.isLocationHidden())
                    .build();

            if(newLinkUpPostDTO.isCollaborativePost()){

                LinkUpCollaboration collaboration = LinkUpCollaboration.builder()
                        .authorId(newLinkUp.getUserId())
                        .friendId(newLinkUpPostDTO.getFriendId())
                        .collabRequestStatus("PENDING")
                        .build();

                linkUpCollabsRepository.save(collaboration);
            }

            linkUpRepository.save(newLinkUp);

            return new ResponseEntity<>(newLinkUp, HttpStatus.OK);
        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<?> respondToCollabRequest(Long authorId, Long friendId, boolean isAccepted) {

        try{

            Optional<LinkUpCollaboration> existingRequest = linkUpCollabsRepository.getUserAndFriendId(authorId, friendId, "PENDING");

            if(existingRequest.isEmpty()){
                return new ResponseEntity<>("Collab request not found", HttpStatus.NOT_FOUND);
            }

            Optional<LinkUp> optionalLinkUp = linkUpRepository.findByUserId(authorId);

            if(optionalLinkUp.isEmpty()){

                return new ResponseEntity<>("Post not found", HttpStatus.NOT_FOUND);

            }

            if(existingRequest.isPresent()){

                LinkUpCollaboration collabReq = existingRequest.get();
                LinkUp linkUp = optionalLinkUp.get();

                if(isAccepted){
                    collabReq.setCollabRequestStatus("ACCEPTED");
                }
                else{
                    collabReq.setCollabRequestStatus("REJECTED");
                    linkUp.setCollaborativePost(false);
                    linkUp.setFriendId(null);

                    linkUpRepository.save(linkUp);
                }

                linkUpCollabsRepository.save(collabReq);

                if(isAccepted){
                    return new ResponseEntity<>("ACCEPTED", HttpStatus.OK);
                }

                return new ResponseEntity<>("REJECTED", HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>("Collab request not found", HttpStatus.NOT_FOUND);
            }

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> createLinkUpRequest(String postId, Long userId) {

        try{
            Optional<LinkUp> optionalLinkUp = linkUpRepository.findById(postId);

            if(optionalLinkUp.isEmpty()){

                return new ResponseEntity<>("LinkUp post not found with ID: " + postId, HttpStatus.NOT_FOUND);

            }
            Optional<LinkUpInterest> optionalLinkUpInterest = linkUpInterestRepository.findByPostIdAndUserId(postId, userId);

            LinkUp linkUp = optionalLinkUp.get();

            if(linkUp.getStatus().equals("CLOSED")){
                return new ResponseEntity<>("Post closed" + postId, HttpStatus.BAD_REQUEST);
            }

            if(optionalLinkUpInterest.isPresent()){

                LinkUpInterest interest = optionalLinkUpInterest.get();
                linkUpInterestRepository.delete(interest);

                return new ResponseEntity<>(LINKUP_REQUEST_IDLE_STATUS, HttpStatus.OK);

            }

            LinkUpInterest newInterest = LinkUpInterest.builder()
                    .postId(postId)
                    .authorId(linkUp.getUserId())
                    .userId(userId)
                    .createdAt(LocalDateTime.now())
                    .build();

            linkUpInterestRepository.save(newInterest);
            return new ResponseEntity<>(LINKUP_REQUEST_INTERESTED_STATUS, HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<?> isLinkUpInterestPresent(String postId, Long userId){

        try{

            Optional<LinkUpInterest> optionalLinkUpInterest = linkUpInterestRepository.findByPostIdAndUserId(postId, userId);

            if(optionalLinkUpInterest.isPresent()){
                return new ResponseEntity<>(LINKUP_REQUEST_INTERESTED_STATUS, HttpStatus.OK);
            }

            return new ResponseEntity<>(LINKUP_REQUEST_IDLE_STATUS, HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }


    public ResponseEntity<?> acceptLinkUpRequest(Long userId, String postId) {

        try{

            Optional<LinkUp> optionalLinkUp = linkUpRepository.findById(postId);
            Optional<LinkUpInterest> optionalLinkUpInterest = linkUpInterestRepository.findByPostIdAndUserId(postId, userId);

            if(optionalLinkUp.isEmpty()){
                return new ResponseEntity<>("LinkUp post not found with ID: " + postId, HttpStatus.NOT_FOUND);
            }

            if(optionalLinkUp.isEmpty()){
                return new ResponseEntity<>("LinkUp Interest was deleted, accept another one or close the post", HttpStatus.NOT_FOUND);
            }

            LinkUpInterest linkUpInterest = optionalLinkUpInterest.get();
            linkUpInterestRepository.deleteAllByPostId(linkUpInterest.getPostId());

            LinkUp linkUp = optionalLinkUp.get();

            linkUp.setParticipantId(userId);
            linkUp.setStatus("CLOSED");
            linkUpRepository.save(linkUp);

            if(linkUp.isCollaborativePost()){
                userRepository.updateFire(userId, linkUp.getUserId(), linkUp.getFriendId());
            }
            else{
                userRepository.updateFire(userId, linkUp.getUserId(), null);
            }

            return new ResponseEntity<>("LinkUp Accepted!", HttpStatus.OK);


        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getAllLinkUpsByParticipantId(Long participantId, int offset, int pageSize) {
        try{

            Pageable pageable = PageRequest.of(offset, pageSize).withSort(Sort.by(Sort.Direction.DESC,"createdAt"));

            Page<LinkUp> posts = linkUpRepository.findAllByParticipantId(participantId,pageable);
            List<LinkUp> activeLinkUpPosts = posts.getContent();
            List<LinkUpDTO> convertedLinkUps = convertLinkUpToDTO(activeLinkUpPosts);

            return new ResponseEntity<>(convertedLinkUps, HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getAllLinkUpsByAuthorId(Long authorId, int offset, int pageSize) {
        try{

            Pageable pageable = PageRequest.of(offset, pageSize).withSort(Sort.by(Sort.Direction.DESC,"createdAt"));

            Page<LinkUp> posts = linkUpRepository.findAllByUserId(authorId,pageable);
            List<LinkUp> activeLinkUpPosts = posts.getContent();
            List<LinkUpDTO> convertedLinkUps = convertLinkUpToDTO(activeLinkUpPosts);

            return new ResponseEntity<>(convertedLinkUps, HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getAllLinkUps(Integer universityId, Long userId, int offset, int pageSize) {

        try{

            Pageable pageable = PageRequest.of(offset, pageSize).withSort(Sort.by(Sort.Direction.DESC,"createdAt"));

            String campus = userRepository.getUserCampusByUserId(userId);

            List<Long> blockedUsers = userRepository.getBlockedUsersIds(userId);

            Page<LinkUp> posts = linkUpRepository.findAllByUniversityIdAndStatus(universityId,campus,"OPEN",blockedUsers,pageable);
            List<LinkUp> activeLinkUpPosts = posts.getContent();
            List<LinkUpDTO> convertedLinkUps = convertLinkUpToDTO(activeLinkUpPosts);

            return new ResponseEntity<>(convertedLinkUps, HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getAllLinkUpsByCampus(Long userId, Integer universityId, int offset, int pageSize) {

        try{
            Pageable pageable = PageRequest.of(offset, pageSize).withSort(Sort.by(Sort.Direction.DESC,"createdAt"));

            String campus = userRepository.getUserCampusByUserId(userId);

            List<Long> blockedUsers = userRepository.getBlockedUsersIds(userId);

            Page<LinkUp> posts = linkUpRepository.findAllByCampusAndStatus(campus,"OPEN",List.of(universityId),blockedUsers,pageable);
            List<LinkUp> activeLinkUpPosts = posts.getContent();
            List<LinkUpDTO> convertedLinkUps = convertLinkUpToDTO(activeLinkUpPosts);

            return new ResponseEntity<>(convertedLinkUps, HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getAllLinkUpRequestsByUserId(Long authorId, int offset, int pageSize) {

        try{

            Pageable pageable = PageRequest.of(offset, pageSize).withSort(Sort.by(Sort.Direction.DESC,"createdAt"));

            List<Long> blockedUsers = userRepository.getBlockedUsersIds(authorId);

            Page<LinkUpInterest> interestPage = linkUpInterestRepository.getAllByAuthorId(authorId, blockedUsers, pageable);
            List<LinkUpInterest> interests = interestPage.getContent();
            List<LinkUpProfileDTO> convertedInterests = new ArrayList<>();

            if(!interests.isEmpty()){
                convertedInterests = convertUserInterests(interests, authorId);
            }

            return new ResponseEntity<>(convertedInterests, HttpStatus.OK);

        }catch (RuntimeException e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> deleteLinkUp(String postId) {

        try{
            Optional<LinkUp> optionalLinkUp = linkUpRepository.findById(postId);

            if(optionalLinkUp.isEmpty()){
                return new ResponseEntity<>("Post not found with ID: " + postId, HttpStatus.NOT_FOUND);
            }

            LinkUp linkup = optionalLinkUp.get();

            linkUpInterestRepository.deleteAllByPostId(postId);

            if(linkup.isCollaborativePost()){

                Optional <LinkUpCollaboration> optionalLinkUpCollaboration  = linkUpCollabsRepository.getUserAndFriendId(linkup.getUserId(), linkup.getFriendId(), "PENDING");

                if(optionalLinkUpCollaboration.isPresent()){
                    LinkUpCollaboration collab = optionalLinkUpCollaboration.get();
                    linkUpCollabsRepository.delete(collab);
                }

            }

            linkUpRepository.delete(linkup);

            return new ResponseEntity<>("LinkUp deleted", HttpStatus.NO_CONTENT);
        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    private List<LinkUpDTO> convertLinkUpToDTO(List<LinkUp> linkups){

        List<LinkUpDTO> convertedLinkUps = new ArrayList<>();

        linkups.forEach(linkup -> {

            GetUserPostDataDTO authorData = userRepository.getUserPostDataById(linkup.getUserId());
            GetUserPostDataDTO friendData = null;

            String collabRequestStatus = null;

            if(linkup.isCollaborativePost()){
                friendData = userRepository.getUserPostDataById(linkup.getFriendId());
                Optional<LinkUpCollaboration> collabReq = linkUpCollabsRepository.getUserAndFriendId(linkup.getUserId(), linkup.getFriendId(), "PENDING");

                if(collabReq.isPresent()){
                    collabRequestStatus = "PENDING";
                }

            }

            LinkUpGetAuthorDTO authorDTO = buildLinkUpAuthorDTO(authorData);
            LinkUpGetFriendDTO friendDTO = null;

            if(friendData != null){
                friendDTO = buildLinkUpFriendDTO(friendData);
            }

            LinkUpDTO linkUpDTO = LinkUpDTO.builder()
                    .postId(linkup.getPostId())
                    .authorId(linkup.getUserId())
                    .friendId(linkup.getFriendId())
                    .caption(linkup.getCaption())
                    .date(linkup.getDate())
                    .time(linkup.getTime())
                    .location(linkup.getLocation())
                    .createdAt(linkup.getCreatedAt())
                    .collaborativePost(linkup.isCollaborativePost())
                    .locationHidden(linkup.isLocationHidden())
                    .collaborativeRequestStatus(collabRequestStatus)
                    .authorDTO(authorDTO)
                    .status(linkup.getStatus())
                    .friendDTO(friendDTO)
                    .build();

            convertedLinkUps.add(linkUpDTO);
        });

        return convertedLinkUps;

    }

    private LinkUpGetAuthorDTO buildLinkUpAuthorDTO(GetUserPostDataDTO userData){

        University university = universityRepository.getUniById(userData.getUniversityId());

        LinkUpGetAuthorDTO authorDTO = LinkUpGetAuthorDTO.builder()
                .authorFirstName(userData.getFirstName())
                .authorLastName(userData.getLastName())
                .authorAvatar(userData.getAvatar())
                .authorUniName(university.getUniName())
                .build();

        return authorDTO;
    }

    private LinkUpGetFriendDTO buildLinkUpFriendDTO(GetUserPostDataDTO userData){

        University university = universityRepository.getUniById(userData.getUniversityId());

        LinkUpGetFriendDTO friendDTO = LinkUpGetFriendDTO.builder()
                .friendFirstName(userData.getFirstName())
                .friendLastName(userData.getLastName())
                .friendAvatar(userData.getAvatar())
                .friendUniName(university.getUniName())
                .build();

        return friendDTO;
    }

    private List<LinkUpProfileDTO> convertUserInterests(List<LinkUpInterest> interests, Long userId) {

        List<LinkUpProfileDTO> convertedInterests = new ArrayList<>();
        LinkUp optionalLinkUp = linkUpRepository.findByUserIdAndStatus(userId, "OPEN").get();

        interests.forEach(interest -> {

            LinkUpProfileDTO linkUpProfileDTO = userRepository.getUserLinkUpDataById(interest.getUserId());
            List<LinkUpMedia> userMedia = linkUpMediaRepository.getAllByUserId(interest.getUserId());

            List<String> extractedUrls = extractMediaUrls(userMedia);

            linkUpProfileDTO.setInterestId(interest.getInterestId());
            linkUpProfileDTO.setPostId(optionalLinkUp.getPostId());

            if(!linkUpProfileDTO.getAvatar().isBlank()){
                extractedUrls.add(linkUpProfileDTO.getAvatar());
            }

            linkUpProfileDTO.setImages(extractedUrls);

            convertedInterests.add(linkUpProfileDTO);

        });

        return convertedInterests;

    }

    public ResponseEntity<?> getLinkUpProfileData(Long userId) {

        try{

            if(userId == null){
                return new ResponseEntity<>("Missing user Id", HttpStatus.BAD_REQUEST);
            }

            List<LinkUpMedia> mediaUrls = linkUpMediaRepository.getAllByUserId(userId);
            LinkUpProfileDTO linkUpProfileDTO = userRepository.getUserLinkUpDataById(userId);

            List<String> extractedUrls = extractMediaUrls(mediaUrls);
            //Add the avatar at the end
            if(!linkUpProfileDTO.getAvatar().isBlank()){
                extractedUrls.add(linkUpProfileDTO.getAvatar());
            }

            if(linkUpProfileDTO.getUserId() != null){
                linkUpProfileDTO.setImages(extractedUrls);
            }

            linkUpProfileDTO.setImages(extractedUrls);

            return new ResponseEntity<>(linkUpProfileDTO, HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> deleteLinkUpPhoto(String mediaId) {

        try{

            Optional<LinkUpMedia> optionalLinkUpMedia = linkUpMediaRepository.findById(mediaId);

            if(optionalLinkUpMedia.isEmpty()){
                return new ResponseEntity<>("No media found with ID: " + mediaId, HttpStatus.NOT_FOUND);
            }

            LinkUpMedia media = optionalLinkUpMedia.get();
            linkUpMediaRepository.deleteById(media.getMediaId());

            return new ResponseEntity<>("Media deleted", HttpStatus.NO_CONTENT);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> addLinkUpPhotos(String linkUpPhotosData, MultipartFile[] files) {

        try {
            // Deserialize the JSON data to PostDTO
            LinkUpMediaDTO postDTO = objectMapper.readValue(linkUpPhotosData, LinkUpMediaDTO.class);

            // If PostDTO can hold file paths, initialize the list here (or ensure it's initialized in the DTO)
            List<String> filePaths = new ArrayList<>();

            // Process each file
            if(files !=null && files.length > 0){
                for(MultipartFile file: files){
                    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                    try {

                        if(!file.isEmpty()){
                            // Upload file to DigitalOcean Spaces
                            //upload to digital ocean
                            awsService.uploadFileToSpaces("collge-stag-bucket","linkup", fileName, file);

                            // Construct the file URL
                            String fileUrl = "https://collge-stag-bucket.ams3.cdn.digitaloceanspaces.com/" + "linkup" + "/" + fileName;

                            // Collect or process the generated file URL as needed
                            filePaths.add(fileUrl);
                        }

                    } catch (IOException e) {
                        throw new RuntimeException("Error uploading file", e);
                    }
                }
            }

            // If applicable, associate filePaths with your DTO or the entity to be saved
            // For demonstration, assuming PostData can hold these URLs directly or via a related mechanism
            LinkUpMedia linkupMedia = awsService.convertToLinkUpMedia(postDTO, filePaths); // Pass filePaths for association with PostData
            linkUpMediaRepository.save(linkupMedia);

            return new ResponseEntity<>(linkupMedia, HttpStatus.OK); // Adjust based on what you need to return

        } catch (JsonProcessingException e) {
            return new ResponseEntity<>("Error processing post data", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    private List<String> extractMediaUrls(List<LinkUpMedia> media){

        List<String> extractedUrls = new ArrayList<>();

        if(media.size() > 0){
            for(LinkUpMedia mediaIn : media){
                if(mediaIn.getMediaUrl() != null) {
                    extractedUrls.add(mediaIn.getMediaUrl());
                }
            }
        }

        return extractedUrls;
    }
}
