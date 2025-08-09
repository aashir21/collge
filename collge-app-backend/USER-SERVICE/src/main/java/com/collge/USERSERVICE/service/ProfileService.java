package com.collge.USERSERVICE.service;

import com.collge.USERSERVICE.DTO.PasswordDTO;
import com.collge.USERSERVICE.DTO.UpdateAvatarDTO;
import com.collge.USERSERVICE.DTO.UpdateBioDTO;
import com.collge.USERSERVICE.DTO.UpdateUsernameDTO;
import com.collge.USERSERVICE.exception.UserNotFoundException;
import com.collge.USERSERVICE.model.Token;
import com.collge.USERSERVICE.model.TokenType;
import com.collge.USERSERVICE.model.User;
import com.collge.USERSERVICE.repository.TokenRepository;
import com.collge.USERSERVICE.repository.UserRepository;
import com.collge.USERSERVICE.security.JWTHelper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JWTHelper helper;

    @Autowired
    private AuthService authService;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private OTPService otpService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private AWSService awsService;

    @Autowired
    private ObjectMapper  objectMapper;

    private static final String MEDIA_TYPE = "AVATAR";
    private static final String DEFAULT_AVATAR = "https://collge-stag-bucket.ams3.cdn.digitaloceanspaces.com/default-avatar.jpg";

    private static final Logger LOGGER = LoggerFactory.getLogger(ProfileService.class);
    private static final String DIGITAL_OCEAN_BUCKET_NAME = "collge-stag-bucket";

    public ResponseEntity<?> updateUsername(UpdateUsernameDTO updateUsernameDTO){

        try{

            Long userId = updateUsernameDTO.getUserId();
            Optional<User> optionalUser = userRepository.findById(userId);
            Optional<User> optionalUserByUsername = userRepository.findByUsername(updateUsernameDTO.getNewUsername());

            if(optionalUser.isEmpty()){
                return new ResponseEntity<>("User not found with ID: " + userId, HttpStatus.NOT_FOUND);
            }

            if(optionalUserByUsername.isPresent()){
                return new ResponseEntity<>("Username is already taken", HttpStatus.CONFLICT);
            }

            User user = optionalUser.get();

            user.setUsername(updateUsernameDTO.getNewUsername());
            userRepository.save(user);

            String newJwtToken = revokeAndIssueNewToken(updateUsernameDTO.getNewUsername());
            updateUsernameDTO.setNewJwtToken(newJwtToken);

            return new ResponseEntity<>(updateUsernameDTO, HttpStatus.OK);

        }catch (UserNotFoundException e){
            throw new UserNotFoundException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> updateBio(UpdateBioDTO updateBioDTO) {

        try{
            Long userId = updateBioDTO.getUserId();
            Optional<User> optionalUser = userRepository.findById(userId);

            if(optionalUser.isEmpty()){
                return new ResponseEntity<>("User not found with ID: " + userId, HttpStatus.NOT_FOUND);
            }

            User user = optionalUser.get();

            user.setBio(updateBioDTO.getBio());
            userRepository.save(user);

            return new ResponseEntity<>("Updated bio successfully", HttpStatus.OK);

        }catch (UserNotFoundException e){
            throw new UserNotFoundException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getBio(Long userId) {

        try{

            Optional<User> optionalUser = userRepository.findById(userId);

            if(optionalUser.isEmpty()){
                return new ResponseEntity<>("User not found with ID: " + userId, HttpStatus.NOT_FOUND);
            }

            User user = optionalUser.get();

            return new ResponseEntity<>(user.getBio(), HttpStatus.OK);

        }catch (UserNotFoundException e){
            throw new UserNotFoundException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> verifyPassword(PasswordDTO passwordDTO){
        try {
            Optional<User> optionalUser = this.userRepository.findById(passwordDTO.getUserId());
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                if (this.passwordEncoder.matches(passwordDTO.getNewPassword(), user.getPassword())) {
                    return new ResponseEntity<>("Password verified", HttpStatus.OK);
                } else {
                    user.setPassword(this.passwordEncoder.encode(passwordDTO.getNewPassword()));
                    this.userRepository.save(user);
                    return new ResponseEntity<>("Passwords do not match", HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>("User not found with ID: " + passwordDTO.getUserId(), HttpStatus.NOT_FOUND);
            }
        } catch (Exception var4) {
            throw new UserNotFoundException("Something went wrong..... " + var4.getMessage());
        }
    }

    public ResponseEntity<?> updatePassword(PasswordDTO passwordDTO) {

        try{

            return otpService.changePassword(passwordDTO);

        }catch (UserNotFoundException e){
            throw new UserNotFoundException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> updateAvatar(String userData, MultipartFile[] files) throws JsonProcessingException {

        UpdateAvatarDTO convertedUserData = objectMapper.readValue(userData, UpdateAvatarDTO.class);

        Optional<User> optionalUser = userRepository.findById(convertedUserData.getUserId());

        if(optionalUser.isEmpty()){
            return new ResponseEntity<>("User not found with ID: " + convertedUserData.getUserId(), HttpStatus.NOT_FOUND);
        }

        User user = optionalUser.get();

        if(files == null){
            user.setAvatar(DEFAULT_AVATAR);
            userRepository.save(user);

            return new ResponseEntity<>("https://collge-stag-bucket.ams3.cdn.digitaloceanspaces.com/default-avatar.jpg", HttpStatus.OK);
        }

        try {

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
                            awsService.uploadFileToSpaces(DIGITAL_OCEAN_BUCKET_NAME,MEDIA_TYPE.toLowerCase(), fileName, file);
                            // Construct the file URL
                            String fileUrl = "https://collge-stag-bucket.ams3.cdn.digitaloceanspaces.com/" + MEDIA_TYPE.toLowerCase() + "/" + fileName;

                            // Collect or process the generated file URL as needed
                            filePaths.add(fileUrl);
                        }

                    } catch (IOException e) {
                        throw new RuntimeException("Error uploading file", e);
                    }
                }
            }


            String newAvatarUrl = updateUserAvatar(user, filePaths);
            return new ResponseEntity<>(newAvatarUrl, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    private String revokeAndIssueNewToken(String username){

        UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
        String token = this.helper.generateToken(userDetails);

        User savedUser = this.userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        authService.revokeAllUserTokens(savedUser);
        Token builtToken = Token.builder().user(savedUser).token(token).tokenType(TokenType.BEARER).expired(false).revoked(false).build();
        this.tokenRepository.save(builtToken);

        return token;

    }

    private String updateUserAvatar(User user, List<String> filePaths){

        String newAvatarUrl = null;
        String oldAvatarUrl = user.getAvatar();

        if(!filePaths.isEmpty()){
            user.setAvatar(filePaths.get(0));
            newAvatarUrl = filePaths.get(0);

            // Delete the previous avatar if not the default avatar
            if(!oldAvatarUrl.equals(DEFAULT_AVATAR)){
                awsService.deleteFileFromBucket(DIGITAL_OCEAN_BUCKET_NAME, MEDIA_TYPE.toLowerCase(), oldAvatarUrl);
            }
        }

        userRepository.save(user);

        return newAvatarUrl;
    }
}
