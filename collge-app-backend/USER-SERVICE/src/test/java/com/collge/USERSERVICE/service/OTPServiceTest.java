package com.collge.USERSERVICE.service;

import com.collge.USERSERVICE.DTO.PasswordDTO;
import com.collge.USERSERVICE.DTO.SearchDTO;
import com.collge.USERSERVICE.exception.UserNotFoundException;
import com.collge.USERSERVICE.model.OTP;
import com.collge.USERSERVICE.model.User;
import com.collge.USERSERVICE.repository.OTPRepository;
import com.collge.USERSERVICE.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OTPServiceTest {

    @Mock
    private OTPRepository mockOtpRepository;
    @Mock
    private BCryptPasswordEncoder mockPasswordEncoder;
    @Mock
    private UserRepository mockUserRepository;
    @Mock
    private EmailService mockEmailService;

    @InjectMocks
    private OTPService otpServiceUnderTest;

    @Test
    void testGenerateAndStoreOTP() throws Exception {
        // Setup
        LocalDateTime fixedTime = LocalDateTime.now();

        User user = User.builder()
                .userId(0L)
                .username("username")
                .password("password")
                .email("email")
                .otp(new OTP(0L, "otpValue", fixedTime.plusMinutes(30), null))
                .build();

        SearchDTO searchDTO = SearchDTO.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .userId(user.getUserId())
                .build();

        ResponseEntity<SearchDTO> expectedResult = new ResponseEntity<>(searchDTO, HttpStatusCode.valueOf(200));

        when(mockUserRepository.findByEmail("email")).thenReturn(Optional.of(user));

        OTP otp = new OTP(0L, "otpValue", fixedTime.plusMinutes(30), user);
        when(mockOtpRepository.findByUser(any(User.class))).thenReturn(Optional.of(otp));

        // Run the test
        ResponseEntity<?> result = otpServiceUnderTest.generateAndStoreOTP("email");

        // Verify the results
        assertThat(result.getStatusCode()).isEqualTo(expectedResult.getStatusCode());
        assertThat(result.getBody()).isEqualToComparingFieldByField(expectedResult.getBody());
        verify(mockUserRepository, times(1)).findByEmail("email");
        verify(mockOtpRepository, times(1)).save(any(OTP.class));
    }

    @Test
    void testGenerateAndStoreOTP_UserRepositoryFindByEmailReturnsAbsent() throws Exception {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("User not found with this email", HttpStatusCode.valueOf(400));
        when(mockUserRepository.findByEmail("email")).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = otpServiceUnderTest.generateAndStoreOTP("email");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGenerateAndStoreOTP_EmailServiceThrowsIOException() throws Exception {
        // Setup
        // Configure UserRepository.findByEmail(...).
        final Optional<User> user = Optional.of(User.builder()
                .userId(0L)
                .username("username")
                .password("password")
                .email("email")
                .otp(new OTP(0L, "otpValue", LocalDateTime.of(2020, 1, 1, 0, 0, 0), null))
                .build());
        when(mockUserRepository.findByEmail("email")).thenReturn(user);

        // Configure OTPRepository.findByUser(...).
        final Optional<OTP> otp = Optional.of(
                new OTP(0L, "otpValue", LocalDateTime.of(2020, 1, 1, 0, 0, 0), User.builder()
                        .userId(0L)
                        .username("username")
                        .password("password")
                        .email("email")
                        .build()));
        when(mockOtpRepository.findByUser(User.builder()
                .userId(0L)
                .username("username")
                .password("password")
                .email("email")
                .otp(new OTP(0L, "otpValue", LocalDateTime.of(2020, 1, 1, 0, 0, 0), null))
                .build())).thenReturn(otp);

        when(mockEmailService.sendOTP("email", "otpValue")).thenThrow(IOException.class);

        // Run the test
        assertThatThrownBy(() -> otpServiceUnderTest.generateAndStoreOTP("email"))
                .isInstanceOf(UserNotFoundException.class);

    }


    @Test
    void testVerifyOTP() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("OTP Verified Successfully", HttpStatusCode.valueOf(200));

        // Configure UserRepository.findById(...).
        final Optional<User> user = Optional.of(User.builder()
                .userId(0L)
                .username("username")
                .password("password")
                .email("email")
                .otp(new OTP(0L, "otpValue", LocalDateTime.now().plusMinutes(60), null))
                .build());
        when(mockUserRepository.findById(0L)).thenReturn(user);

        // Configure OTPRepository.findByUser(...).
        final Optional<OTP> otp = Optional.of(
                new OTP(0L, "otpValue", LocalDateTime.now().plusMinutes(60), User.builder()
                        .userId(0L)
                        .username("username")
                        .password("password")
                        .email("email")
                        .build()));
        when(mockOtpRepository.findByUser(User.builder()
                .userId(0L)
                .username("username")
                .password("password")
                .email("email")
                .otp(new OTP(0L, "otpValue", LocalDateTime.now().plusMinutes(60), any(User.class)))
                .build())).thenReturn(otp);

        // Run the test
        final ResponseEntity<?> result = otpServiceUnderTest.verifyOTP(0L, "otpValue");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
//        verify(mockUserRepository).save(any(User.class));
    }

    @Test
    void testVerifyOTPExpiryCase() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("OTP has expired, please request a new one", HttpStatusCode.valueOf(410));

        // Configure UserRepository.findById(...).
        final Optional<User> user = Optional.of(User.builder()
                .userId(0L)
                .username("username")
                .password("password")
                .email("email")
                .otp(new OTP(0L, "otpValue", LocalDateTime.now().minusMinutes(60), null))
                .build());
        when(mockUserRepository.findById(0L)).thenReturn(user);

        // Configure OTPRepository.findByUser(...).
        final Optional<OTP> otp = Optional.of(
                new OTP(0L, "otpValue", LocalDateTime.now().minusMinutes(60), User.builder()
                        .userId(0L)
                        .username("username")
                        .password("password")
                        .email("email")
                        .build()));
        when(mockOtpRepository.findByUser(User.builder()
                .userId(0L)
                .username("username")
                .password("password")
                .email("email")
                .otp(new OTP(0L, "otpValue", LocalDateTime.now().minusMinutes(60), any(User.class)))
                .build())).thenReturn(otp);

        // Run the test
        final ResponseEntity<?> result = otpServiceUnderTest.verifyOTP(0L, "otpValue");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
//        verify(mockUserRepository).save(any(User.class));
    }

    @Test
    void testVerifyOTP_UserRepositoryFindByIdReturnsAbsent() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("OTP incorrect ,Please check the entered OTP", HttpStatusCode.valueOf(400));
        when(mockUserRepository.findById(0L)).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<?> result = otpServiceUnderTest.verifyOTP(0L, "enteredOTP");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testVerifyOTP_OTPRepositoryReturnsAbsent() {
        // Setup
        // Configure UserRepository.findById(...).
        final Optional<User> user = Optional.of(User.builder()
                .userId(0L)
                .username("username")
                .password("password")
                .email("email")
                .otp(new OTP(0L, "otpValue", LocalDateTime.of(2020, 1, 1, 0, 0, 0), null))
                .build());
        when(mockUserRepository.findById(0L)).thenReturn(user);

        when(mockOtpRepository.findByUser(User.builder()
                .userId(0L)
                .username("username")
                .password("password")
                .email("email")
                .otp(new OTP(0L, "otpValue", LocalDateTime.of(2020, 1, 1, 0, 0, 0), null))
                .build())).thenReturn(Optional.empty());

        // Run the test
        assertThatThrownBy(() -> otpServiceUnderTest.verifyOTP(0L, "enteredOTP"))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void testChangePassword() {
        // Setup
        final PasswordDTO passwordDTO = PasswordDTO.builder()
                .userId(0L)
                .newPassword("newPassword")
                .build();
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("Password Changed Successfully", HttpStatusCode.valueOf(200));

        // Configure UserRepository.findById(...).
        final Optional<User> user = Optional.of(User.builder()
                .userId(0L)
                .username("username")
                .password("password")
                .email("email")
                .otp(new OTP(0L, "otpValue", LocalDateTime.of(2020, 1, 1, 0, 0, 0), null))
                .build());
        when(mockUserRepository.findById(0L)).thenReturn(user);

        when(mockPasswordEncoder.matches("newPassword", "password")).thenReturn(false);
        when(mockPasswordEncoder.encode("newPassword")).thenReturn("password");

        // Run the test
        final ResponseEntity<?> result = otpServiceUnderTest.changePassword(passwordDTO);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);

    }

    @Test
    void testChangePassword_UserRepositoryFindByIdReturnsAbsent() {
        // Setup
        final PasswordDTO passwordDTO = PasswordDTO.builder()
                .userId(0L)
                .newPassword("newPassword")
                .build();
        when(mockUserRepository.findById(0L)).thenReturn(Optional.empty());

        // Run the test
        assertThatThrownBy(() -> otpServiceUnderTest.changePassword(passwordDTO))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void testChangePassword_BCryptPasswordEncoderMatchesReturnsTrue() {
        // Setup
        final PasswordDTO passwordDTO = PasswordDTO.builder()
                .userId(0L)
                .newPassword("newPassword")
                .build();
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("New password should not match the old password", HttpStatusCode.valueOf(400));

        // Configure UserRepository.findById(...).
        final Optional<User> user = Optional.of(User.builder()
                .userId(0L)
                .username("username")
                .password("password")
                .email("email")
                .otp(new OTP(0L, "otpValue", LocalDateTime.of(2020, 1, 1, 0, 0, 0), null))
                .build());
        when(mockUserRepository.findById(0L)).thenReturn(user);

        when(mockPasswordEncoder.matches("newPassword", "password")).thenReturn(true);

        // Run the test
        final ResponseEntity<?> result = otpServiceUnderTest.changePassword(passwordDTO);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }
}
