package com.collge.USERSERVICE.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

import com.collge.USERSERVICE.DTO.*;
import com.collge.USERSERVICE.controller.AuthController;
import com.collge.USERSERVICE.exception.UserNotFoundException;
import com.collge.USERSERVICE.model.Role;
import com.collge.USERSERVICE.model.Token;
import com.collge.USERSERVICE.model.TokenType;
import com.collge.USERSERVICE.model.University;
import com.collge.USERSERVICE.model.User;
import com.collge.USERSERVICE.repository.*;
import com.collge.USERSERVICE.security.JWTHelper;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.lang.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private AuthenticationManager manager;
    @Autowired
    private UserService userService;
    @Autowired
    private UniversityRepository universityRepository;
    @Autowired
    private JWTHelper helper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    private ConfirmationToken cTokenRepository;
    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private OTPService otpService;

    private Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    public static final String DEFAULT_PROFILE_PICTURE_URL = "https://collge-stag-bucket.ams3.cdn.digitaloceanspaces.com/default-avatar.jpg";
    protected static final String EMAIL_REGISTRATION_METHOD = "EMAIL";
    protected static final String PHOTO_ID_REGISTRATION_METHOD = "PHOTO_ID";

    @Value("${service-urls.baseEndpoint}")
    private String userServiceUrl;

    public ResponseEntity<JwtResponse> login(LoginDTO request) {
        try {
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());

            try {
                this.manager.authenticate(authentication);
            } catch (BadCredentialsException var8) {
                throw new BadCredentialsException("Invalid Username or Password !!");
            }

            UserDetails userDetails = this.userDetailsService.loadUserByUsername(request.getUsername());
            String token = this.helper.generateToken(userDetails);
            String refreshToken = this.helper.generateRefreshToken(userDetails);

            User savedUser = this.userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
            this.revokeAllUserTokens(savedUser);
            Token builtToken = Token.builder().user(savedUser).token(token).tokenType(TokenType.BEARER).expired(false).revoked(false).build();
            this.tokenRepository.save(builtToken);
            JwtResponse response = JwtResponse.builder()
                    .userId(savedUser.getUserId())
                    .universityId(savedUser.getUniversityId())
                    .jwtToken(token)
                    .refreshToken(refreshToken)
                    .avatarUri(savedUser.getAvatar())
                    .email(savedUser.getEmail())
                    .firstName(savedUser.getFirstName())
                    .username(userDetails.getUsername())
                    .isPremiumUser(savedUser.isPremiumUser())
                    .isVerified(savedUser.isVerified())
                    .role(savedUser.getRole()).build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            throw new UserNotFoundException("Something went wrong: " + e.getMessage());
        }
    }

    public void revokeAllUserTokens(User user) {
        try {
            List<Token> validTokens = this.tokenRepository.findAllValidTokensByUser(user.getUserId());
            if (!validTokens.isEmpty()) {
                tokenRepository.deleteAll(validTokens);
            }
        } catch (Exception var3) {
            throw new UserNotFoundException("Something went wrong: " + var3.getMessage());
        }
    }

    public ResponseEntity<?> register(RegisterDTO registerDTO) throws IOException {
        try {
            University university = this.universityRepository.getUniByName(registerDTO.getUniversityName());
            String[] email = registerDTO.getEmail().split("@");
            Optional<User> checkUser = this.userRepository.findUserByUsernameOrEmail(registerDTO.getUsername(), registerDTO.getEmail());
            if (checkUser.isPresent()) {
                return new ResponseEntity<>("Looks like you are already registered with us, log in instead", HttpStatus.CONFLICT);
            } else {
                UniDTO uniDTO = UniDTO.builder()
                        .uniName(registerDTO.getUniversityName())
                        .uniEmail(email[1])
                        .build();

                boolean emailExists = this.universityRepository.IfUniEmailValidOfUni(uniDTO);

                if (emailExists) {
                    User user = User
                            .builder()
                            .firstName(registerDTO.getFirstName())
                            .lastName(registerDTO.getLastName())
                            .username(registerDTO.getUsername())
                            .password(this.passwordEncoder.encode(registerDTO.getPassword()))
                            .email(registerDTO.getEmail()).avatar(DEFAULT_PROFILE_PICTURE_URL)
                            .bio("Hi, I am " + registerDTO.getUsername()).reputation(0).fire(0).title("Student")
                            .universityId(university.getUniversityId()).isPremiumUser(false).
                            isVerified(false).posts(null).pokes(null).clubs(null).role(Role.USER).matches(null).whoVisited(null)
                            .isWinkable(true)
                            .isLinkUpVerified(false)
                            .registrationDate(LocalDateTime.now())
                            .registrationType(EMAIL_REGISTRATION_METHOD)
                            .yearOfGraduation(registerDTO.getYearOfGraduation())
                            .location(registerDTO.getLocation())
                            .build();

                    this.userRepository.save(user);
                    LOGGER.info("New user saved to db");

                    String token = this.helper.generateToken(user);
                    Token builtToken = Token.builder()
                            .user(user)
                            .token(token)
                            .tokenType(TokenType.BEARER)
                            .expired(false).
                            revoked(false)
                            .build();

                    String refreshToken = helper.generateRefreshToken(user);

                    this.tokenRepository.save(builtToken);
                    JwtResponse jwtResponse = JwtResponse.builder()
                            .userId(user.getUserId())
                            .universityId(user.getUniversityId())
                            .username(user.getUsername())
                            .firstName(user.getFirstName())
                            .email(user.getEmail())
                            .jwtToken(token)
                            .refreshToken(refreshToken)
                            .isVerified(user.isVerified())
                            .isPremiumUser(user.isPremiumUser())
                            .role(user.getRole())
                            .avatarUri(user.getAvatar())
                            .build();

                    LOGGER.info("Generating OTP and sending mail");
                    otpService.generateAndStoreOTP(user.getEmail());

                    LOGGER.info("User registered successfully");
                    return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
                } else {
                    String errorMessage = "Are you sure this is your student email? We don't seem to recognise it";
                    return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
                }
            }
        } catch (Exception var13) {
            throw new UserNotFoundException("Something went wrong:" + var13.getMessage());
        }
    }

    public ResponseEntity<?> registerByPhotoID(RegisterDTO registerDTO) throws IOException {
        try {
            University university = this.universityRepository.getUniByName(registerDTO.getUniversityName());
            Optional<User> checkUser = this.userRepository.findUserByUsernameOrEmail(registerDTO.getUsername(), registerDTO.getEmail());
            if (checkUser.isPresent()) {
                return new ResponseEntity<>("Looks like you are already registered with us, log in instead", HttpStatus.CONFLICT);
            } else {

                User user = User
                        .builder()
                        .firstName(registerDTO.getFirstName())
                        .lastName(registerDTO.getLastName())
                        .username(registerDTO.getUsername())
                        .password(this.passwordEncoder.encode(registerDTO.getPassword()))
                        .email(registerDTO.getEmail()).avatar(DEFAULT_PROFILE_PICTURE_URL)
                        .bio("Hi, I am " + registerDTO.getFirstName()).reputation(0).fire(0).title("Student")
                        .universityId(university.getUniversityId()).isPremiumUser(false).
                        isVerified(false).posts(null).pokes(null).clubs(null).role(Role.USER).matches(null).whoVisited(null)
                        .isWinkable(true)
                        .isLinkUpVerified(true)
                        .registrationDate(LocalDateTime.now())
                        .registrationType(PHOTO_ID_REGISTRATION_METHOD)
                        .yearOfGraduation(registerDTO.getYearOfGraduation())
                        .location(registerDTO.getLocation())
                        .build();

                this.userRepository.save(user);
                LOGGER.info("New user saved to db");

                String token = this.helper.generateToken(user);
                Token builtToken = Token.builder()
                        .user(user)
                        .token(token)
                        .tokenType(TokenType.BEARER)
                        .expired(false).
                        revoked(false)
                        .build();

                String refreshToken = helper.generateRefreshToken(user);

                this.tokenRepository.save(builtToken);
                JwtResponse jwtResponse = JwtResponse.builder()
                        .userId(user.getUserId())
                        .universityId(user.getUniversityId())
                        .username(user.getUsername())
                        .firstName(user.getFirstName())
                        .email(user.getEmail())
                        .jwtToken(token)
                        .refreshToken(refreshToken)
                        .isVerified(user.isVerified())
                        .isPremiumUser(user.isPremiumUser())
                        .role(user.getRole())
                        .avatarUri(user.getAvatar())
                        .build();

                emailService.sendWelcomeMail(user.getEmail());

                LOGGER.info("User registered successfully");
                return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
            }
        } catch (Exception var13) {
            throw new UserNotFoundException("Something went wrong:" + var13.getMessage());
        }
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return;
        }

        refreshToken = authHeader.substring(7);

        try {
            userEmail = this.helper.getUsernameFromToken(refreshToken);
            if (userEmail != null) {
                var user = this.userRepository.findByUsername(userEmail)
                        .orElseThrow();
                if (helper.validateToken(refreshToken, user)) {
                    var accessToken = this.helper.generateToken(user);
                    revokeAllUserTokens(user);
                    saveUserToken(user, accessToken);
                    var authResponse = TokenDTO.builder()

                            .jwtToken(accessToken)
                            .refreshToken(refreshToken)
                            .build();

                    new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
                }

            }
        }catch (ExpiredJwtException e){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");

            // Create a map or a POJO to represent the error response structure
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("timestamp", new Date());
            errorDetails.put("status", HttpServletResponse.SC_UNAUTHORIZED);
            errorDetails.put("error", "Unauthorized");
            errorDetails.put("message", "JWT token is expired, please login again");
            errorDetails.put("path", request.getRequestURI());

            // Convert the map to a JSON string
            String jsonResponse = new ObjectMapper().writeValueAsString(errorDetails);

            // Write the custom JSON response
            response.getWriter().write(jsonResponse);
            response.getWriter().flush();
            response.getWriter().close();
        }
    }

    public ResponseEntity<?> logout(LogoutDTO logoutDTO) {

        try{

            List<Token> optionalToken = tokenRepository.findByToken(logoutDTO.getJwtToken());

            if(!optionalToken.isEmpty()){

                Token token = optionalToken.get(0);
                token.setRevoked(true);
                token.setExpired(true);

            }

            return new ResponseEntity<>("Logged out successfully", HttpStatus.OK);

        }catch (UserNotFoundException e){
            throw new UserNotFoundException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> updateLastLogin(Long userId) {

        try{

            Optional<User> optionalUser = userRepository.findById(userId);

            if(optionalUser.isPresent()){
                User user = optionalUser.get();

                user.setLastLogin(LocalDateTime.now());

                userRepository.save(user);

                return new ResponseEntity<>("Last login time updated", HttpStatus.OK);
            }

            return new ResponseEntity<>("User not found with ID: " + userId, HttpStatus.NOT_FOUND);

        }catch (UserNotFoundException e){
            throw new UserNotFoundException("Something went wrong: " + e.getMessage());
        }

    }
}
