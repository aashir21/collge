package com.collge.USERSERVICE.controller;

import com.collge.USERSERVICE.DTO.PasswordDTO;
import com.collge.USERSERVICE.DTO.RegisterDTO;
import com.collge.USERSERVICE.model.OTP;
import com.collge.USERSERVICE.model.User;
import com.collge.USERSERVICE.repository.ConfirmationToken;
import com.collge.USERSERVICE.repository.OTPRepository;
import com.collge.USERSERVICE.repository.UniversityRepository;
import com.collge.USERSERVICE.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.shaded.com.fasterxml.jackson.core.JsonProcessingException;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
class OTPControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private OTPRepository otpRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Container
    private static final MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0.36");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mySQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mySQLContainer::getUsername);
        registry.add("spring.datasource.password", mySQLContainer::getPassword);
    }

    @BeforeEach
    public void setUp() {


        User test_user = User.builder()
                .username("test_username")
                .firstName("first_name")
                .lastName("last_name")
                .userId(1L)
                .email("test_email@student.aru.ac.uk")
                .universityId(1)
                .isVerified(true)
                .isPremiumUser(false)
                .password("test_password")
                .build();

        OTP otp = OTP.builder()
                .otpValue("123456")
                .user(User.builder()
                        .username("test_username")
                        .firstName("first_name")
                        .lastName("last_name")
                        .userId(1L)
                        .email("test_email@student.aru.ac.uk")
                        .universityId(1)
                        .isVerified(true)
                        .isPremiumUser(false)
                        .password("test_password")
                        .build())
                .expiration(LocalDateTime.now().plusMinutes(15))
                .id(1L)
                .build();



        userRepository.save(test_user);
        otpRepository.save(otp);
    }


    @Disabled
    void sendOTP() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/v1/otp/sendOTP?email=test_email@student.aru.ac.uk")
                        .contentType("application/json")

                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$").isNotEmpty())
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("test_username"));

    }

    @Disabled
    void verifyOTP() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/v1/otp/verifyOTP?userId=1&otpCode=123456")
                        .contentType("application/json")

                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("OTP Verified Successfully"));

    }

    @Disabled
    void changePassword() throws Exception {

        PasswordDTO passwordDTO = PasswordDTO.builder()
                .newPassword("new_password")
                .userId(1L)
                .build();

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/v1/otp/changePassword")
                        .contentType("application/json")
                        .content(asJsonString(passwordDTO))
                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("Password Changed Successfully"));

    }

    private String asJsonString(Object object) {
        try {
            return new ObjectMapper().writeValueAsString(object);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }
}