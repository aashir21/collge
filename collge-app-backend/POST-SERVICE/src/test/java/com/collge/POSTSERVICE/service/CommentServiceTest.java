package com.collge.POSTSERVICE.service;

import com.collge.POSTSERVICE.dto.CommentDTO;
import com.collge.POSTSERVICE.dto.CreateCommentDTO;
import com.collge.POSTSERVICE.dto.GetUserPostDataDTO;
import com.collge.POSTSERVICE.model.Comment;
import com.collge.POSTSERVICE.model.PostData;
import com.collge.POSTSERVICE.repository.CommentRepository;
import com.collge.POSTSERVICE.repository.PostRepository;
import com.collge.POSTSERVICE.repository.RepliesRepository;
import com.collge.POSTSERVICE.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private PostRepository mockPostRepository;
    @Mock
    private CommentRepository mockCommentRepository;
    @Mock
    private UserRepository mockUserRepository;
    @Mock
    private RepliesRepository mockRepliesRepository;

    @InjectMocks
    private CommentService commentServiceUnderTest;

    @BeforeEach
    void setUp() {
        commentServiceUnderTest.repliesRepository = mockRepliesRepository;
    }

    @Test
    void testAddCommentToPost() {
        // Setup
        final String postId = "postId";
        final Long userId = 0L;
        final String commentText = "comment";

        final CreateCommentDTO createCommentDTO = CreateCommentDTO.builder()
                .postId(postId)
                .userId(userId)
                .comment(commentText)
                .build();

        // Mock the postRepository to return a valid PostData
        final PostData postData = PostData.builder().postId(postId).build();
        when(mockPostRepository.findById(postId)).thenReturn(Optional.of(postData));

        // Run the test
        final ResponseEntity<?> result = commentServiceUnderTest.addCommentToPost(createCommentDTO);

        // Verify the results
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Assert the response body contains the newly created comment
        assertThat(result.getBody()).isInstanceOf(Comment.class);
        Comment returnedComment = (Comment) result.getBody();
        assertThat(returnedComment.getParentCommentId()).isNull();
        assertThat(returnedComment.getVotes()).isEqualTo(0);
        assertThat(returnedComment.getComment()).isEqualTo(commentText);
        assertThat(returnedComment.getUserId()).isEqualTo(userId);
        assertThat(returnedComment.getPostId()).isEqualTo(postId);

        // Verify that commentRepository.save was called
        verify(mockCommentRepository).save(any(Comment.class));
    }

    @Test
    void testAddCommentToPost_PostRepositoryReturnsAbsent() {
        // Setup
        final CreateCommentDTO createCommentDTO = CreateCommentDTO.builder()
                .postId("postId")
                .userId(0L)
                .comment("comment")
                .build();
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("No post found with ID: postId", HttpStatusCode.valueOf(404));
        when(mockPostRepository.findById("postId")).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = commentServiceUnderTest.addCommentToPost(createCommentDTO);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }
    @Test
    void testAddCommentToPost_whenExceptionOccurs() {
        // Setup
        final String postId = "postId";
        final CreateCommentDTO createCommentDTO = CreateCommentDTO.builder()
                .postId(postId)
                .userId(0L)
                .comment("comment")
                .build();

        // Simulate an exception when finding the post
        when(mockPostRepository.findById(postId)).thenThrow(new RuntimeException("Database error"));

        // Run the test and expect the exception
        assertThrows(RuntimeException.class, () -> {
            commentServiceUnderTest.addCommentToPost(createCommentDTO);
        });

        // Optionally, you can verify the exception message
        try {
            commentServiceUnderTest.addCommentToPost(createCommentDTO);
        } catch (RuntimeException e) {
            assertThat(e.getMessage()).isEqualTo("Something went wrong: Database error");
        }

        // Verify that commentRepository.save was NOT called
        verify(mockCommentRepository, never()).save(any(Comment.class));
    }


    @Test
    void testGetCommentsByPostId() {
        // Setup
        final String postId = "postId";
        final int offset = 0;
        final int size = 5;

        // Configure CommentRepository.getCommentsByPostId(...).
        final List<Comment> commentList = List.of(Comment.builder()
                .commentId("commentId")
                .postId(postId)
                .userId(14L)
                .comment("comment")
                .parentCommentId("parentCommentId")
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .votes(0)
                .build());
        final Page<Comment> comments = new PageImpl<>(commentList);
        when(mockCommentRepository.getCommentsByPostId(eq(postId), any(Pageable.class))).thenReturn(comments);

        // Configure UserRepository.getUserPostDataById(...).
        final GetUserPostDataDTO postDataDTO = GetUserPostDataDTO.builder()
                .username("username")
                .avatar("avatar")
                .role("role")
                .isPremiumUser("isPremiumUser")
                .build();
        when(mockUserRepository.getUserPostDataById(14L)).thenReturn(postDataDTO);

        when(mockRepliesRepository.countRepliesToComment("commentId")).thenReturn(0);

        List<Long> blockedUsers = new ArrayList<>();

        // Run the test
        final ResponseEntity<?> result = commentServiceUnderTest.getCommentsByPostId(postId, offset, size);

        // Verify the results
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Assert the response body contains a list of CommentDTOs
        assertThat(result.getBody()).isInstanceOf(List.class);
        List<?> responseBody = (List<?>) result.getBody();
        assertThat(responseBody.size()).isEqualTo(1); // Expecting one comment in this case
        assertThat(responseBody.get(0)).isInstanceOf(CommentDTO.class);

        // You might want to add more specific assertions about the CommentDTO properties here
        // depending on how your `convertCommentDTO` method works

        // Verify interactions with mock repositories
        verify(mockCommentRepository).getCommentsByPostId(eq(postId),any(Pageable.class));
        verify(mockUserRepository).getUserPostDataById(14L);
        verify(mockRepliesRepository).countRepliesToComment("commentId");
    }

    @Test
    void testGetCommentsByPostId_whenExceptionOccurs() {
        // Setup
        final String postId = "postId";

        // Simulate an exception when fetching comments
        when(mockCommentRepository.getCommentsByPostId(eq(postId), any(Pageable.class)))
                .thenThrow(new RuntimeException("Database error"));

        // Run the test and expect the exception
        assertThrows(RuntimeException.class, () -> {
            commentServiceUnderTest.getCommentsByPostId(postId, 0, 5);
        });

        // Optionally, you can verify the exception message
        try {
            commentServiceUnderTest.getCommentsByPostId(postId, 0, 5);
        } catch (RuntimeException e) {
            assertThat(e.getMessage()).isEqualTo("Something went wrong: Database error");
        }

        // Verify other repository methods were NOT called
        verify(mockUserRepository, never()).getUserPostDataById(anyLong());
        verify(mockRepliesRepository, never()).countRepliesToComment(anyString());
    }

    @Test
    void testDeleteCommentById() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(204));

        // Configure CommentRepository.findById(...).
        final Optional<Comment> comment = Optional.of(Comment.builder()
                .commentId("commentId")
                .postId("postId")
                .userId(0L)
                .comment("comment")
                .parentCommentId("parentCommentId")
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .votes(0)
                .build());
        when(mockCommentRepository.findById("commentId")).thenReturn(comment);

        // Run the test
        final ResponseEntity<?> result = commentServiceUnderTest.deleteCommentById("commentId");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
        verify(mockRepliesRepository).deleteByCommentId("commentId");
        verify(mockCommentRepository).deleteById("commentId");
    }

    @Test
    void testDeleteCommentById_CommentRepositoryFindByIdReturnsAbsent() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("No comment found with ID: commentId", HttpStatusCode.valueOf(404));
        when(mockCommentRepository.findById("commentId")).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = commentServiceUnderTest.deleteCommentById("commentId");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testDeleteCommentById_whenExceptionOccurs() {
        // Setup
        final String commentId = "commentId";

        // Simulate an exception when finding the comment
        when(mockCommentRepository.findById(commentId)).thenThrow(new RuntimeException("Database error"));

        // Run the test and expect the exception
        assertThrows(RuntimeException.class, () -> {
            commentServiceUnderTest.deleteCommentById(commentId);
        });

        // Optionally, you can verify the exception message
        try {
            commentServiceUnderTest.deleteCommentById(commentId);
        } catch (RuntimeException e) {
            assertThat(e.getMessage()).isEqualTo("Something went wrong: Database error");
        }

        // Verify that other repository methods were NOT called
        verify(mockRepliesRepository, never()).deleteByCommentId(anyString());
        verify(mockCommentRepository, never()).deleteById(anyString());
    }

    @Test
    void testConvertCommentDTO1() {
        // Setup
        final Page<Comment> comments = new PageImpl<>(List.of(Comment.builder()
                .commentId("commentId")
                .postId("postId")
                .userId(0L)
                .comment("comment")
                .parentCommentId("parentCommentId")
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .votes(0)
                .build()));

        // Configure UserRepository.getUserPostDataById(...).
        final GetUserPostDataDTO postDataDTO = GetUserPostDataDTO.builder()
                .username("username")
                .avatar("avatar")
                .role("role")
                .isPremiumUser("isPremiumUser")
                .build();
        when(mockUserRepository.getUserPostDataById(0L)).thenReturn(postDataDTO);

        when(mockRepliesRepository.countRepliesToComment("commentId")).thenReturn(0);

        // Run the test
        final List<CommentDTO> result = commentServiceUnderTest.convertCommentDTO(comments);

        // Verify the results
    }

    @Test
    void testConvertCommentDTO2() {
        // Setup
        final List<Comment> comments = List.of(Comment.builder()
                .commentId("commentId")
                .postId("postId")
                .userId(0L)
                .comment("comment")
                .parentCommentId("parentCommentId")
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .votes(0)
                .build());

        // Configure UserRepository.getUserPostDataById(...).
        final GetUserPostDataDTO postDataDTO = GetUserPostDataDTO.builder()
                .username("username")
                .avatar("avatar")
                .role("role")
                .isPremiumUser("isPremiumUser")
                .build();
        when(mockUserRepository.getUserPostDataById(0L)).thenReturn(postDataDTO);

        when(mockRepliesRepository.countRepliesToComment("commentId")).thenReturn(0);

        // Run the test
        final List<CommentDTO> result = commentServiceUnderTest.convertCommentDTO(comments);

        // Verify the results
    }
}
