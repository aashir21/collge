package com.collge.USERSERVICE.service;

import com.collge.USERSERVICE.DTO.JwtResponse;
import com.collge.USERSERVICE.DTO.LoginDTO;
import com.collge.USERSERVICE.DTO.RegisterDTO;
import com.collge.USERSERVICE.DTO.UniDTO;
import com.collge.USERSERVICE.exception.UserNotFoundException;
import com.collge.USERSERVICE.model.*;
import com.collge.USERSERVICE.repository.ConfirmationToken;
import com.collge.USERSERVICE.repository.TokenRepository;
import com.collge.USERSERVICE.repository.UniversityRepository;
import com.collge.USERSERVICE.repository.UserRepository;
import com.collge.USERSERVICE.security.JWTHelper;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserDetailsService mockUserDetailsService;
    @Mock
    private AuthenticationManager mockManager;
    @Mock
    private UserService mockUserService;
    @Mock
    private UniversityRepository mockUniversityRepository;
    @Mock
    private JWTHelper mockHelper;
    @Mock
    private UserRepository mockUserRepository;
    @Mock
    private BCryptPasswordEncoder mockPasswordEncoder;
    @Mock
    private TokenRepository mockTokenRepository;
    @Mock
    private ConfirmationToken mockCTokenRepository;
    @Mock
    private EmailService mockEmailService;

    @Mock
    private OTPService mockOtpService;

    @InjectMocks
    private AuthService authServiceUnderTest;

    @Test
    void testLogin() {
        // Setup
        LoginDTO request = new LoginDTO("username", "password");
        UserDetails mockUserDetails = org.springframework.security.core.userdetails.User
                .withUsername("username")
                .password("password")
                .authorities("ROLE_USER")
                .build();
        String expectedToken = "jwtToken";
        User savedUser = new User(); // Populate this user as needed
        Token builtToken = new Token(); // Populate this token as needed

        when(mockUserDetailsService.loadUserByUsername(request.getUsername())).thenReturn(mockUserDetails);
        when(mockHelper.generateToken(mockUserDetails)).thenReturn(expectedToken);
        when(mockUserRepository.findByUsername(request.getUsername())).thenReturn(Optional.of(savedUser));
        // Assuming revokeAllTUserTokens does not return a value and its effect is not directly tested here

        // When
        ResponseEntity<JwtResponse> responseEntity = authServiceUnderTest.login(request);

        // Then
        assertNotNull(responseEntity.getBody());
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(expectedToken, responseEntity.getBody().getJwtToken());

        verify(mockManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(mockTokenRepository).save(any(Token.class));
    }


    @Test
    void testLogin_AuthenticationManagerThrowsAuthenticationException() {
        // Setup
        final LoginDTO request = LoginDTO.builder()
                .username("username")
                .password("password")
                .build();
        when(mockManager.authenticate(new TestingAuthenticationToken("user", "pass", "ROLE_USER")))
                .thenThrow(BadCredentialsException.class);

        // Run the test
        assertThatThrownBy(() -> authServiceUnderTest.login(request)).isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void testLogin_UserDetailsServiceThrowsUsernameNotFoundException() {
        // Setup
        final LoginDTO request = LoginDTO.builder()
                .username("username")
                .password("password")
                .build();
        when(mockUserDetailsService.loadUserByUsername("username")).thenThrow(UsernameNotFoundException.class);

        // Run the test
        assertThatThrownBy(() -> authServiceUnderTest.login(request)).isInstanceOf(UserNotFoundException.class);
        verify(mockManager).authenticate(any(Authentication.class));
    }

    @Test
    void testLogin_UserRepositoryReturnsAbsent() {
        // Setup
        final LoginDTO request = LoginDTO.builder()
                .username("username")
                .password("password")
                .build();

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "username",
                "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );

        when(mockUserDetailsService.loadUserByUsername("username")).thenReturn(userDetails);
        when(mockHelper.generateToken(any(UserDetails.class))).thenReturn("jwtToken");
        when(mockUserRepository.findByUsername("username")).thenReturn(Optional.empty());

        // Run the test
        assertThatThrownBy(() -> authServiceUnderTest.login(request)).isInstanceOf(UserNotFoundException.class);
        verify(mockManager).authenticate(any(Authentication.class));
    }

    @Test
    void testLogin_TokenRepositoryFindAllValidTokensByUserReturnsNoItems() {
        // Setup
        final LoginDTO request = LoginDTO.builder()
                .username("username")
                .password("password")
                .build();
        final ResponseEntity<JwtResponse> expectedResult = new ResponseEntity<>(JwtResponse.builder()
                .userId(0L)
                .universityId(0)
                .username("username")
                .email("email")
                .firstName("firstName")
                .jwtToken("jwtToken")
                .avatarUri("avatar")
                .isVerified(false)
                .isPremiumUser(false)
                .role(Role.USER)
                .build(), HttpStatusCode.valueOf(200));

//        UserDetails userDetails = mockUserDetailsService.loadUserByUsername("username");

        UserDetails mockUserDetails = mock(UserDetails.class);
        when(mockUserDetails.getUsername()).thenReturn("username");
// Ensure the mockUserDetailsService returns the mockUserDetails
        when(mockUserDetailsService.loadUserByUsername("username")).thenReturn(mockUserDetails);
        when(mockHelper.generateToken(mockUserDetails)).thenReturn("jwtToken");

        // Configure UserRepository.findByUsername(...).
        final Optional<User> user = Optional.of(User.builder()
                .userId(0L)
                .firstName("firstName")
                .lastName("lastName")
                .username("username")
                .password("password")
                .email("email")
                .avatar("avatar")
                .bio("bio")
                .title("title")
                .reputation(0)
                .fire(0)
                .universityId(0)
                .isVerified(false)
                .isPremiumUser(false)
                .posts(List.of(new Post()))
                .pokes(List.of(new Pokes()))
                .clubs(List.of(new Clubs()))
                .matches(List.of(new Matches()))
                .whoVisited(List.of(new WhoVisited()))
                .yearOfGraduation(2020)
                .location("location")
                .confirmationToken(new com.collge.USERSERVICE.model.ConfirmationToken())
                .role(Role.USER)
                .build());
        when(mockUserRepository.findByUsername("username")).thenReturn(user);

        when(mockTokenRepository.findAllValidTokensByUser(0L)).thenReturn(Collections.emptyList());

        // Run the test
        final ResponseEntity<JwtResponse> result = authServiceUnderTest.login(request);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
        verify(mockManager).authenticate(any(Authentication.class));
        verify(mockTokenRepository).save(any(Token.class));
    }

    @Test
    void whenUserNotFoundInRepository_thenThrowsException() {
        // Given
        LoginDTO request = new LoginDTO("username", "password");
        UserDetails userDetails = org.springframework.security.core.userdetails.User.withUsername(request.getUsername()).password(request.getPassword()).authorities("ROLE_USER").build();

        when(mockUserDetailsService.loadUserByUsername(request.getUsername())).thenReturn(userDetails);
        when(mockUserRepository.findByUsername(request.getUsername())).thenReturn(Optional.empty());

        // When & Then
        assertThrows(UserNotFoundException.class, () -> authServiceUnderTest.login(request));
    }

    @Test
    void whenInvalidCredentials_thenThrowsBadCredentialsException() {
        // Given
        LoginDTO request = new LoginDTO("username", "wrongpassword");

        when(mockManager.authenticate(any())).thenThrow(new BadCredentialsException("Invalid Username or Password !!"));

        // When & Then
        assertThrows(UserNotFoundException.class, () -> authServiceUnderTest.login(request));
    }

    @Test
    void whenUsernameNotFound_thenThrowsUserNotFoundException() {
        // Given
        LoginDTO request = new LoginDTO("unknownUser", "password");

        when(mockUserDetailsService.loadUserByUsername(request.getUsername())).thenThrow(new UsernameNotFoundException("User not found"));

        // When & Then
        assertThrows(UserNotFoundException.class, () -> authServiceUnderTest.login(request));
    }

    @Test
    void whenTokenGenerationFails_thenThrowsException() {
        // Setup similar to the successful login but with the token generation failing
        when(mockHelper.generateToken(any())).thenThrow(new RuntimeException("Token generation failed"));

        // When & Then
        assertThrows(UserNotFoundException.class, () -> authServiceUnderTest.login(new LoginDTO("username", "password")));
    }

    @Disabled
    void testRevokeAllUserTokens() {
        // Setup
        final User user = User.builder()
                .userId(0L)
                .firstName("firstName")
                .lastName("lastName")
                .username("username")
                .password("password")
                .email("email")
                .avatar("avatar")
                .bio("bio")
                .title("title")
                .reputation(0)
                .fire(0)
                .universityId(0)
                .isVerified(false)
                .isPremiumUser(false)
                .posts(List.of(new Post()))
                .pokes(List.of(new Pokes()))
                .clubs(List.of(new Clubs()))
                .matches(List.of(new Matches()))
                .whoVisited(List.of(new WhoVisited()))
                .yearOfGraduation(2020)
                .location("location")
                .confirmationToken(new com.collge.USERSERVICE.model.ConfirmationToken())
                .role(Role.USER)
                .build();

        // Configure TokenRepository.findAllValidTokensByUser(...).
        final List<Token> tokens = List.of(Token.builder()
                .token("jwtToken")
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .user(User.builder()
                        .userId(0L)
                        .firstName("firstName")
                        .lastName("lastName")
                        .username("username")
                        .password("password")
                        .email("email")
                        .avatar("avatar")
                        .bio("bio")
                        .title("title")
                        .reputation(0)
                        .fire(0)
                        .universityId(0)
                        .isVerified(false)
                        .isPremiumUser(false)
                        .posts(List.of(new Post()))
                        .pokes(List.of(new Pokes()))
                        .clubs(List.of(new Clubs()))
                        .matches(List.of(new Matches()))
                        .whoVisited(List.of(new WhoVisited()))
                        .yearOfGraduation(2020)
                        .location("location")
                        .confirmationToken(new com.collge.USERSERVICE.model.ConfirmationToken())
                        .role(Role.USER)
                        .build())
                .build());
        when(mockTokenRepository.findAllValidTokensByUser(0L)).thenReturn(tokens);

        // Run the test
        authServiceUnderTest.revokeAllUserTokens(user);

        // Verify the results
        verify(mockTokenRepository).saveAll(any());
    }

    @Test
    void testRevokeAllTUserTokens_TokenRepositoryFindAllValidTokensByUserReturnsNoItems() {
        // Setup
        final User user = User.builder()
                .userId(0L)
                .firstName("firstName")
                .lastName("lastName")
                .username("username")
                .password("password")
                .email("email")
                .avatar("avatar")
                .bio("bio")
                .title("title")
                .reputation(0)
                .fire(0)
                .universityId(0)
                .isVerified(false)
                .isPremiumUser(false)
                .posts(List.of(new Post()))
                .pokes(List.of(new Pokes()))
                .clubs(List.of(new Clubs()))
                .matches(List.of(new Matches()))
                .whoVisited(List.of(new WhoVisited()))
                .yearOfGraduation(2020)
                .location("location")
                .confirmationToken(new com.collge.USERSERVICE.model.ConfirmationToken())
                .role(Role.USER)
                .build();
        when(mockTokenRepository.findAllValidTokensByUser(0L)).thenReturn(Collections.emptyList());

        // Run the test
        authServiceUnderTest.revokeAllUserTokens(user);

        // Verify the results
    }

    @Test
    void testRegisterUsernameOrEmailAlreadyExistsCase() throws Exception {
        // Setup
        final RegisterDTO registerDTO = RegisterDTO.builder()
                .firstName("firstName")
                .lastName("lastName")
                .username("username")
                .password("password")
                .universityName("uniName")
                .email("email@aru.ac.uk")
                .yearOfGraduation(2020)
                .location("location")
                .build();
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("Looks like you are already registered with us, log in instead", HttpStatusCode.valueOf(409));

        // Configure UniversityRepository.getUniByName(...).
        final University university = new University(0, "uniName", List.of("aru.ac.uk"), List.of("aru.ac.uk"));
        when(mockUniversityRepository.getUniByName("uniName")).thenReturn(university);

        // Configure UserRepository.findUserByUsernameOrEmail(...).
        final Optional<User> user = Optional.of(User.builder()
                .userId(0L)
                .firstName("firstName")
                .lastName("lastName")
                .username("username")
                .password("password")
                .email("email@aru.ac.uk")
                .avatar("avatar")
                .bio("bio")
                .title("title")
                .reputation(0)
                .fire(0)
                .universityId(0)
                .isVerified(false)
                .isPremiumUser(false)
                .posts(List.of(new Post()))
                .pokes(List.of(new Pokes()))
                .clubs(List.of(new Clubs()))
                .matches(List.of(new Matches()))
                .whoVisited(List.of(new WhoVisited()))
                .yearOfGraduation(2020)
                .location("location")
                .confirmationToken(new com.collge.USERSERVICE.model.ConfirmationToken())
                .role(Role.USER)
                .build());
        when(mockUserRepository.findUserByUsernameOrEmail("username", "email@aru.ac.uk")).thenReturn(user);

        // Run the test
        final ResponseEntity<?> result = authServiceUnderTest.register(registerDTO);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testRegister_UserRepositoryFindUserByUsernameOrEmailReturnsAbsent() throws Exception {
        // Setup
        final RegisterDTO registerDTO = RegisterDTO.builder()
                .firstName("firstName")
                .lastName("lastName")
                .username("username")
                .password("password")
                .universityName("uniName")
                .email("email@aru.ac.uk")
                .yearOfGraduation(2020)
                .location("location")
                .build();
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("Are you sure this is your student email? We don't seem to recognise it", HttpStatusCode.valueOf(400));

        // Configure UniversityRepository.getUniByName(...).
        final University university = new University(0, "uniName", List.of("value"), List.of("value"));
        when(mockUniversityRepository.getUniByName("uniName")).thenReturn(university);

        when(mockUserRepository.findUserByUsernameOrEmail("username", "email@aru.ac.uk")).thenReturn(Optional.empty());
        when(mockUniversityRepository.IfUniEmailValidOfUni(UniDTO.builder()
                .uniName("uniName")
                .uniEmail("aru.ac.uk")
                .build())).thenReturn(false);

        // Run the test
        final ResponseEntity<?> result = authServiceUnderTest.register(registerDTO);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testRegister_UniversityRepositoryIfUniEmailValidOfUniReturnsTrue() throws Exception {
        // Setup
        final RegisterDTO registerDTO = RegisterDTO.builder()
                .firstName("firstName")
                .lastName("lastName")
                .username("username")
                .password("password")
                .universityName("uniName")
                .email("email@aru.ac.uk")
                .yearOfGraduation(2020)
                .location("location")
                .build();
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(new JwtResponse(null, 0, "username" ,"email@aru.ac.uk", "jwtToken", null, "firstName", "https://collge-stag-bucket.ams3.cdn.digitaloceanspaces.com/default-avatar.jpg", false, false, Role.USER), HttpStatusCode.valueOf(200));

        // Configure UniversityRepository.getUniByName(...).
        final University university = new University(0, "uniName", List.of("aru.ac.uk"), List.of("aru.ac.uk"));
        when(mockUniversityRepository.getUniByName("uniName")).thenReturn(university);

        when(mockUserRepository.findUserByUsernameOrEmail("username", "email@aru.ac.uk")).thenReturn(Optional.empty());
        when(mockUniversityRepository.IfUniEmailValidOfUni(UniDTO.builder()
                .uniName("uniName")
                .uniEmail("aru.ac.uk")
                .build())).thenReturn(true);
        when(mockPasswordEncoder.encode("password")).thenReturn("password");
        when(mockHelper.generateToken(any(User.class))).thenReturn("jwtToken");

        // Run the test
        final ResponseEntity<?> result = authServiceUnderTest.register(registerDTO);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
        verify(mockUserRepository).save(any(User.class));

        // Confirm ConfirmationToken.save(...).
        final com.collge.USERSERVICE.model.ConfirmationToken entity = new com.collge.USERSERVICE.model.ConfirmationToken();
        entity.setId(0L);
        entity.setCodeValue("codeValue");
        entity.setExpiration(LocalDateTime.of(2020, 1, 1, 0, 0, 0));
        entity.setUser(User.builder()
                .userId(0L)
                .firstName("firstName")
                .lastName("lastName")
                .username("username")
                .password("password")
                .email("email")
                .avatar("avatar")
                .bio("bio")
                .title("title")
                .reputation(0)
                .fire(0)
                .universityId(0)
                .isVerified(false)
                .isPremiumUser(false)
                .posts(List.of(new Post()))
                .pokes(List.of(new Pokes()))
                .clubs(List.of(new Clubs()))
                .matches(List.of(new Matches()))
                .whoVisited(List.of(new WhoVisited()))
                .yearOfGraduation(2020)
                .location("location")
                .confirmationToken(new com.collge.USERSERVICE.model.ConfirmationToken())
                .role(Role.USER)
                .build());
        verify(mockTokenRepository).save(any(Token.class));
    }


}
