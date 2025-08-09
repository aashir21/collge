package com.collge.USERSERVICE.service;

import com.collge.USERSERVICE.DTO.FriendDataDTO;
import com.collge.USERSERVICE.DTO.FriendStatusDTO;
import com.collge.USERSERVICE.enums.FriendshipStatus;
import com.collge.USERSERVICE.model.Friendship;
import com.collge.USERSERVICE.model.User;
import com.collge.USERSERVICE.repository.FriendshipRepository;
import com.collge.USERSERVICE.repository.UserRepository;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class FriendService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;


    private static final Logger LOGGER = LoggerFactory.getLogger(FriendService.class);

    public ResponseEntity<?> sendFriendRequest(Long senderId, Long receiverId) {
        try {
            // Find both users
            LOGGER.info("Fetching users");
            Optional<User> senderOptional = userRepository.findById(senderId);
            Optional<User> receiverOptional = userRepository.findById(receiverId);

            LOGGER.info("Fetcehd users");

            if (senderOptional.isEmpty() || receiverOptional.isEmpty()) {
                return new ResponseEntity<>("User not found with ID: " + receiverId + " or " + senderId, HttpStatus.NOT_FOUND);
            }

            User sender = senderOptional.get();
            User receiver = receiverOptional.get();

            // Check if a pending request already exists
            LOGGER.info("Checking for any existing req");
            List<Friendship> pendingRequest = friendshipRepository.findFriendship(sender, receiver);

            if (!pendingRequest.isEmpty()) {
                LOGGER.info("Existing req found");

                if (pendingRequest.get(0).getStatus().equals(FriendshipStatus.PENDING)) {
                    Friendship request = pendingRequest.get(0);
                    friendshipRepository.delete(request);
                    return new ResponseEntity<>(null, HttpStatus.OK);
                }
            }

            // Create and save a new friendship request
            Friendship friendship = new Friendship();
            friendship.setUser(sender);
            friendship.setFriend(receiver);
            friendship.setStatus(FriendshipStatus.PENDING);

            friendshipRepository.save(friendship);

            return new ResponseEntity<>(FriendshipStatus.PENDING.toString(), HttpStatus.OK);

        } catch (Exception e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<?> respondToFriendRequest(Long senderId, Long receiverId, boolean accept) {
        try {
            // Find both users by their IDs
            Optional<User> senderOptional = userRepository.findById(senderId);
            Optional<User> receiverOptional = userRepository.findById(receiverId);

            if (senderOptional.isEmpty() || receiverOptional.isEmpty()) {
                return new ResponseEntity<>("User not found with ID: " + senderId + " or " + receiverId, HttpStatus.NOT_FOUND);
            }

            User sender = senderOptional.get();
            User receiver = receiverOptional.get();

            // Find the friendship by sender and receiver
            List<Friendship> optionalFriendship = friendshipRepository.findFriendship(sender, receiver);

            if (optionalFriendship.isEmpty()) {
                return new ResponseEntity<>("Friend request no longer exists", HttpStatus.NOT_FOUND);
            }

            Friendship friendship = optionalFriendship.get(0);

            if (accept) {
                // Update friendship status to ACCEPTED
                friendship.setStatus(FriendshipStatus.ACCEPTED);
                friendshipRepository.save(friendship);

                    Friendship reverseFriendship = new Friendship();
                    reverseFriendship.setUser(receiver);  // Receiver is now the user
                    reverseFriendship.setFriend(sender);  // Sender is now the friend
                    reverseFriendship.setStatus(FriendshipStatus.ACCEPTED);
                    friendshipRepository.save(reverseFriendship);  // Save the reverse friendship

            } else {
                // Delete the original friendship request if rejected
                friendshipRepository.delete(friendship);
                return new ResponseEntity<>(FriendshipStatus.REJECTED.toString(), HttpStatus.OK);
            }

            return new ResponseEntity<>(FriendshipStatus.ACCEPTED.toString(), HttpStatus.OK);

        } catch (Exception e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<?> removeFriend(Long senderId, Long receiverId){

        Optional<User> senderOptional = userRepository.findById(senderId);
        Optional<User> receiverOptional = userRepository.findById(receiverId);

        List<Friendship> optionalFriendRequest = friendshipRepository.findFriendship(senderOptional.get(), receiverOptional.get());

        // Delete the first friendship recird
        if(!optionalFriendRequest.isEmpty()){
            Friendship friendship = optionalFriendRequest.get(0);

            friendshipRepository.delete(friendship);
        }

        List<Friendship> optionalFriendRequest2 = friendshipRepository.findFriendship(receiverOptional.get(), senderOptional.get());

        // Delete the first friendship recird
        if(!optionalFriendRequest2.isEmpty()){
            Friendship friendship2 = optionalFriendRequest2.get(0);

            friendshipRepository.delete(friendship2);
        }

        return new ResponseEntity<>("Deleted successfully", HttpStatus.OK);

    }

    public ResponseEntity<?> getFriendRequestBySenderAndReceiverId(Long senderId, Long receiverId){

        try{

            // Find both users
            Optional<User> senderOptional = userRepository.findById(senderId);
            Optional<User> receiverOptional = userRepository.findById(receiverId);

            List<Friendship> optionalFriendRequest = friendshipRepository.findFriendship(senderOptional.get(), receiverOptional.get());

            if(optionalFriendRequest.isEmpty()){
                return new ResponseEntity<>("No friendship found", HttpStatus.NOT_FOUND);
            }

            Friendship friendRequest = optionalFriendRequest.get(0);

            FriendStatusDTO responseDTO = new FriendStatusDTO(
                    friendRequest.getUser().getUserId(),    // Get userId from the stored Friendship entity
                    friendRequest.getFriend().getUserId(),  // Get friendId from the stored Friendship entity
                    friendRequest.getStatus().toString()
            );

            return new ResponseEntity<>(responseDTO, HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getFriendsList(Long userId, int offset, int pageSize){

        try {

            Pageable pageable = PageRequest.of(offset, pageSize);
            Page<Friendship> friendshipPage = friendshipRepository.findAllByUserIdAndStatusAccepted(userId, pageable);

            List<FriendDataDTO> friendList = convertUserToFriendDTO(friendshipPage);

            return new ResponseEntity<>(friendList, HttpStatus.OK);

        } catch (Exception e){

            throw new RuntimeException("Something went wrong: " + e.getMessage());

        }

    }

    public ResponseEntity<?> getLinkUpVerifiedFriends(Long userId, int offset, int pageSize){

        try {

            Pageable pageable = PageRequest.of(offset, pageSize);
            Page<Friendship> friendshipPage = friendshipRepository.findAllByUserIdAndStatusAccepted(userId, pageable);

            List<FriendDataDTO> friendList = convertLinkUpVerifiedUserToFriendDTO(friendshipPage);

            return new ResponseEntity<>(friendList, HttpStatus.OK);

        } catch (Exception e){

            throw new RuntimeException("Something went wrong: " + e.getMessage());

        }

    }

    private List<FriendDataDTO> convertLinkUpVerifiedUserToFriendDTO(Page<Friendship> friendList){

        List<FriendDataDTO> friendDataDTOList = new ArrayList<>();

        friendList.forEach((friend) -> {

            User fetchedFriend = userRepository.findById(friend.getFriend().getUserId()).get();

            if(fetchedFriend.isLinkUpVerified()){
                FriendDataDTO friendDataDTO = FriendDataDTO.builder()
                        .friendId(fetchedFriend.getUserId())
                        .firstName(fetchedFriend.getFirstName())
                        .lastName(fetchedFriend.getLastName())
                        .username(fetchedFriend.getUsername())
                        .avatar(fetchedFriend.getAvatar())
                        .isPremiumUser(fetchedFriend.isPremiumUser())
                        .role(fetchedFriend.getRole().toString())
                        .build();

                friendDataDTOList.add(friendDataDTO);
            }
        });

        return friendDataDTOList;

    }

    private List<FriendDataDTO> convertUserToFriendDTO(Page<Friendship> friendList){

        List<FriendDataDTO> friendDataDTOList = new ArrayList<>();

        friendList.forEach((friend) -> {

            User fetchedFriend = userRepository.findById(friend.getFriend().getUserId()).get();

            FriendDataDTO friendDataDTO = FriendDataDTO.builder()
                    .friendId(fetchedFriend.getUserId())
                    .firstName(fetchedFriend.getFirstName())
                    .lastName(fetchedFriend.getLastName())
                    .username(fetchedFriend.getUsername())
                    .avatar(fetchedFriend.getAvatar())
                    .isPremiumUser(fetchedFriend.isPremiumUser())
                    .role(fetchedFriend.getRole().toString())
                    .build();

            friendDataDTOList.add(friendDataDTO);
        });

        return friendDataDTOList;

    }

}
