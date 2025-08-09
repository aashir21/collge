package com.collge.USERSERVICE.service;

import com.collge.USERSERVICE.DTO.*;
import com.collge.USERSERVICE.enums.OnlineStatus;
import com.collge.USERSERVICE.model.Role;
import com.collge.USERSERVICE.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.collge.USERSERVICE.exception.UserNotFoundException;
import com.collge.USERSERVICE.model.University;
import com.collge.USERSERVICE.model.User;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final ConfirmationToken cTokenRepository;

    private final EmailService emailService;

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;

    private static final String MISSING_USER_AVATAR_URL = "https://collge-stag-bucket.ams3.cdn.digitaloceanspaces.com/user-missing-avatar.png";
    private static final String PHOTO_VERIFICATION_TYPE = "SIGN_UP";

    @Value("${service-urls.baseEndpoint}")
    private String userServiceUrl;

    public UserService(UserRepository userRepository, ConfirmationToken cTokenRepository1, EmailService emailService1) {
        this.userRepository = userRepository;
        this.cTokenRepository = cTokenRepository1;
        this.emailService = emailService1;
    }

    public List<User> getAllUsers() {
        return this.userRepository.findAll();
    }

    public ResponseEntity<?> getUserById(long userId) {
        try {
            Optional<User> optionalUser = this.userRepository.findById(userId);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                UserDTO userDTO = UserDTO.builder().isPremiumUser(user.isPremiumUser())
                        .isVerified(user.isVerified())
                        .registrationType(user.getRegistrationType().toUpperCase())
                        .isBanned(user.isBanned())
                        .universityId(user.getUniversityId())
                        .build();
                return new ResponseEntity<>(userDTO, HttpStatus.FOUND);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception var6) {
            throw new UserNotFoundException("Something went wrong: " + var6.getMessage());
        }
    }

    public ResponseEntity<?> verifyEmail(Long userId, String code) {
        try {
            Optional<User> optionalUser = userRepository.findById(userId);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                if (verifyCode(user, code)) {
                    user.setVerified(true);
                    user.setConfirmationToken(null);
                    userRepository.save(user);
                    return new ResponseEntity<>("Email Verified! Enjoy!", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Link expired, please request a new one from app!",
                            HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>("User not found with id", HttpStatus.NOT_FOUND);
            }
        } catch (Exception var5) {
            throw new UserNotFoundException("Something went wrong: " + var5.getMessage());
        }
    }

    public boolean verifyCode(User user, String code) {
        try {
            Optional<com.collge.USERSERVICE.model.ConfirmationToken> confirmationToken = Optional
                    .ofNullable(this.cTokenRepository.findByUser(user).orElse(null));
            if (!confirmationToken.isPresent()) {
                return false;
            } else {
                com.collge.USERSERVICE.model.ConfirmationToken token = confirmationToken.get();
                return token.getCodeValue().equals(code) && !token.getExpiration().isBefore(LocalDateTime.now());
            }
        } catch (Exception var5) {
            throw new UserNotFoundException("Something went wrong: " + var5.getMessage());
        }
    }

    public ResponseEntity<?> resendVerifyEmail(Long userId) throws IOException {
        try {
            User user = this.userRepository.findById(userId).orElseThrow(() -> {
                return new UserNotFoundException("User not found");
            });
            Optional<com.collge.USERSERVICE.model.ConfirmationToken> confirmationToken = Optional
                    .ofNullable(this.cTokenRepository.findByUser(user).orElse(null));
            String code = RandomStringUtils.randomAlphanumeric(64);
            if (confirmationToken.isPresent()) {
                com.collge.USERSERVICE.model.ConfirmationToken token = confirmationToken.get();
                token.setUser(user);
                token.setCodeValue(code);
                token.setExpiration(LocalDateTime.now().plusMinutes(30L));
                user.setConfirmationToken(token.getUser().getConfirmationToken());
                this.cTokenRepository.save(token);
            }

            Long u_id = user.getUserId();
            String link = userServiceUrl + "/api/v1/user/verifyEmail?userId=" + u_id + "&code=" + code;
            this.emailService.send(user.getEmail(), link);
            this.userRepository.save(user);
            return new ResponseEntity<>("Email sent successfully, check your inbox", HttpStatus.OK);
        } catch (Exception var6) {
            throw new UserNotFoundException("Something went wrong: " + var6.getMessage());
        }
    }

    public ResponseEntity<?> getUserByEmail(String email) {
        try {
            Optional<User> optionalUser = this.userRepository.findByEmail(email);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                SearchDTO searchDTO = SearchDTO.builder().userId(user.getUserId()).username(user.getUsername())
                        .universityId(user.getUniversityId()).email(user.getEmail()).build();
                return new ResponseEntity<>(searchDTO, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception var5) {
            throw new UserNotFoundException("User not found with email : " + email);
        }
    }

    public SearchDTO getUserDetailsByEmail(String email) {
        try {
            Optional<User> optionalUser = this.userRepository.findByEmail(email);

            SearchDTO searchDTO = new SearchDTO();

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                searchDTO = SearchDTO.builder().userId(user.getUserId()).username(user.getUsername())
                        .universityId(user.getUniversityId()).email(user.getEmail()).build();
            }

            return searchDTO;
        } catch (Exception var5) {
            throw new UserNotFoundException("User not found with email : " + email);
        }
    }

    public ResponseEntity<?> isUserVerified(Long userId) {
        try {
            Optional<User> optionalUser = this.userRepository.findById(userId);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                return user.isVerified() ? new ResponseEntity<>(true, HttpStatus.OK)
                        : new ResponseEntity<>(false, HttpStatus.OK);
            } else {
                throw new UserNotFoundException("Something went wrong: ");
            }
        } catch (Exception var4) {
            throw new UserNotFoundException("No account was found with id: " + userId);
        }
    }

    public ResponseEntity<?> findUserByUsername(String username) {
        try {
            Optional<User> checkUser = this.userRepository.findByUsername(username);
            return checkUser.isPresent() ? new ResponseEntity<>("Username is already taken...", HttpStatus.CONFLICT)
                    : new ResponseEntity<>("No user found against this username", HttpStatus.OK);
        } catch (Exception var3) {
            throw new UserNotFoundException("Something went wrong : " + var3.getMessage());
        }
    }

    public ResponseEntity<?> getUserDetails(Long userId) {
        try {
            Optional<User> optionalUser = this.userRepository.findById(userId);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                University university = this.universityRepository.getUniById(user.getUniversityId());

                int numberOfPostsOfUser = postRepository.getNumberOfPostsByUserId(userId);

                UserDataDTO userDataDTO = UserDataDTO.builder().firstName(user.getFirstName()).userId(user.getUserId())
                        .universityId(university.getUniversityId()).username(user.getUsername())
                        .title(user.getTitle()).isWinkable(user.isWinkable())
                        .reputation(user.getReputation()).fire(user.getFire())
                        .universityName(university.getUniName()).bio(user.getBio())
                        .avatar(user.getAvatar()).isPremiumUser(user.isPremiumUser())
                        .role(user.getRole())
                        .numberOfPosts(numberOfPostsOfUser)
                        .build();

                return new ResponseEntity<>(userDataDTO, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception var6) {
            throw new UserNotFoundException("Something went wrong : " + var6.getMessage());
        }
    }

    public ResponseEntity<?> getUserLinkUpDataById(Long userId) {

        try {

            Optional<User> optionalUser = userRepository.findById(userId);

            if (optionalUser.isPresent()) {

                User user = optionalUser.get();

                University university = universityRepository.getUniById(user.getUniversityId());
                int postCount = postRepository.getNumberOfPostsByUserId(userId);

                LinkUpRequestDTO linkUpRequestDTO = LinkUpRequestDTO.builder()
                        .userId(user.getUserId())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .avatar(user.getAvatar())
                        .role(user.getRole().toString())
                        .username(user.getUsername())
                        .bio(user.getBio())
                        .isPremiumUser(user.isPremiumUser())
                        .isLinkUpVerified(user.isLinkUpVerified())
                        .uniName(university.getUniName())
                        .fire(user.getFire())
                        .reputation(user.getReputation())
                        .campus(user.getLocation())
                        .yearOfGraduation(user.getYearOfGraduation())
                        .winkable(user.isWinkable())
                        .images(List.of())
                        .interests(List.of())
                        .postCount(postCount)
                        .title(user.getTitle())
                        .build();

                return new ResponseEntity<>(linkUpRequestDTO, HttpStatus.OK);

            } else {
                LinkUpRequestDTO linkUpRequestDTO = LinkUpRequestDTO.builder()
                        .userId(null)
                        .firstName("Deleted")
                        .lastName("User")
                        .avatar(MISSING_USER_AVATAR_URL)
                        .role("USER")
                        .username("[deleted]")
                        .bio("")
                        .fire(0)
                        .reputation(0)
                        .isPremiumUser(false)
                        .isLinkUpVerified(false)
                        .uniName("Not Found")
                        .campus("unknown")
                        .images(List.of())
                        .interests(List.of())
                        .build();

                return new ResponseEntity<>(linkUpRequestDTO, HttpStatus.OK);
            }

        } catch (Exception var6) {
            throw new UserNotFoundException("Something went wrong : " + var6.getMessage());
        }

    }

    public ResponseEntity<?> getUserPostDataById(Long userId) {

        try {

            Optional<User> optionalUser = userRepository.findById(userId);

            if (optionalUser.isPresent()) {

                User user = optionalUser.get();

                GetUserPostDataDTO postDataDTO = GetUserPostDataDTO.builder()
                        .userId(user.getUserId())
                        .universityId(user.getUniversityId())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .username(user.getUsername())
                        .avatar(user.getAvatar())
                        .role(user.getRole())
                        .isPremiumUser(user.isPremiumUser())
                        .build();
                return new ResponseEntity<>(postDataDTO, HttpStatus.OK);

            } else {
                GetUserPostDataDTO postDataDTO = GetUserPostDataDTO.builder()
                        .userId(userId)
                        .universityId(1)
                        .firstName("Deleted")
                        .lastName("User")
                        .username("deleted")
                        .avatar(MISSING_USER_AVATAR_URL)
                        .role(Role.USER)
                        .isPremiumUser(false)
                        .build();
                return new ResponseEntity<>(postDataDTO, HttpStatus.OK);
            }

        } catch (Exception var6) {
            throw new UserNotFoundException("Something went wrong : " + var6.getMessage());
        }

    }

    public ResponseEntity<?> updateReputation(Long userId, int updatedVote) {
        try {
            Optional<User> optionalUser = userRepository.findById(userId);

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();

                int currentUserReputation = user.getReputation();
                user.setReputation(currentUserReputation + updatedVote);
                userRepository.save(user);
            }

            return new ResponseEntity<>("User reputation updated", HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<?> updateWinkableStatus(Long userId, boolean status) {

        try {

            Optional<User> optionalUser = userRepository.findById(userId);

            if (optionalUser.isPresent()) {

                User user = optionalUser.get();
                user.setWinkable(status);

                userRepository.save(user);

                return new ResponseEntity<>(null, HttpStatus.OK);
            } else {

                return new ResponseEntity<>("No User present with ID: " + userId, HttpStatus.NOT_FOUND);

            }

        } catch (Exception e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getWinkableStatus(Long userId) {

        try {

            Optional<User> optionalUser = userRepository.findById(userId);

            if (optionalUser.isPresent()) {

                User user = optionalUser.get();
                boolean status = user.isWinkable();

                return new ResponseEntity<>(status, HttpStatus.OK);
            } else {

                return new ResponseEntity<>("No User present with ID: " + userId, HttpStatus.NOT_FOUND);

            }

        } catch (Exception e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getLinkUpVerificationStatus(Long userId) {
        try {

            Optional<User> userOptional = userRepository.findById(userId);

            if (userOptional.isEmpty()) {
                return new ResponseEntity<>("No user found with ID: " + userId, HttpStatus.NOT_FOUND);
            }

            User user = userOptional.get();
            return new ResponseEntity<>(user.isLinkUpVerified(), HttpStatus.OK);

        } catch (Exception e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<String> updateUserLinkUp(String email, String verificationType) {

        try {
            Optional<User> optionalUser = userRepository.findByEmail(email);

            if (optionalUser.isEmpty()) {
                return new ResponseEntity<>("No user present with email: " + email, HttpStatus.NOT_FOUND);
            }

            User user = optionalUser.get();

            if (verificationType.equals(PHOTO_VERIFICATION_TYPE)) {
                user.setVerified(true);
            }

            user.setLinkUpVerified(true);
            userRepository.save(user);

            emailService.sendVerificationSuccessfulEmail(email, user.getFirstName(), verificationType);

            return new ResponseEntity<>("User Verified", HttpStatus.OK);

        } catch (Exception e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    // userId refers to the person who's request is being accepted
    // authorId refers to the person who created the post
    // collaboratorId refers to the person who collabs on a linkup
    public void updateUsersFirePoints(Long userId, Long authorId, Long collaboratorId) {

        Optional<User> optionalRequestorUser = userRepository.findById(userId);
        Optional<User> optionalAuthorUser = userRepository.findById(authorId);

        if (optionalRequestorUser.isPresent()) {
            User user = optionalRequestorUser.get();
            user.setFire(user.getFire() + 30);

            userRepository.save(user);
        }

        if (optionalAuthorUser.isPresent()) {
            User author = optionalAuthorUser.get();
            author.setFire(author.getFire() + 30);

            if (author.getFire() >= 300 && !author.isPremiumUser()) {
                author.setPremiumUser(true);
            }

            userRepository.save(author);
        }

        if (collaboratorId != null) {

            Optional<User> optionalCollaborator = userRepository.findById(collaboratorId);

            if (optionalCollaborator.isPresent()) {
                User collaborator = optionalCollaborator.get();
                collaborator.setFire(collaborator.getFire() + 15);

                userRepository.save(collaborator);
            }

        }
    }

    public String getUserCampusByUserId(Long userId) {

        Optional<User> optionalUser = userRepository.findById(userId);
        String userCampus = null;

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            userCampus = user.getLocation();
        }

        return userCampus;
    }

    public ResponseEntity<?> updateUserBio(UpdateBioDTO updateBioDTO) {

        try {

            Optional<User> optionalUser = userRepository.findById(updateBioDTO.getUserId());

            if (optionalUser.isEmpty()) {
                return new ResponseEntity<>("No user found with ID: " + updateBioDTO.getUserId(), HttpStatus.NOT_FOUND);
            }

            User user = optionalUser.get();
            user.setBio(updateBioDTO.getBio());
            userRepository.save(user);

            return new ResponseEntity<>("User updated", HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public String connectUser(Long userId) {
        try {
            Optional<User> optionalUser = userRepository.findById(userId);

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                user.setOnlineStatus(OnlineStatus.ONLINE);
                userRepository.save(user);

                return user.getOnlineStatus().toString();

            } else {
                throw new RuntimeException("User not found with ID: " + userId);
            }
        } catch (Exception e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage(), e);
        }
    }

    public String disconnectUser(Long userId) {
        try {
            Optional<User> optionalUser = userRepository.findById(userId);

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                user.setOnlineStatus(OnlineStatus.OFFLINE);
                userRepository.save(user);

                return user.getOnlineStatus().toString();
            } else {
                throw new RuntimeException("User not found with ID: " + userId);
            }
        } catch (Exception e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage(), e);
        }
    }

    public ChatTabDTO getUserChatDetails(Long userId) {

        try {

            ChatTabDTO chatTabDTO = new ChatTabDTO();
            if (userId != null) {
                Optional<User> optionalUser = userRepository.findById(userId);

                if (optionalUser.isPresent()) {

                    User user = optionalUser.get();

                    chatTabDTO = ChatTabDTO.builder()
                            .userId(user.getUserId())
                            .avatar(user.getAvatar())
                            .firstName(user.getFirstName())
                            .role(user.getRole().toString())
                            .isPremiumUser(user.isPremiumUser())
                            .username(user.getUsername())
                            .lastName(user.getLastName())
                            .build();

                } else {
                    chatTabDTO = ChatTabDTO.builder()
                            .userId(userId)
                            .avatar(MISSING_USER_AVATAR_URL)
                            .firstName("Deleted")
                            .lastName("User")
                            .isPremiumUser(false)
                            .role("USER")
                            .build();
                }

            } else {
                chatTabDTO = ChatTabDTO.builder()
                        .userId(0L)
                        .avatar(MISSING_USER_AVATAR_URL)
                        .firstName("Deleted")
                        .lastName("User")
                        .isPremiumUser(false)
                        .role("USER")
                        .build();
            }

            return chatTabDTO;

        } catch (Exception e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public UserAccountVerificationDataDTO getUserAccountVerificationData(String email) {

        try {

            Optional<User> optionalUser = userRepository.findByEmail(email);

            UserAccountVerificationDataDTO userData = null;

            if (optionalUser.isPresent()) {

                User user = optionalUser.get();
                University university = universityRepository.getUniById(user.getUniversityId());

                userData = UserAccountVerificationDataDTO.builder()
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .uniName(university.getUniName())
                        .campus(user.getLocation())
                        .yearOfGraduation(user.getYearOfGraduation())
                        .build();

            } else {
                userData = UserAccountVerificationDataDTO.builder()
                        .firstName("Deleted")
                        .lastName("User")
                        .uniName("n/a")
                        .campus("n/a")
                        .yearOfGraduation(0)
                        .build();
            }

            return userData;

        } catch (Exception e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public void sendRejectionEmail(VerificationRejectionReasons rejectionReasons) {

        try {

            String email = rejectionReasons.getEmail();
            Optional<User> optionalUser = userRepository.findByEmail(email);

            if (optionalUser.isPresent()) {

                User user = optionalUser.get();
                emailService.sendVerificationRejectionEmail(email, user.getFirstName(),
                        rejectionReasons.getReasonsString());
            }

        } catch (UserNotFoundException e) {
            throw new UserNotFoundException("Something went wrong: " + e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    @Transactional
    public void deleteAccount(Long userId) {

        try {

            Optional<User> optionalUser = userRepository.findById(userId);

            if (optionalUser.isPresent()) {
                // delete all tokens of a user
                tokenRepository.deleteAllTokensByUserId(userId);
                // delete all accepted and pending friend requests
                friendshipRepository.deleteAllFriendshipsByUserId(userId);

                User user = optionalUser.get();
                userRepository.delete(user);
            }

        } catch (UserNotFoundException e) {
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getAllUsersOfAUniversity(Integer universityId, Integer offset, Integer pageSize) {

        try{

            Pageable pageable = PageRequest.of(offset, pageSize);
            Page<User> userPage = userRepository.findByUniversityId(universityId, pageable);
            List<GetUserPostDataDTO> convertedUsers = convertUsersToDTO(userPage);

            return new ResponseEntity<>(convertedUsers, HttpStatus.OK);

        }catch (UserNotFoundException e){
            throw new UserNotFoundException("Something went wrong: " + e.getMessage());
        }

    }

    private List<GetUserPostDataDTO> convertUsersToDTO(Page<User> userPage){

        List<GetUserPostDataDTO> convertedUsers = new ArrayList<>();
        List<User> extractedUsers = userPage.getContent();

        extractedUsers.forEach((user) -> {

            GetUserPostDataDTO userDTO = GetUserPostDataDTO.builder()
                    .userId(user.getUserId())
                    .universityId(user.getUniversityId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .username(user.getUsername())
                    .avatar(user.getAvatar())
                    .role(user.getRole())
                    .isPremiumUser(user.isPremiumUser())
                    .build();

            convertedUsers.add(userDTO);
        });

        return convertedUsers;
    }
}
