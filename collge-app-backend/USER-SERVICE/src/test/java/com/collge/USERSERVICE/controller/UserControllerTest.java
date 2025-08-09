package com.collge.USERSERVICE.controller;

import com.collge.USERSERVICE.model.User;
import com.collge.USERSERVICE.repository.ConfirmationToken;
import com.collge.USERSERVICE.repository.UniversityRepository;
import com.collge.USERSERVICE.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.condition.DisabledIfEnvironmentVariables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.junit.jupiter.DisabledIf;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private ConfirmationToken confirmationTokenRepository;

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

        com.collge.USERSERVICE.model.ConfirmationToken confirmationToken = com.collge.USERSERVICE.model.ConfirmationToken.builder()
                .id(1L)
                .codeValue("codeValue")
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
                .expiration(LocalDateTime.now().plusMinutes(30))
                .build();



        userRepository.save(test_user);
        confirmationTokenRepository.save(confirmationToken);
    }



    @Disabled
    void getUserById() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/v1/user/getUserById/1")
                        .contentType("application/json")

                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isFound())
                .andExpect(MockMvcResultMatchers.jsonPath("$").isNotEmpty())
                .andExpect(MockMvcResultMatchers.jsonPath("$.isVerified").value("true"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.isPremiumUser").value("false"));



    }

    @Disabled
    void verifyEmail() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/v1/user/verifyEmail?userId=1&code=codeValue")
                        .contentType("application/json")

                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("Email Verified! Enjoy!"));


    }


    @Disabled
    void getUserByEmail() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/v1/user/getUserByEmail?email=test_email@student.aru.ac.uk")
                        .contentType("application/json")

                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isFound())
                .andExpect(MockMvcResultMatchers.jsonPath("$").isNotEmpty())
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("test_email@student.aru.ac.uk"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("test_username"));

    }

    @Disabled
    void isUserVerified() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/v1/user/isUserVerified?userId=1")
                        .contentType("application/json")

                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$").value("true"));


    }

    @Disabled
    void findByUsername() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/v1/user/findByUsername?username=test_username")
                        .contentType("application/json")
                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isConflict())
                .andExpect(content().string("Username is already taken..."));

    }

//    @Test
//    @DisabledIf(expression = "#{systemProperties['eureka.client.serviceUrl.defaultZone'] == 'http://eureka-0.eureka.default.svc.cluster.local:8761/eureka'}", reason = "Disabled because Eureka server URL matches the specified one.")
//    void getUserDetails() throws Exception {
//
//        mockMvc.perform(MockMvcRequestBuilders
//                        .get("/api/v1/user/getUserDetails?userId=1")
//                        .contentType("application/json")
//
//                        .accept("application/json"))
//                .andDo(print())
//                .andExpect(status().isOk())
//                .andExpect(MockMvcResultMatchers.jsonPath("$").isNotEmpty())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("test_username"));
//
//    }
}