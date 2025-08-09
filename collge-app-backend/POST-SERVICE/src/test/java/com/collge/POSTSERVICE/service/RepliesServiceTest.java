package com.collge.POSTSERVICE.service;

import com.collge.POSTSERVICE.dto.CommentDTO;
import com.collge.POSTSERVICE.dto.CreateReplyDTO;
import com.collge.POSTSERVICE.model.Comment;
import com.collge.POSTSERVICE.model.Reply;
import com.collge.POSTSERVICE.repository.CommentRepository;
import com.collge.POSTSERVICE.repository.RepliesRepository;
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
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RepliesServiceTest {

    @Mock
    private CommentRepository mockCommentRepository;
    @Mock
    private RepliesRepository mockRepliesRepository;
    @Mock
    private CommentService mockCommentService;

    @InjectMocks
    private RepliesService repliesServiceUnderTest;

    @Test
    void testAddReplyToPost() {
        // Setup
        final CreateReplyDTO createReplyDTO = CreateReplyDTO.builder()
                .commentId("commentId")
                .userId(0L)
                .reply("comment")
                .build();

        when(mockCommentRepository.findById("commentId")).thenReturn(Optional.of(Comment.builder().build()));

        // Run the test
        final ResponseEntity<?> result = repliesServiceUnderTest.addReplyToPost(createReplyDTO);

        // Verify the results
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
        verify(mockRepliesRepository).save(any(Reply.class));
    }

    @Test
    void testAddReplyToPost_CommentRepositoryReturnsAbsent() {
        // Setup
        final CreateReplyDTO createReplyDTO = CreateReplyDTO.builder()
                .commentId("commentId")
                .userId(0L)
                .reply("comment")
                .build();
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("No comment found with ID: commentId", HttpStatusCode.valueOf(404));
        when(mockCommentRepository.findById("commentId")).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = repliesServiceUnderTest.addReplyToPost(createReplyDTO);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testAddReplyToPost_whenExceptionOccurs() {
        // Setup
        final String commentId = "commentId";
        final CreateReplyDTO createReplyDTO = CreateReplyDTO.builder()
                .commentId(commentId)
                .userId(0L)
                .reply("replyText")
                .build();

        // Simulate an exception when finding the comment
        when(mockCommentRepository.findById(commentId)).thenThrow(new RuntimeException("Database error"));

        // Run the test and expect the exception
        assertThrows(RuntimeException.class, () -> {
            repliesServiceUnderTest.addReplyToPost(createReplyDTO);
        });

        // Optionally, you can verify the exception message
        try {
            repliesServiceUnderTest.addReplyToPost(createReplyDTO);
        } catch (RuntimeException e) {
            assertThat(e.getMessage()).isEqualTo("Something went wrong: Database error");
        }

        // Verify that repliesRepository.save was NOT called
        verify(mockRepliesRepository, never()).save(any(Reply.class));
    }

    @Test
    void testGetRepliesByCommentId() {
        // Setup
        final String parentCommentId = "parentCommentId";
        final int offset = 0;
        final int size = 5;

        // Configure RepliesRepository.getRepliesByCommentId(...).
        final List<Comment> commentList = List.of(Comment.builder().commentId("replyCommentId").build()); // Assuming replies have different IDs
        final Page<Comment> comments = new PageImpl<>(commentList);
        when(mockRepliesRepository.getRepliesByCommentId(eq(parentCommentId), any(Pageable.class)))
                .thenReturn(comments);

        // Configure the mockCommentService to return a list of CommentDTOs
        final List<CommentDTO> expectedCommentDTOs = List.of(CommentDTO.builder().parentCommentId(parentCommentId).build());
        when(mockCommentService.convertCommentDTO(commentList)).thenReturn(expectedCommentDTOs);

        // Run the test
        final ResponseEntity<?> result = repliesServiceUnderTest.getRepliesByCommentId(parentCommentId, offset, size);

        // Verify the results
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Assert the response body contains the expected list of CommentDTOs
        assertThat(result.getBody()).isEqualTo(expectedCommentDTOs);

        // Verify interactions with mock repositories
        verify(mockRepliesRepository).getRepliesByCommentId(eq(parentCommentId), any(Pageable.class));
        verify(mockCommentService).convertCommentDTO(commentList);
    }

    @Test
    void testGetRepliesByCommentId_whenExceptionOccurs() {
        // Setup
        final String parentCommentId = "parentCommentId";

        // Simulate an exception when fetching replies
        when(mockRepliesRepository.getRepliesByCommentId(eq(parentCommentId), any(Pageable.class)))
                .thenThrow(new RuntimeException("Database error"));

        // Run the test and expect the exception
        assertThrows(RuntimeException.class, () -> {
            repliesServiceUnderTest.getRepliesByCommentId(parentCommentId, 0, 5);
        });

        // Optionally, you can verify the exception message
        try {
            repliesServiceUnderTest.getRepliesByCommentId(parentCommentId, 0, 5);
        } catch (RuntimeException e) {
            assertThat(e.getMessage()).isEqualTo("Something went wrong: Database error");
        }

        // Verify that commentService.convertCommentDTO was NOT called
        verify(mockCommentService, never()).convertCommentDTO(anyList());
    }

    @Test
    void testGetRepliesCount() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(0, HttpStatusCode.valueOf(200));
        when(mockRepliesRepository.countRepliesToComment("parentCommentId")).thenReturn(0);

        // Run the test
        final ResponseEntity<?> result = repliesServiceUnderTest.getRepliesCount("parentCommentId");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetRepliesCount_whenExceptionOccurs() {
        // Setup
        final String parentCommentId = "parentCommentId";

        // Simulate an exception when counting replies
        when(mockRepliesRepository.countRepliesToComment(parentCommentId))
                .thenThrow(new RuntimeException("Database error"));

        // Run the test and expect the exception
        assertThrows(RuntimeException.class, () -> {
            repliesServiceUnderTest.getRepliesCount(parentCommentId);
        });

        // Optionally, you can verify the exception message
        try {
            repliesServiceUnderTest.getRepliesCount(parentCommentId);
        } catch (RuntimeException e) {
            assertThat(e.getMessage()).isEqualTo("Something went wrong: Database error");
        }
    }

    @Test
    void testDeleteReplyById() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(204));

        // Configure RepliesRepository.findById(...).
        final Optional<Reply> replyOptional = Optional.of(Reply.builder()
                .parentCommentId("commentId")
                .userId(0L)
                .comment("comment")
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .votes(0)
                .build());
        when(mockRepliesRepository.findById("replyId")).thenReturn(replyOptional);

        // Run the test
        final ResponseEntity<?> result = repliesServiceUnderTest.deleteReplyById("replyId");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
        verify(mockRepliesRepository).deleteById("replyId");
    }

    @Test
    void testDeleteReplyById_RepliesRepositoryFindByIdReturnsAbsent() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("No reply found with ID: replyId", HttpStatusCode.valueOf(404));
        when(mockRepliesRepository.findById("replyId")).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = repliesServiceUnderTest.deleteReplyById("replyId");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testDeleteReplyById_whenExceptionOccurs() {
        // Setup
        final String replyId = "replyId";

        // Simulate an exception when finding the reply
        when(mockRepliesRepository.findById(replyId)).thenThrow(new RuntimeException("Database error"));

        // Run the test and expect the exception
        assertThrows(RuntimeException.class, () -> {
            repliesServiceUnderTest.deleteReplyById(replyId);
        });

        // Optionally, you can verify the exception message
        try {
            repliesServiceUnderTest.deleteReplyById(replyId);
        } catch (RuntimeException e) {
            assertThat(e.getMessage()).isEqualTo("Something went wrong: Database error");
        }

        // Verify that repliesRepository.deleteById was NOT called
        verify(mockRepliesRepository, never()).deleteById(anyString());
    }
}
