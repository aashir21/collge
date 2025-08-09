package com.collge.USERSERVICE.service;

import com.collge.USERSERVICE.DTO.SearchDTO;
import com.collge.USERSERVICE.DTO.UserDTO;
import com.collge.USERSERVICE.DTO.UserDataDTO;
import com.collge.USERSERVICE.exception.UserNotFoundException;
import com.collge.USERSERVICE.model.Role;
import com.collge.USERSERVICE.model.University;
import com.collge.USERSERVICE.model.User;
import com.collge.USERSERVICE.repository.ConfirmationToken;
import com.collge.USERSERVICE.repository.PostRepository;
import com.collge.USERSERVICE.repository.UniversityRepository;
import com.collge.USERSERVICE.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository mockUserRepository;
    @Mock
    private ConfirmationToken mockCTokenRepository;
    @Mock
    private EmailService mockEmailService;
    @Mock
    private ConfirmationToken mockCTokenRepository1;
    @Mock
    private EmailService mockEmailService1;
    @Mock
    private UniversityRepository mockUniversityRepository;

    @Mock
    private PostRepository postRepository;

    private UserService userServiceUnderTest;

    @BeforeEach
    void setUp() {
        userServiceUnderTest = new UserService(mockUserRepository, mockCTokenRepository, mockEmailService);
        ReflectionTestUtils.setField(userServiceUnderTest, "cTokenRepository", mockCTokenRepository1);
        ReflectionTestUtils.setField(userServiceUnderTest, "emailService", mockEmailService1);
        ReflectionTestUtils.setField(userServiceUnderTest, "universityRepository", mockUniversityRepository);
    }

    @Test
    void testGetAllUsers() {
        // Setup
        final List<User> expectedResult = List.of(User.builder()
                .userId(0L)
                .firstName("firstName")
                .username("username")
                .email("email")
                .avatar("avatar")
                .bio("bio")
                .title("title")
                .reputation(0)
                .fire(0)
                .universityId(0)
                .isVerified(false)
                .isPremiumUser(false)
                .confirmationToken(new com.collge.USERSERVICE.model.ConfirmationToken())
                .role(Role.USER)
                .build());

        // Configure UserRepository.findAll(...).
        final List<User> users = List.of(User.builder()
                .userId(0L)
                .firstName("firstName")
                .username("username")
                .email("email")
                .avatar("avatar")
                .bio("bio")
                .title("title")
                .reputation(0)
                .fire(0)
                .universityId(0)
                .isVerified(false)
                .isPremiumUser(false)
                .confirmationToken(new com.collge.USERSERVICE.model.ConfirmationToken())
                .role(Role.USER)
                .build());
        when(mockUserRepository.findAll()).thenReturn(users);

        // Run the test
        final List<User> result = userServiceUnderTest.getAllUsers();

        // Verify the results
        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
    }

    @Test
    void testGetAllUsers_UserRepositoryReturnsNoItems() {
        // Setup
        when(mockUserRepository.findAll()).thenReturn(Collections.emptyList());

        // Run the test
        final List<User> result = userServiceUnderTest.getAllUsers();

        // Verify the results
        assertThat(result).isEqualTo(Collections.emptyList());
    }

    @Test
    void testGetUserById() {
        // Setup

        UserDTO userDTO = UserDTO.builder()
                .isPremiumUser(false)
                .isVerified(false)
                .registrationType("EMAIL")
                .isBanned(false)
                .universityId(0)
                .build();

        final ResponseEntity<?> expectedResult = new ResponseEntity<>(userDTO, HttpStatusCode.valueOf(302));

        // Configure UserRepository.findById(...).
        final Optional<User> user = Optional.of(User.builder()
                .userId(0L)
                .firstName("firstName")
                .username("username")
                .email("email")
                .avatar("avatar")
                .bio("bio")
                .title("title")
                .reputation(0)
                .fire(0)
                        .registrationType("email")
                .universityId(0)
                .isVerified(false)
                .isPremiumUser(false)
                .confirmationToken(new com.collge.USERSERVICE.model.ConfirmationToken())
                .role(Role.USER)
                .build());
        when(mockUserRepository.findById(0L)).thenReturn(user);

        // Run the test
        final ResponseEntity<?> result = userServiceUnderTest.getUserById(0L);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetUserById_UserRepositoryReturnsAbsent() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(404));
        when(mockUserRepository.findById(0L)).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = userServiceUnderTest.getUserById(0L);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testVerifyEmail_UserRepositoryFindByIdReturnsAbsent() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("User not found with id", HttpStatusCode.valueOf(404));
        when(mockUserRepository.findById(0L)).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = userServiceUnderTest.verifyEmail(0L, "code");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testResendVerifyEmail_UserRepositoryFindByIdReturnsAbsent() {
        // Setup
        when(mockUserRepository.findById(0L)).thenReturn(Optional.empty());

        // Run the test
        assertThatThrownBy(() -> userServiceUnderTest.resendVerifyEmail(0L)).isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void testGetUserByEmail() {

        SearchDTO searchDTO = SearchDTO.builder()
                .userId(0L)
                .email("email")
                .username("username")
                .universityId(0)
                .build();

        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(searchDTO, HttpStatusCode.valueOf(200));

        // Configure UserRepository.findByEmail(...).
        final Optional<User> user = Optional.of(User.builder()
                .userId(0L)
                .firstName("firstName")
                .username("username")
                .email("email")
                .avatar("avatar")
                .bio("bio")
                .title("title")
                .reputation(0)
                .fire(0)
                .universityId(0)
                .isVerified(false)
                .isPremiumUser(false)
                .confirmationToken(new com.collge.USERSERVICE.model.ConfirmationToken())
                .role(Role.USER)
                .build());
        when(mockUserRepository.findByEmail("email")).thenReturn(user);

        // Run the test
        final ResponseEntity<?> result = userServiceUnderTest.getUserByEmail("email");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetUserByEmail_UserRepositoryReturnsAbsent() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(false, HttpStatusCode.valueOf(400));
        when(mockUserRepository.findByEmail("email")).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = userServiceUnderTest.getUserByEmail("email");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testIsUserVerified() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(false, HttpStatusCode.valueOf(200));

        // Configure UserRepository.findById(...).
        final Optional<User> user = Optional.of(User.builder()
                .userId(0L)
                .firstName("firstName")
                .username("username")
                .email("email")
                .avatar("avatar")
                .bio("bio")
                .title("title")
                .reputation(0)
                .fire(0)
                .universityId(0)
                .isVerified(false)
                .isPremiumUser(false)
                .confirmationToken(new com.collge.USERSERVICE.model.ConfirmationToken())
                .role(Role.USER)
                .build());
        when(mockUserRepository.findById(0L)).thenReturn(user);

        // Run the test
        final ResponseEntity<?> result = userServiceUnderTest.isUserVerified(0L);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testIsUserVerified_UserRepositoryReturnsAbsent() {
        // Setup
        when(mockUserRepository.findById(0L)).thenReturn(Optional.empty());

        // Run the test
        assertThatThrownBy(() -> userServiceUnderTest.isUserVerified(0L)).isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void testFindUserByUsername() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("Username is already taken...", HttpStatusCode.valueOf(409));

        // Configure UserRepository.findByUsername(...).
        final Optional<User> user = Optional.of(User.builder()
                .userId(0L)
                .firstName("firstName")
                .username("username")
                .email("email")
                .avatar("avatar")
                .bio("bio")
                .title("title")
                .reputation(0)
                .fire(0)
                .universityId(0)
                .isVerified(false)
                .isPremiumUser(false)
                .confirmationToken(new com.collge.USERSERVICE.model.ConfirmationToken())
                .role(Role.USER)
                .build());
        when(mockUserRepository.findByUsername("username")).thenReturn(user);

        // Run the test
        final ResponseEntity<?> result = userServiceUnderTest.findUserByUsername("username");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testFindUserByUsername_UserRepositoryReturnsAbsent() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("No user found against this username", HttpStatusCode.valueOf(200));
        when(mockUserRepository.findByUsername("username")).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = userServiceUnderTest.findUserByUsername("username");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }


    @Disabled
    void testGetUserDetails() {

        UserDataDTO userDataDTO = UserDataDTO.builder()
                .firstName("firstName")
                .username("username")
                .avatar("avatar")
                .userId(0L)
                .universityId(0)
                .bio("bio")
                .universityName("uniName")
                .title("title")
                .reputation(0)
                .numberOfPosts(0)
                .fire(0)
                .isPremiumUser(false)
                .role(Role.USER)
                .build();

        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(userDataDTO, HttpStatusCode.valueOf(200));

        // Configure UserRepository.findById(...).
        final Optional<User> user = Optional.of(User.builder()
                .userId(0L)
                .firstName("firstName")
                .username("username")
                .email("email")
                .avatar("avatar")
                .bio("bio")
                .title("title")
                .registrationType("email")
                .reputation(0)
                .fire(0)
                .universityId(0)
                .isVerified(false)
                .isPremiumUser(false)
                .confirmationToken(new com.collge.USERSERVICE.model.ConfirmationToken())
                .role(Role.USER)
                .build());
        when(mockUserRepository.findById(0L)).thenReturn(user);
        when(postRepository.getNumberOfPostsByUserId(0L)).thenReturn(3);

        // Configure UniversityRepository.getUniById(...).
        final University university = new University(0, "uniName", List.of("value"), List.of("value"));
        when(mockUniversityRepository.getUniById(0)).thenReturn(university);

        // Run the test
        final ResponseEntity<?> result = userServiceUnderTest.getUserDetails(0L);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetUserDetails_UserRepositoryReturnsAbsent() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(404));
        when(mockUserRepository.findById(0L)).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = userServiceUnderTest.getUserDetails(0L);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }
}
