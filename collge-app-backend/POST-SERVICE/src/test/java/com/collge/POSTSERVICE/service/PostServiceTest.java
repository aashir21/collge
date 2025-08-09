package com.collge.POSTSERVICE.service;

import com.collge.POSTSERVICE.dto.GetPostDTO;
import com.collge.POSTSERVICE.dto.GetUserPostDataDTO;
import com.collge.POSTSERVICE.dto.PostDTO;
import com.collge.POSTSERVICE.model.LikeDislike;
import com.collge.POSTSERVICE.model.PostData;
import com.collge.POSTSERVICE.model.University;
import com.collge.POSTSERVICE.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository mockPostRepository;
    @Mock
    private AWSService mockAwsService;
    @Mock
    private CommentRepository mockCommentRepository;
    @Mock
    private UserRepository mockUserRepository;
    @Mock
    private LikeDislikeRepository mockLikeDislikeRepository;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private UniversityRepository universityRepository;

    @InjectMocks
    private PostService postServiceUnderTest;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(postServiceUnderTest, "objectMapper", new ObjectMapper());
    }

    @Test
    void testGetPostById() {
        // Setu

        // Configure PostRepository.findById(...).
        final Optional<PostData> optionalPostData = Optional.of(PostData.builder()
                .postId("postId")
                .userId(0L)
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .votes(0)
                .caption("caption")
                .filePath(List.of("value"))
                .postType("postType")
                .isEdited(false)
                .universityId(0)
                .views(0)
                .build());
        when(mockPostRepository.findById("postId")).thenReturn(optionalPostData);

        // Configure UserRepository.getUserPostDataById(...).
        final GetUserPostDataDTO postDataDTO = GetUserPostDataDTO.builder()
                .firstName("firstName")
                .username("username")
                .avatar("avatar")
                .role("role")
                .isPremiumUser("isPremiumUser")
                .build();
        when(mockUserRepository.getUserPostDataById(0L)).thenReturn(postDataDTO);

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.getPostById(0L, "postId");

        // Verify the results
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
    }

    @Test
    void testGetPostById_PostRepositoryReturnsAbsent() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("No post found with ID: postId", HttpStatusCode.valueOf(404));
        when(mockPostRepository.findById("postId")).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.getPostById(0L,"postId");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetPostById_Exception() {
        String postId = "samplePostId";

        // Define behavior for the mocked postRepository to throw a RuntimeException
        when(mockPostRepository.findById(postId))
                .thenThrow(new RuntimeException("Database error while fetching post by ID"));

        // Assert that a RuntimeException is thrown
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postServiceUnderTest.getPostById(0L, postId);
        });

        // Verify the exception message
        assertEquals("Database error while fetching post by ID", exception.getMessage());
    }

    @Test
    void testDeletePostById() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(204));

        // Configure PostRepository.findById(...).
        final Optional<PostData> optionalPostData = Optional.of(PostData.builder()
                .postId("postId")
                .userId(0L)
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .votes(0)
                .caption("caption")
                .filePath(List.of("value"))
                .postType("postType")
                .isEdited(false)
                .universityId(0)
                .views(0)
                .build());
        when(mockPostRepository.findById("postId")).thenReturn(optionalPostData);

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.deletePostById("postId");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
//        verify(mockAwsService).deleteFileFromBucket("collge-stag-bucket", "directoryName", "fileUrl");
//        verify(mockPostRepository).deleteById("postId");
    }

    @Test
    void testDeletePostById_PostRepositoryFindByIdReturnsAbsent() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("No post found by Id: postId", HttpStatusCode.valueOf(404));
        when(mockPostRepository.findById("postId")).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.deletePostById("postId");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testDeletePostById_Exception() {
        String postId = "samplePostId";

        // Define behavior for the mocked postRepository to throw a RuntimeException
        when(mockPostRepository.findById(postId))
                .thenThrow(new RuntimeException("Database error while fetching post by ID"));

        // Assert that a RuntimeException is thrown
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postServiceUnderTest.deletePostById(postId);
        });

        // Verify the exception message
        assertEquals("Database error while fetching post by ID", exception.getMessage());
    }

    @Test
    void testUpdatePostById() {
        // Setup
        final PostDTO postDTO = PostDTO.builder()
                .postId("postId")
                .caption("caption")
                .postType("postType")
                .build();
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(200));

        // Configure PostRepository.findById(...).
        final Optional<PostData> optionalPostData = Optional.of(PostData.builder()
                .postId("postId")
                .userId(0L)
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .votes(0)
                .caption("caption")
                .filePath(List.of("value"))
                .postType("postType")
                .isEdited(false)
                .universityId(0)
                .views(0)
                .build());
        when(mockPostRepository.findById("postId")).thenReturn(optionalPostData);

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.updatePostById(postDTO);

        // Verify the results
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(mockPostRepository).save(any(PostData.class));
    }

    @Test
    void testUpdatePostById_PostRepositoryFindByIdReturnsAbsent() {
        // Setup
        final PostDTO postDTO = PostDTO.builder()
                .postId("postId")
                .caption("caption")
                .postType("postType")
                .build();
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("No post found with ID: postId", HttpStatusCode.valueOf(404));
        when(mockPostRepository.findById("postId")).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.updatePostById(postDTO);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }
    @Test
    void testUpdatePostById_Exception() {
        String postId = "1L";
        PostDTO postDTO = new PostDTO();
        postDTO.setPostId(postId);

        when(mockPostRepository.findById(postId)).thenThrow(new RuntimeException("DB error"));

        assertThrows(RuntimeException.class, () -> postServiceUnderTest.updatePostById(postDTO));

        verify(mockPostRepository, never()).save(any());
    }


    @Test
    void testGetPostsForHome_Success() {
        Integer offset = 0;
        Integer contentRequestSize = 10;

        // Prepare sample PostData
        List<PostData> postDataList = new ArrayList<>();
        PostData postData = new PostData();
        postData.setPostId("1L");
        postData.setUserId(1L);
        postData.setCaption("Sample caption");
        postData.setVotes(100);
        postData.setUniversityId(1);
        postData.setCreatedAt(LocalDateTime.now());
        postData.setViews(1000);
        postData.setPostType("text");
        postDataList.add(postData);

        // Create a PageImpl object with the sample data
        Page<PostData> page = new PageImpl<>(postDataList);

        // Define behavior for the mocked postRepository
        when(mockPostRepository.getAllWhereIsGlobalTrue(true, List.of(), PageRequest.of(offset, contentRequestSize)
                .withSort(Sort.by(Sort.Direction.DESC, "createdAt")))).thenReturn(page);

        // Prepare sample GetUserPostDataDTO
        GetUserPostDataDTO userDataDTO = new GetUserPostDataDTO();
        userDataDTO.setAvatar("/path/to/avatar");
        userDataDTO.setFirstName("John");
        userDataDTO.setUsername("john_doe");
        userDataDTO.setRole("user");

        University userUniversity = new University();
        userUniversity.setUniName("Dummy Uni");

        // Define behavior for the mocked userRepository
        when(mockUserRepository.getUserPostDataById(postData.getUserId())).thenReturn(userDataDTO);
        when(universityRepository.getUniById(0)).thenReturn(userUniversity);

        // Prepare expected GetPostDTO
        GetPostDTO expectedDTO = GetPostDTO.builder()
                .postId(postData.getPostId())
                .caption(postData.getCaption())
                .votes(postData.getVotes())
                .universityId(postData.getUniversityId())
                .userId(postData.getUserId())
                .createdAt(postData.getCreatedAt())
                .views(postData.getViews())
                .postType(postData.getPostType())
                .avatar(userDataDTO.getAvatar())
                .firstName(userDataDTO.getFirstName())
                .username(userDataDTO.getUsername())
                .role(userDataDTO.getRole())
                .source(postData.getFilePath())
                .isPremiumUser(userDataDTO.getIsPremiumUser())
                .build();

        List<GetPostDTO> expectedDTOS = new ArrayList<>();
        expectedDTOS.add(expectedDTO);

        // Invoke the method under test
        ResponseEntity<?> response = postServiceUnderTest.getPostsForHome(0L, offset, contentRequestSize);

        // Assert that the response status is OK
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Assert that the body of the response matches the expected DTOs
        assertThat(response.getBody()).isNotNull();
    }

    @Test
    void testGetPostsForHome_EmptyList() {
        Integer offset = 0;
        Integer contentRequestSize = 10;

        // Prepare an empty list of PostData
        List<PostData> emptyPostDataList = new ArrayList<>();

        // Create a PageImpl object with the empty list
        Page<PostData> emptyPage = new PageImpl<>(emptyPostDataList);

        // Define behavior for the mocked postRepository to return an empty page
        when(mockPostRepository.getAllWhereIsGlobalTrue(true, List.of(), PageRequest.of(offset, contentRequestSize)
                .withSort(Sort.by(Sort.Direction.DESC, "createdAt")))).thenReturn(emptyPage);

        // Invoke the method under test
        ResponseEntity<?> response = postServiceUnderTest.getPostsForHome(0L, offset, contentRequestSize);

        // Assert that the response status is OK
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Assert that the body of the response is an empty list
        assertEquals(new ArrayList<>(), response.getBody());
    }
    @Test
    void testGetPostsForHome_Exception() {
        Integer offset = 0;
        Integer contentRequestSize = 10;

        // Define behavior for the mocked postRepository to throw a RuntimeException
        when(mockPostRepository.getAllWhereIsGlobalTrue(true, List.of(), PageRequest.of(offset, contentRequestSize)
                .withSort(Sort.by(Sort.Direction.DESC, "createdAt"))))
                .thenThrow(new RuntimeException("Database connection error"));

        // Assert that a RuntimeException is thrown with the expected message
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postServiceUnderTest.getPostsForHome(0L,offset, contentRequestSize);
        });

        // Verify the exception message
        assertEquals("Something went wrong: Database connection error", exception.getMessage());
    }


    @Test
    void testGetPostsByUserId() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(200));

        // Configure PostRepository.getPostsByUserId(...).
        final Page<PostData> postData = new PageImpl<>(List.of(PostData.builder()
                .postId("postId")
                .userId(0L)
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .votes(0)
                .caption("caption")
                .filePath(List.of("value"))
                .postType("postType")
                .isEdited(false)
                .universityId(0)
                .views(0)
                .build()));
        when(mockPostRepository.getPostsByUserId(eq(0L), any(Pageable.class))).thenReturn(postData);

        // Configure UserRepository.getUserPostDataById(...).
        final GetUserPostDataDTO postDataDTO = GetUserPostDataDTO.builder()
                .firstName("firstName")
                .username("username")
                .avatar("avatar")
                .role("role")
                .isPremiumUser("isPremiumUser")
                .build();
        when(mockUserRepository.getUserPostDataById(0L)).thenReturn(postDataDTO);

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.getPostsByUserId(0L, 0, 5, 1L);

        // Verify the results
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
    }


    @Test
    void testGetAllPosts() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(200));

        // Configure PostRepository.findAll(...).
        final List<PostData> postData = List.of(PostData.builder()
                .postId("postId")
                .userId(0L)
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .votes(0)
                .caption("caption")
                .filePath(List.of("value"))
                .postType("postType")
                .isEdited(false)
                .universityId(0)
                .views(0)
                .build());
        when(mockPostRepository.findAll()).thenReturn(postData);

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.getAllPosts();

        // Verify the results
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
    }

    @Test
    void testGetPostsByUserId_Exception() {
        Long userId = 1L;
        int offset = 0;
        int pageSize = 10;

        when(mockPostRepository.getPostsByUserId(anyLong(), any(PageRequest.class)))
                .thenThrow(new RuntimeException("DB error"));

        assertThrows(RuntimeException.class, () -> postServiceUnderTest.getPostsByUserId(userId, offset, pageSize, 1L));
    }

    @Test
    void testGetAllPosts_PostRepositoryReturnsNoItems() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(Collections.emptyList(), HttpStatusCode.valueOf(200));
        when(mockPostRepository.findAll()).thenReturn(Collections.emptyList());

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.getAllPosts();

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Disabled
    void testGetAllPostsByUniId() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(200));

        // Configure PostRepository.getPostsByUniversityId(...).
        Page<PostData> postData = (Page<PostData>) List.of(PostData.builder()
                .postId("postId")
                .userId(0L)
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .votes(0)
                .caption("caption")
                .filePath(List.of("value"))
                .postType("postType")
                .isEdited(false)
                .universityId(0)
                .views(0)
                .build());

        Pageable page = PageRequest.of(0, 15).withSort(Sort.by(Sort.Direction.DESC,"createdAt"));
        when(mockPostRepository.getPostsByUniversityId(0, List.of(),page)).thenReturn(postData);

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.getAllPostsByUniId(0L,0, 0, 15);

        // Verify the results
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
    }

    @Test
    void testGetAllPostsByUniId_PostRepositoryReturnsNoItems() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(Collections.emptyList(), HttpStatusCode.valueOf(200));
        Pageable page = PageRequest.of(0, 15).withSort(Sort.by(Sort.Direction.DESC,"createdAt"));
        when(mockPostRepository.getPostsByUniversityId(0,List.of(),page)).thenReturn(Page.empty());

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.getAllPostsByUniId(0L,0, 0 ,15);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetAllPostsByUniId_Exception() {
        Integer universityId = 1;

        Pageable page = PageRequest.of(0, 15).withSort(Sort.by(Sort.Direction.DESC,"createdAt"));
        when(mockPostRepository.getPostsByUniversityId(universityId, List.of(),page))
                .thenThrow(new RuntimeException("DB error"));

        assertThrows(RuntimeException.class, () -> postServiceUnderTest.getAllPostsByUniId(0L,universityId, 0 ,15));
    }

    @Test
    void testGetPostsByType() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(200));

        // Dummy data setup
        PostData dummyPost = PostData.builder()
                .postId("postId")
                .userId(0L)
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .votes(0)
                .caption("caption")
                .filePath(List.of("value"))
                .postType("REEL")
                .isEdited(false)
                .universityId(0)
                .views(0)
                .build();

        List<PostData> postData = List.of(dummyPost);
        Page<PostData> postDataPage = new PageImpl<>(postData);

        // Mock repository calls
        when(mockPostRepository.getPostsByType(eq("REEL"), eq(true), any(Pageable.class)))
                .thenReturn(postDataPage);

        GetUserPostDataDTO postDataDTO = GetUserPostDataDTO.builder()
                .firstName("firstName")
                .username("username")
                .avatar("avatar")
                .role("role")
                .isPremiumUser("isPremiumUser")
                .build();
        when(mockUserRepository.getUserPostDataById(0L)).thenReturn(postDataDTO);

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.getPostsByType(0L, "REEL", 0, 5);

        // Verify the results
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.hasBody()).isTrue();
    }

//    @Test
//    void testGetPostsByType_PostRepositoryReturnsNoItems() {
//        // Setup
//        final ResponseEntity<?> expectedResult = new ResponseEntity<>(Collections.emptyList(), HttpStatusCode.valueOf(200));
//        Pageable page = PageRequest.of(0, 15).withSort(Sort.by(Sort.Direction.DESC,"createdAt"));
//
//        when(mockPostRepository.getPostsByType("REEL",true,page)).thenReturn(Collections.emptyList());
//
//
//        when(mockPostRepository.getPostsByType("REEL", true, page)).thenReturn(Collections.emptyList());
//
//        // Run the test
//        final ResponseEntity<?> result = postServiceUnderTest.getPostsByType(0L,"REEL",0,0);
//
//        // Verify the results
//        assertThat(result).isEqualTo(expectedResult);
//    }

//    @Test
//    void testGetPostsByType_Exception() {
//        String type = "someType";
//        PostData dummyPost = PostData.builder()
//                .postId("postId")
//                .userId(0L)
//                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
//                .votes(0)
//                .caption("caption")
//                .filePath(List.of("value"))
//                .postType("REEL")
//                .isEdited(false)
//                .universityId(0)
//                .views(0)
//                .build();
//
//        final List<PostData> postData = List.of(dummyPost);
//        Page<PostData> postDataPage = new PageImpl<>(postData);
//        Pageable page = PageRequest.of(0, 15).withSort(Sort.by(Sort.Direction.DESC,"createdAt"));
//
//        when(mockPostRepository.getPostsByType(type,true,page))
//                .thenThrow(new RuntimeException("DB error"));
//
//        assertThrows(RuntimeException.class, () -> postServiceUnderTest.getPostsByType(0L, type,0,0));
//    }


    @Test
    void testConvertPostsDTO1() {
        // Setup
        final List<PostData> posts = List.of(PostData.builder()
                .postId("postId")
                .userId(0L)
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .votes(0)
                .caption("caption")
                .filePath(List.of("value"))
                .postType("postType")
                .isEdited(false)
                .universityId(0)
                .views(0)
                .build());

        // Configure UserRepository.getUserPostDataById(...).
        final GetUserPostDataDTO postDataDTO = GetUserPostDataDTO.builder()
                .firstName("firstName")
                .username("username")
                .avatar("avatar")
                .role("role")
                .isPremiumUser("isPremiumUser")
                .build();
        when(mockUserRepository.getUserPostDataById(0L)).thenReturn(postDataDTO);

        // Run the test
        final List<GetPostDTO> result = postServiceUnderTest.convertPostsDTO(0L, posts);

        // Verify the results
    }

    @Test
    void testConvertPostsDTO2() {
        // Setup
        final Page<PostData> posts = new PageImpl<>(List.of(PostData.builder()
                .postId("postId")
                .userId(0L)
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .votes(0)
                .caption("caption")
                .filePath(List.of("value"))
                .postType("postType")
                .isEdited(false)
                .universityId(0)
                .views(0)
                .build()));

        // Configure UserRepository.getUserPostDataById(...).
        final GetUserPostDataDTO postDataDTO = GetUserPostDataDTO.builder()
                .firstName("firstName")
                .username("username")
                .avatar("avatar")
                .role("role")
                .isPremiumUser("isPremiumUser")
                .build();
        when(mockUserRepository.getUserPostDataById(0L)).thenReturn(postDataDTO);

        // Run the test
        final List<GetPostDTO> result = postServiceUnderTest.convertPostsDTO(0L,posts);

        // Verify the results
    }

    @Test
    public void testVote_NewLike() {
        // Setup
        String postId = "1";
        long userId = 1L;
        String type = "LIKED";

        PostData postData = new PostData();
        postData.setPostId(postId);
        postData.setUserId(1L); // Different user ID for reputation update
        postData.setVotes(0);

        when(mockPostRepository.findById(postId)).thenReturn(Optional.of(postData));
        when(mockLikeDislikeRepository.findByPostIdAndUserId(postId, 1L)).thenReturn(Optional.empty());

        // Execute
        ResponseEntity<?> response = postServiceUnderTest.vote(userId, postId, type);

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody()); // Votes should increase by 1

        verify(mockPostRepository).save(postData);
    }

    @Test
    public void testVote_NewDisLike() {
        // Setup
        String postId = "1";
        long userId = 1L;
        String type = "DISLIKED";

        PostData postData = new PostData();
        postData.setPostId(postId);
        postData.setUserId(1L); // Different user ID for reputation update
        postData.setVotes(0);

        when(mockPostRepository.findById(postId)).thenReturn(Optional.of(postData));
        when(mockLikeDislikeRepository.findByPostIdAndUserId(postId, 1L)).thenReturn(Optional.empty());

        // Execute
        ResponseEntity<?> response = postServiceUnderTest.vote(userId, postId, type);

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(-1, response.getBody()); // Votes should increase by 1

        verify(mockLikeDislikeRepository).save(any(LikeDislike.class));
        verify(mockPostRepository).save(postData);
    }

    @Test
    public void testVote_ExistingLikeToDislike() {
        // Setup
        String postId = "1";
        long userId = 1L;
        String type = "DISLIKED";

        PostData postData = new PostData();
        postData.setPostId(postId);
        postData.setUserId(1L); // Different user ID for reputation update
        postData.setVotes(0);

        when(mockPostRepository.findById(postId)).thenReturn(Optional.of(postData));
        when(mockLikeDislikeRepository.findByPostIdAndUserId(postId, 1L)).thenReturn(Optional.empty());

        // Execute
        ResponseEntity<?> response = postServiceUnderTest.vote(userId, postId, type);

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(-1, response.getBody()); // Votes should increase by 1

        verify(mockPostRepository).save(postData);

    }

    @Test
    public void testVote_ExistingDisLikeToLike() {
        // Setup
        String postId = "1";
        long userId = 1L;
        String type = "LIKED";

        PostData postData = new PostData();
        postData.setPostId(postId);
        postData.setUserId(1L); // Different user ID for reputation update
        postData.setVotes(0);

        when(mockPostRepository.findById(postId)).thenReturn(Optional.of(postData));
        when(mockLikeDislikeRepository.findByPostIdAndUserId(postId, 1L)).thenReturn(Optional.empty());

        // Execute
        ResponseEntity<?> response = postServiceUnderTest.vote(userId, postId, type);

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody()); // Votes should increase by 1

        verify(mockPostRepository).save(postData);
    }

    @Test
    public void testVote_RemoveExistingDislike() {
        // Setup
        String postId = "1";
        long userId = 1L;
        String type = "UNDISLIKED";

        PostData postData = new PostData();
        postData.setPostId(postId);
        postData.setUserId(1L); // Different user ID for reputation update
        postData.setVotes(0);

        when(mockPostRepository.findById(postId)).thenReturn(Optional.of(postData));
        when(mockLikeDislikeRepository.findByPostIdAndUserId(postId, 1L)).thenReturn(Optional.empty());

        // Execute
        ResponseEntity<?> response = postServiceUnderTest.vote(userId, postId, type);

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody());

        verify(mockPostRepository).save(postData);
    }


    @Test
    void testVote_PostRepositoryFindByIdReturnsAbsent() {
        // Setup
        long userId = 1L;
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(404));
        when(mockPostRepository.findById("postId")).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.vote(userId, "postId", "type");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }



    @Disabled
    void testGetAllVotesByPostId() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(200));

        // Configure LikeDislikeRepository.getAllVotesByPostId(...).
        final List<LikeDislike> likeDislikes = List.of(LikeDislike.builder()
                .postId("postId")
                .userId(1L)
                .type("type")
                .build());
        when(mockLikeDislikeRepository.getAllVotesByPostId("postId")).thenReturn(likeDislikes);

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.getAllVotesByPostId("postId");

        // Verify the results
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody()).isEqualTo(likeDislikes);
    }

    @Test
    void testGetAllVotesByPostId_Exception() {
        String postId = "samplePostId";

        // Define behavior for the mocked likeDislikeRepository to throw a RuntimeException
        when(mockLikeDislikeRepository.getAllVotesByPostId(postId))
                .thenThrow(new RuntimeException("Database error while fetching votes by postId"));

        // Assert that a RuntimeException is thrown
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postServiceUnderTest.getAllVotesByPostId(postId);
        });

        // Verify the exception message
        assertEquals("Database error while fetching votes by postId", exception.getCause().getMessage());
    }

    @Test
    void testGetAllVotesByPostId_LikeDislikeRepositoryReturnsNoItems() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(Collections.emptyList(), HttpStatusCode.valueOf(200));
        when(mockLikeDislikeRepository.getAllVotesByPostId("postId")).thenReturn(Collections.emptyList());

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.getAllVotesByPostId("postId");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Disabled
    void testGetAllVotesByVoteType() {

        // Configure LikeDislikeRepository.getAllVotesByVoteType(...).
        final List<LikeDislike> likeDislikes = List.of(LikeDislike.builder()
                .postId("postId")
                .userId(0L)
                .type("type")
                .build());
        when(mockLikeDislikeRepository.getAllVotesByVoteType("postId", "type")).thenReturn(likeDislikes);

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.getAllVotesByVoteType("postId", "type");

        // Verify the results
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody()).isEqualTo(likeDislikes);
    }

    @Test
    void testGetAllVotesByVoteType_LikeDislikeRepositoryReturnsNoItems() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(Collections.emptyList(), HttpStatusCode.valueOf(200));
        when(mockLikeDislikeRepository.getAllVotesByVoteType("postId", "type")).thenReturn(Collections.emptyList());

        // Run the test
        final ResponseEntity<?> result = postServiceUnderTest.getAllVotesByVoteType("postId", "type");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetAllVotesByVoteType_Exception() {
        String postId = "samplePostId";
        String type = "like";

        // Define behavior for the mocked likeDislikeRepository to throw a RuntimeException
        when(mockLikeDislikeRepository.getAllVotesByVoteType(postId, type))
                .thenThrow(new RuntimeException("Database error while fetching votes by vote type"));

        // Assert that a RuntimeException is thrown
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postServiceUnderTest.getAllVotesByVoteType(postId, type);
        });

        // Verify the exception message
        assertEquals("Database error while fetching votes by vote type", exception.getCause().getMessage());
    }
}
