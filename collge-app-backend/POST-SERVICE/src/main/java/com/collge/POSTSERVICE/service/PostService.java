package com.collge.POSTSERVICE.service;

import com.collge.POSTSERVICE.dto.*;
import com.collge.POSTSERVICE.model.LikeDislike;
import com.collge.POSTSERVICE.model.PostData;
import com.collge.POSTSERVICE.model.University;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AWSService awsService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeDislikeRepository likeDislikeRepository;

    @Autowired
    private UniversityRepository universityRepository;

    private Logger LOGGER = LoggerFactory.getLogger(PostService.class);

    public ResponseEntity<?> addPost(String postDataRequest, MultipartFile[] files) {

        try {
            // Deserialize the JSON data to PostDTO
            PostDTO postDTO = objectMapper.readValue(postDataRequest, PostDTO.class);

            // If PostDTO can hold file paths, initialize the list here (or ensure it's initialized in the DTO)
            List<String> filePaths = new ArrayList<>();

            // Process each file
            if(files !=null && files.length > 0){
                for (MultipartFile file : files) {
                    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                    try {

                        if(!file.isEmpty()){
                            // Upload file to DigitalOcean Spaces
                            //upload to digital ocean
                            awsService.uploadFileToSpaces("collge-stag-bucket",postDTO.getPostType().toLowerCase(), fileName, file);
                            // Construct the file URL
                            String fileUrl = "https://collge-stag-bucket.ams3.cdn.digitaloceanspaces.com/" + postDTO.getPostType().toLowerCase() + "/" + fileName;

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
            PostData postData = awsService.convertToPostData(postDTO, filePaths, postDTO.getPostType()); // Pass filePaths for association with PostData
            postRepository.save(postData);

            return new ResponseEntity<>(postData, HttpStatus.OK); // Adjust based on what you need to return

        } catch (JsonProcessingException e) {
            LOGGER.error("Error processing post data: {}", e.getMessage());
            return new ResponseEntity<>("Error processing post data", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            LOGGER.error("General error: {}", e.getMessage());
            return new ResponseEntity<>("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    public ResponseEntity<?> getPostById(Long userId, String postId) {

        try{
            Optional<PostData> postData = postRepository.findById(postId);

            if(postData.isPresent()){
                PostData post = postData.get();
                List<PostData> posts = new ArrayList<>();
                posts.add(post);

                List<GetPostDTO> getPostDTOS = convertPostsDTO(userId,posts);
                GetPostDTO fetchedPost = getPostDTOS.get(0);

                return new ResponseEntity<>(fetchedPost, HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>("No post found with ID: " + postId, HttpStatus.NOT_FOUND);
            }
        }catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }

    }

    public ResponseEntity<?> deletePostById(String postId) {

        try{
            Optional<PostData> postData = postRepository.findById(postId);

            if(postData.isPresent()){

                PostData post = postData.get();
                List<String> files = post.getFilePath();

                if(!files.isEmpty()) {
                    for(String file : files){
                        awsService.deleteFileFromBucket("collge-stag-bucket", post.getPostType().toLowerCase(), file);
                    }
                }

                postRepository.deleteById(postId);
                return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
            }
            else{
                return new ResponseEntity<>("No post found by Id: " + postId, HttpStatus.NOT_FOUND);
            }
        }catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }

    }

    public ResponseEntity<?> updatePostById(PostDTO postDTO) {

        try{
            Optional<PostData> postData = postRepository.findById(postDTO.getPostId());


            if(postData.isPresent()){
                PostData post = postData.get();

                post.setCaption(postDTO.getCaption());
                post.setIsEdited(true);

                postRepository.save(post);

                return new ResponseEntity<>(post, HttpStatus.OK);

            }
            else{
                return new ResponseEntity<>("No post found with ID: " + postDTO.getPostId(), HttpStatus.NOT_FOUND);
            }
        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public int getPostCount(Long userId) {

        try{

            int numberOfPosts = postRepository.getNumberOfPostCount(userId);
            return numberOfPosts;

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getPostsByUserId(Long userId, Integer offset, Integer pageSize, Long requestorId) {

        try {
            Pageable pageable = PageRequest.of(offset, pageSize, Sort.by("createdAt").descending());
            Page<PostData> postPage = postRepository.getPostsByUserId(userId, pageable);
            List<PostData> postsOfUser = postPage.getContent();
            List<GetPostDTO> getPostDTOS = convertPostsDTO(userId, postsOfUser, requestorId);

            return new ResponseEntity<>(getPostDTOS, HttpStatus.OK);
        }
        catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getAllPosts() {

        try{
            List<PostData> posts = postRepository.findAll();
            return new ResponseEntity<>(posts, HttpStatus.OK);
        }
        catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getAllPostsByUniId(Long userId, Integer universityId, Integer offset, Integer pageSize){
        try {
            Pageable page = PageRequest.of(offset, pageSize).withSort(Sort.by(Sort.Direction.DESC,"createdAt"));

            List<Long> blockedUsers = userRepository.getBlockedUsersIds(userId);

            System.out.println(blockedUsers.size());

            Page<PostData> postsByUniversity = postRepository.getPostsByUniversityId(universityId,blockedUsers,page);
            List<GetPostDTO> getPostDTOS = convertPostsDTO(userId, postsByUniversity);

            return new ResponseEntity<>(getPostDTOS, HttpStatus.OK);
        }
        catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getPostsByType(Long userId, String type, Integer offset, Integer pageSize) {

        try{
            Pageable page = PageRequest.of(offset, pageSize).withSort(Sort.by(Sort.Direction.DESC,"createdAt"));
            Page<PostData> posts = postRepository.getPostsByType(type, true, page);
            List<GetPostDTO> getPostDTOS = convertPostsDTO(userId, posts.getContent());

            return new ResponseEntity<>(getPostDTOS,HttpStatus.OK);


        }catch (RuntimeException e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getPostsForHome(Long userId, Integer offset, Integer contentRequestSize) {

        try{

            Pageable pageable = PageRequest.of(offset, contentRequestSize).withSort(Sort.by(Sort.Direction.DESC,"createdAt"));

            List<Long> blockedUsers = userRepository.getBlockedUsersIds(userId);

            Page<PostData> posts = postRepository.getAllWhereIsGlobalTrue(true, blockedUsers,pageable);
            List<GetPostDTO> getPostDTOS = convertPostsDTOWithUniName(userId, posts);

            return new ResponseEntity<>(getPostDTOS, HttpStatus.OK);

        }catch (RuntimeException e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public List<GetPostDTO> convertPostsDTO(Long userId, List<PostData> posts){

        List<GetPostDTO> getPostDTOS = new ArrayList<>();

        posts.forEach((post) ->
                {
                    String likeStatus = null;
                    GetUserPostDataDTO userDataDTO = userRepository.getUserPostDataById(post.getUserId());

                    Optional<LikeDislike> likeDislike = likeDislikeRepository.findByPostIdAndUserId(post.getPostId(), userId);

                    if(likeDislike.isPresent()){
                        LikeDislike vote = likeDislike.get();
                        likeStatus = vote.getType();
                    }

                    GetPostDTO postDTO = GetPostDTO.builder()
                            .postId(post.getPostId())
                            .caption(post.getCaption())
                            .votes(post.getVotes())
                            .universityId(post.getUniversityId())
                            .userId(post.getUserId())
                            .createdAt(post.getCreatedAt())
                            .views(post.getViews())
                            .postType(post.getPostType())
                            .avatar(userDataDTO.getAvatar())
                            .username(userDataDTO.getUsername())
                            .firstName(userDataDTO.getFirstName())
                            .role(userDataDTO.getRole())
                            .source(post.getFilePath())
                            .isPremiumUser(userDataDTO.getIsPremiumUser())
                            .likeStatus(likeStatus)
                            .build();

                    getPostDTOS.add(postDTO);
                }
        );

        return getPostDTOS;
    }

    public List<GetPostDTO> convertPostsDTO(Long userId, List<PostData> posts, Long requestorId){

        List<GetPostDTO> getPostDTOS = new ArrayList<>();

        posts.forEach((post) ->
                {
                    String likeStatus = null;
                    GetUserPostDataDTO userDataDTO = userRepository.getUserPostDataById(post.getUserId());

                    Optional<LikeDislike> likeDislike = likeDislikeRepository.findByPostIdAndUserId(post.getPostId(), requestorId);

                    if(likeDislike.isPresent()){
                        LikeDislike vote = likeDislike.get();
                        likeStatus = vote.getType();
                    }

                    GetPostDTO postDTO = GetPostDTO.builder()
                            .postId(post.getPostId())
                            .caption(post.getCaption())
                            .votes(post.getVotes())
                            .universityId(post.getUniversityId())
                            .userId(post.getUserId())
                            .createdAt(post.getCreatedAt())
                            .views(post.getViews())
                            .postType(post.getPostType())
                            .avatar(userDataDTO.getAvatar())
                            .username(userDataDTO.getUsername())
                            .firstName(userDataDTO.getFirstName())
                            .role(userDataDTO.getRole())
                            .source(post.getFilePath())
                            .isPremiumUser(userDataDTO.getIsPremiumUser())
                            .likeStatus(likeStatus)
                            .build();

                    getPostDTOS.add(postDTO);
                }
        );

        return getPostDTOS;
    }

    public List<GetPostDTO> convertPostsDTO(Long userId, Page<PostData> posts){

        List<GetPostDTO> getPostDTOS = new ArrayList<>();

        posts.forEach((post) ->
                {

                    String likeStatus = null;
                    GetUserPostDataDTO userDataDTO = userRepository.getUserPostDataById(post.getUserId());
                    Optional<LikeDislike> likeDislike = likeDislikeRepository.findByPostIdAndUserId(post.getPostId(), userId);

                    if(likeDislike.isPresent()){
                        LikeDislike vote = likeDislike.get();
                        likeStatus = vote.getType();
                    }

                    GetPostDTO postDTO = GetPostDTO.builder()
                            .postId(post.getPostId())
                            .caption(post.getCaption())
                            .votes(post.getVotes())
                            .universityId(post.getUniversityId())
                            .userId(post.getUserId())
                            .createdAt(post.getCreatedAt())
                            .views(post.getViews())
                            .postType(post.getPostType())
                            .avatar(userDataDTO.getAvatar())
                            .firstName(userDataDTO.getFirstName())
                            .username(userDataDTO.getUsername())
                            .role(userDataDTO.getRole())
                            .source(post.getFilePath())
                            .isPremiumUser(userDataDTO.getIsPremiumUser())
                            .likeStatus(likeStatus)
                            .build();

                    getPostDTOS.add(postDTO);
                }
        );

        return getPostDTOS;
    }

    public List<GetPostDTO> convertPostsDTOWithUniName(Long userId, Page<PostData> posts){

        List<GetPostDTO> getPostDTOS = new ArrayList<>();

        posts.forEach((post) ->
                {

                    GetUserPostDataDTO userDataDTO = userRepository.getUserPostDataById(post.getUserId());

                    if(userDataDTO != null){
                        University userUniversity = universityRepository.getUniById(userDataDTO.getUniversityId());
                        String likeStatus = null;
                        Optional<LikeDislike> likeDislike = likeDislikeRepository.findByPostIdAndUserId(post.getPostId(), userId);

                        if(likeDislike.isPresent()){
                            LikeDislike vote = likeDislike.get();
                            likeStatus = vote.getType();
                        }

                        GetPostDTO postDTO = GetPostDTO.builder()
                                .postId(post.getPostId())
                                .caption(post.getCaption())
                                .votes(post.getVotes())
                                .universityId(post.getUniversityId())
                                .userId(post.getUserId())
                                .createdAt(post.getCreatedAt())
                                .views(post.getViews())
                                .postType(post.getPostType())
                                .avatar(userDataDTO.getAvatar())
                                .firstName(userDataDTO.getFirstName())
                                .username(userUniversity.getUniName())
                                .role(userDataDTO.getRole())
                                .source(post.getFilePath())
                                .isPremiumUser(userDataDTO.getIsPremiumUser())
                                .likeStatus(likeStatus)
                                .build();

                        getPostDTOS.add(postDTO);
                    }
                }
        );

        return getPostDTOS;
    }

    public ResponseEntity<Integer> vote(long userId, String postId, String updatedType) {
        Optional<PostData> postOpt = postRepository.findById(postId);
        if (!postOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        PostData post = postOpt.get();
        int currentVotes = post.getVotes();

        // Find existing vote record
        LikeDislike currentVote = likeDislikeRepository.findByPostIdAndUserId(postId, userId).orElse(null);

        String currentState = (currentVote == null) ? "NO_VOTE" : currentVote.getType();

        int voteChange = 0;
        String newState = currentState;

        switch (updatedType) {
            case "LIKED":
                if (currentState.equals("NO_VOTE")) {
                    voteChange = +1;
                    newState = "LIKED";
                } else if (currentState.equals("DISLIKED")) {
                    // Move from DISLIKE (-1) to LIKE (+1) = net +2
                    voteChange = +2;
                    newState = "LIKED";
                } else if (currentState.equals("LIKED")) {
                    // Already liked, no change
                    voteChange = 0;
                    newState = "LIKED";
                }
                break;

            case "UNLIKED":
                if (currentState.equals("LIKED")) {
                    voteChange = -1;
                    newState = "NO_VOTE";
                } else {
                    // If user wasn't Liked before, no change
                    voteChange = 0;
                    newState = currentState;
                }
                break;

            case "DISLIKED":
                if (currentState.equals("NO_VOTE")) {
                    voteChange = -1;
                    newState = "DISLIKED";
                } else if (currentState.equals("LIKED")) {
                    // Move from LIKE (+1) to DISLIKE (-1) = net -2
                    voteChange = -2;
                    newState = "DISLIKED";
                } else if (currentState.equals("DISLIKED")) {
                    // Already disliked, no change
                    voteChange = 0;
                    newState = "DISLIKED";
                }
                break;

            case "UNDISLIKED":
                if (currentState.equals("DISLIKED")) {
                    voteChange = +1;
                    newState = "NO_VOTE";
                } else {
                    // If user wasn't Disliked before, no change
                    voteChange = 0;
                    newState = currentState;
                }
                break;
        }

        int updatedVotes = currentVotes + voteChange;

        post.setVotes(updatedVotes);
        userRepository.updateReputation(post.getUserId(), voteChange);
        postRepository.save(post);

        // Update or remove/create the likeDislike entry
        if (newState.equals("NO_VOTE")) {
            // remove the entry if exists
            if (currentVote != null) {
                likeDislikeRepository.delete(currentVote);
            }
        } else {
            if (currentVote == null) {
                currentVote = new LikeDislike(postId, userId, newState);
            } else {
                currentVote.setType(newState);
            }
            likeDislikeRepository.save(currentVote);
        }

        return ResponseEntity.ok(updatedVotes);
    }


    public ResponseEntity<?> getAllVotesByPostId(String postId) {

        try{
            List<LikeDislike> votes = likeDislikeRepository.getAllVotesByPostId(postId);
            List<GetVoteDTO> convertedVotes = convertVoteToDTO(votes);

            return new ResponseEntity<>(convertedVotes, HttpStatus.OK);
        }
        catch (RuntimeException e){
            throw new RuntimeException(e);
        }
    }

    public ResponseEntity<?> getAllVotesByVoteType(String postId, String type) {

        try{

            List<LikeDislike> votes = likeDislikeRepository.getAllVotesByVoteType(postId, type);
            List<GetVoteDTO> convertedVotes = convertVoteToDTO(votes);

            return new ResponseEntity<>(convertedVotes, HttpStatus.OK);
        }
        catch (RuntimeException e){
            throw new RuntimeException(e);
        }
    }

    public ResponseEntity<?> getMentionedPostById(Long userId, String postId, String commentId, String type) {

        try{

            ResponseEntity<?> getUserPostDataDTOResponseEntity = getPostById(userId, postId);
            MentionedPost mentionedPost = new MentionedPost();

            if(getUserPostDataDTOResponseEntity.getStatusCode().equals(HttpStatus.OK)){

                if(type.equals("TAGGED")){
                    return new ResponseEntity<>(getUserPostDataDTOResponseEntity, HttpStatus.OK);
                }

                if(commentId != null){
                    ResponseEntity<?> fetchedComment = commentService.getCommentById(commentId);

                    if(fetchedComment.getStatusCode().equals(HttpStatus.OK)){

                        mentionedPost.setCommentDTO((CommentDTO) fetchedComment.getBody());

                    }
                }

                mentionedPost.setGetPostDTO((GetPostDTO) getUserPostDataDTOResponseEntity.getBody());
                return new ResponseEntity<>(mentionedPost, HttpStatus.OK);

            }
            return new ResponseEntity<>("No post found with ID: " + postId, HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>("Something went wrong: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    private void createNewVoteAndSave(long userId, String postId, String voteType){

        LikeDislike vote = LikeDislike.builder()
                .postId(postId)
                .userId(userId)
                .type(voteType)
                .build();

        likeDislikeRepository.save(vote);
    }

    private List<GetVoteDTO> convertVoteToDTO(List<LikeDislike> votes){

        List<GetVoteDTO> convertedVotes = new ArrayList<>();

        votes.forEach((vote) -> {

            GetUserPostDataDTO userData = userRepository.getUserPostDataById(vote.getUserId());

            GetVoteDTO convertedVote = GetVoteDTO.builder()
                    .voteId(vote.getId())
                    .type(vote.getType())
                    .userId(userData.getUserId())
                    .firstName(userData.getFirstName())
                    .lastName(userData.getLastName())
                    .username(userData.getUsername())
                    .avatar(userData.getAvatar())
                    .role(userData.getRole())
                    .isPremiumUser(userData.getIsPremiumUser())
                    .build();

            convertedVotes.add(convertedVote);
        });

        return convertedVotes;
    }

    public ChatPostDTO getMediaThumbnail(String postId) {

        try{

            Optional<PostData> optionalPostData = postRepository.findById(postId);
            ChatPostDTO chatPostDTO = new ChatPostDTO();

            if(optionalPostData.isPresent()){

                PostData post = optionalPostData.get();
                chatPostDTO.setMediaThumbnailUrl(post.getMediaThumbnail());
                chatPostDTO.setIsPostFound(true);
                chatPostDTO.setCaption(post.getCaption());
                chatPostDTO.setPostType(post.getPostType());
                chatPostDTO.setUserId(post.getUserId());
                chatPostDTO.setIsTextOnly(post.getFilePath().isEmpty());
            }
            else{
                chatPostDTO.setMediaThumbnailUrl("");
                chatPostDTO.setIsPostFound(false);
                chatPostDTO.setCaption(null);
                chatPostDTO.setPostType("");
                chatPostDTO.setUserId(null);
                chatPostDTO.setIsTextOnly(false);
            }

            return chatPostDTO;

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }
}
