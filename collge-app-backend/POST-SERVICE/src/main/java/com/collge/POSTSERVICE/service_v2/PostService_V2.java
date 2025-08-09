package com.collge.POSTSERVICE.service_v2;

import com.collge.POSTSERVICE.dto.GetUserPostDataDTO;
import com.collge.POSTSERVICE.dto.GetVoteDTO;
import com.collge.POSTSERVICE.model.LikeDislike;
import com.collge.POSTSERVICE.repository.UserRepository;
import com.collge.POSTSERVICE.repository_v2.LikeDislikeRepository_V2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService_V2 {

    @Autowired
    private LikeDislikeRepository_V2 likeDislikeRepositoryV2;

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> getAllVotesByPostId(Long userId, String postId) {

        try{

            List<Long> blockedUsers = userRepository.getBlockedUsersIds(userId);

            List<LikeDislike> votes = likeDislikeRepositoryV2.getAllVotesByPostId(postId,blockedUsers);
            List<GetVoteDTO> convertedVotes = convertVoteToDTO(votes);

            return new ResponseEntity<>(convertedVotes, HttpStatus.OK);
        }
        catch (RuntimeException e){
            throw new RuntimeException(e);
        }
    }

    public ResponseEntity<?> getAllVotesByVoteType(Long userId,String postId, String type) {

        try{

            List<Long> blockedUsers = userRepository.getBlockedUsersIds(userId);

            List<LikeDislike> votes = likeDislikeRepositoryV2.getAllVotesByVoteType(postId, type, blockedUsers);
            List<GetVoteDTO> convertedVotes = convertVoteToDTO(votes);

            return new ResponseEntity<>(convertedVotes, HttpStatus.OK);
        }
        catch (RuntimeException e){
            throw new RuntimeException(e);
        }
    }

    private List<GetVoteDTO> convertVoteToDTO(List<LikeDislike> votes) {

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

        return  convertedVotes;
    }
}
