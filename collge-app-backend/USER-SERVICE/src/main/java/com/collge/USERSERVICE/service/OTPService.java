package com.collge.USERSERVICE.service;

import com.collge.USERSERVICE.DTO.UserVerificationDTO;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import com.collge.USERSERVICE.DTO.PasswordDTO;
import com.collge.USERSERVICE.DTO.SearchDTO;
import com.collge.USERSERVICE.exception.UserNotFoundException;
import com.collge.USERSERVICE.model.OTP;
import com.collge.USERSERVICE.model.User;
import com.collge.USERSERVICE.repository.OTPRepository;
import com.collge.USERSERVICE.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class OTPService {

    @Autowired
    private OTPRepository otpRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;


    public ResponseEntity<?> generateAndStoreOTP(String email) throws IOException {
        try {
            String otpValue = this.generateRandomOTP(6);
            Optional<User> optionalUser = this.userRepository.findByEmail(email);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                if (user.getOtp() != null) {
                    Optional<OTP> optionalOTP = this.otpRepository.findByUser(user);
                    if (optionalOTP.isPresent()) {
                        user.setOtp(null);
                        this.userRepository.save(user);
                    }
                }

                OTP otp = new OTP();
                otp.setOtpValue(otpValue);
                otp.setExpiration(LocalDateTime.now().plusMinutes(15L));
                otp.setUser(user);
                user.setOtp(otp.getUser().getOtp());
                this.otpRepository.save(otp);

                this.userRepository.save(user);
                this.emailService.sendOTP(user.getEmail(), otpValue);
                SearchDTO searchDTO = SearchDTO.builder().email(user.getEmail()).username(user.getUsername()).userId(user.getUserId()).build();
                return new ResponseEntity<>(searchDTO, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("User not found with this email", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception var7) {
            throw new UserNotFoundException("User not found with email : " + var7.getMessage());
        }
    }

    public String generateRandomOTP(int length) {
        String DIGITS = "0123456789";
        if (length <= 0) {
            throw new IllegalArgumentException("OTP length must be greater than zero.");
        } else {
            SecureRandom random = new SecureRandom();
            StringBuilder otp = new StringBuilder(length);

            for(int i = 0; i < length; ++i) {
                int randomIndex = random.nextInt(DIGITS.length());
                otp.append(DIGITS.charAt(randomIndex));
            }

            return otp.toString();
        }
    }

    public ResponseEntity<?> verifyOTP(Long userId, String enteredOTP) {
        try {
            Optional<User> optionalUser = this.userRepository.findById(userId);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                OTP otp = this.otpRepository.findByUser(user).orElseThrow(() -> {
                    return new UserNotFoundException("User not found");
                });
                if (otp != null && otp.getOtpValue().equals(enteredOTP) && !otp.getExpiration().isBefore(LocalDateTime.now())) {
                    user.setOtp(null);
                    this.userRepository.save(user);
                    return new ResponseEntity<>("OTP Verified Successfully", HttpStatus.OK);
                }

                if (otp != null && otp.getOtpValue().equals(enteredOTP) && otp.getExpiration().isBefore(LocalDateTime.now())) {
                    return new ResponseEntity<>("OTP has expired, please request a new one", HttpStatus.GONE);
                }
            }

            return new ResponseEntity<>("OTP incorrect ,Please check the entered OTP", HttpStatus.BAD_REQUEST);
        } catch (Exception var6) {
            throw new UserNotFoundException("Entered OTP has either expired or is not associated to the user " + var6.getMessage());
        }
    }

    public ResponseEntity<?> changePassword(PasswordDTO passwordDTO) {
        try {
            Optional<User> optionalUser = this.userRepository.findById(passwordDTO.getUserId());
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                if (this.passwordEncoder.matches(passwordDTO.getNewPassword(), user.getPassword())) {
                    return new ResponseEntity<>("New password should not match the old password", HttpStatus.BAD_REQUEST);
                } else {
                    user.setPassword(this.passwordEncoder.encode(passwordDTO.getNewPassword()));
                    this.userRepository.save(user);
                    return new ResponseEntity<>("Password Changed Successfully", HttpStatus.OK);
                }
            } else {
                throw new UserNotFoundException("User not found with ID : " + passwordDTO.getUserId());
            }
        } catch (Exception var4) {
            throw new UserNotFoundException("Something went wrong..... " + var4.getMessage());
        }
    }

        public ResponseEntity<?> verifyUserVerificationOTP(Long userId,String otpValue) {

        try{

            Optional<User> optionalUser = userRepository.findById(userId);

            if(optionalUser.isPresent()){

                User user = optionalUser.get();
                Optional<OTP> optionalOTP = otpRepository.findByUser(user);

                if(optionalOTP.isPresent()){
                    OTP otp = optionalOTP.get();
                    if (otp != null && otp.getOtpValue().equals(otpValue) && !otp.getExpiration().isBefore(LocalDateTime.now())) {
                        user.setOtp(null);
                        user.setVerified(true);
                        this.userRepository.save(user);
                        return new ResponseEntity<>("OTP Verified Successfully", HttpStatus.OK);
                    }

                    if (otp != null && otp.getOtpValue().equals(otpValue) && otp.getExpiration().isBefore(LocalDateTime.now())) {
                        return new ResponseEntity<>("OTP has expired, please request a new one", HttpStatus.GONE);
                    }
                }
                else{
                    throw new UserNotFoundException("OTP not found for user : " + user.getUsername());
                }

                return new ResponseEntity<>("OTP incorrect ,Please check the entered OTP", HttpStatus.BAD_REQUEST);
            }
            else {
                throw new UserNotFoundException("User not found with ID : " + userId);
            }

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }
}
