package com.collge.USERSERVICE.service;

import com.collge.USERSERVICE.DTO.BlockUserDTO;
import com.collge.USERSERVICE.DTO.GetUserPostDataDTO;
import com.collge.USERSERVICE.exception.UserNotFoundException;
import com.collge.USERSERVICE.model.User;
import com.collge.USERSERVICE.model.UserBlock;
import com.collge.USERSERVICE.repository.UserBlockRepository;
import com.collge.USERSERVICE.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BlockService {

    @Autowired
    private UserBlockRepository userBlockRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendService friendService;

    /**
     * Adds a new block record (blocker blocks blocked).
     * Returns the updated list of blocked users for the blocker.
     */
    public ResponseEntity<?> blockUser(BlockUserDTO blockUserDTO) {

        Long blockerId = blockUserDTO.getBlockerId();
        Long blockedId = blockUserDTO.getBlockedId();

        // 1) Verify the users exist
        Optional<User> blockerOpt = userRepository.findById(blockerId);
        Optional<User> blockedOpt = userRepository.findById(blockedId);
        if (!blockerOpt.isPresent() || !blockedOpt.isPresent()) {
            throw new IllegalArgumentException("Blocker or Blocked user does not exist.");
        }

        // 2) Check if already blocked
        boolean exists = userBlockRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId);
        if (!exists) {
            // 3) Insert the record

            friendService.removeFriend(blockerId, blockedId);

            UserBlock userBlock = UserBlock.builder()
                    .blockerId(blockerId)
                    .blockedId(blockedId)
                    .build();
            userBlockRepository.save(userBlock);
        }

        // 4) Return updated list of all the blocked users
        return new ResponseEntity<>("User blocked!", HttpStatus.OK);
    }

    public List<Long> getAllBlockedUsersIds(Long userId) {

        try{

            List<Long> userIdsWhoBlockMe = userBlockRepository.findBlockerIdsByBlockedId(userId);
            List<Long> userIdsBlockedByMe = userBlockRepository.findBlockerIdsByBlockerId(userId);

            Set<Long> excludedAuthorIds = new HashSet<>(userIdsBlockedByMe);
            excludedAuthorIds.addAll(userIdsWhoBlockMe);


            return excludedAuthorIds.stream().toList();

        }
        catch (UserNotFoundException e){
            throw new UserNotFoundException("Something went wrong: " + e.getMessage());
        }

    }

    /**
     * Returns a list of all the blocked users (User objects) for a given blockerId.
     */
    public ResponseEntity<?> getAllBlockedUsersWithData(Long blockerId, int offset, int pageSize) {
        try{
            // 1) Retrieve the blocked user IDs for this blocker

            Pageable pageable = PageRequest.of(offset, pageSize);
            Page<User> blockedUsersIn = userBlockRepository.findBlockedUserWithData(blockerId, pageable);

            List<User> blockedUsersList = blockedUsersIn.getContent();
            List<GetUserPostDataDTO> blockedUsers = convertUserData(blockedUsersList);

            return new ResponseEntity<>(blockedUsers, HttpStatus.OK);
        }catch (UserNotFoundException e){
            throw new UserNotFoundException("Something went wrong: " + e.getMessage());
        }
    }

    private List<GetUserPostDataDTO> convertUserData(List<User> blockedUsersIn){

        List<GetUserPostDataDTO> usersOut = new ArrayList<>();

        blockedUsersIn.forEach((blockedUser) -> {

            GetUserPostDataDTO userPostDataDTO = GetUserPostDataDTO.builder()
                    .userId(blockedUser.getUserId())
                    .universityId(blockedUser.getUniversityId())
                    .firstName(blockedUser.getFirstName())
                    .lastName(blockedUser.getLastName())
                    .username(blockedUser.getUsername())
                    .avatar(blockedUser.getAvatar())
                    .role(blockedUser.getRole())
                    .isPremiumUser(blockedUser.isPremiumUser())
                    .build();

            usersOut.add(userPostDataDTO);
        });

        return usersOut;
    }


    public ResponseEntity<?> unblock(Long blockerId, Long blockedId) {

        try{

            userBlockRepository.deleteBlock(blockerId, blockedId);

            return new ResponseEntity<>("User unblocked", HttpStatus.OK);

        }catch (UserNotFoundException e){
            throw new RuntimeException("Something went wrong : " + e.getMessage());
        }

    }
}
