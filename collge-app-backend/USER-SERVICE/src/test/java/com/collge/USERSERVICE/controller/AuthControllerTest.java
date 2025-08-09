package com.collge.USERSERVICE.controller;

import com.collge.USERSERVICE.DTO.LoginDTO;
import com.collge.USERSERVICE.DTO.RegisterDTO;
import com.collge.USERSERVICE.model.Role;
import com.collge.USERSERVICE.model.University;
import com.collge.USERSERVICE.model.User;
import com.collge.USERSERVICE.repository.UniversityRepository;
import com.collge.USERSERVICE.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.shaded.com.fasterxml.jackson.core.JsonProcessingException;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private UniversityRepository universityRepository;

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
                .password(passwordEncoder.encode("test_password"))
                .role(Role.USER)
                .build();
        userRepository.save(test_user);

//        University university = University.builder()
//                .universityId(1)
//                .uniName("Anglia Ruskin University")
//                .uniEmails(List.of("student.aru.ac.uk", "pgr.aru.ac.uk"))
//                .uniLocations(List.of("Cambridge"))
//                .build();
//
//        Mockito.when(universityRepository.getUniByName("Anglia Ruskin University"))
//                .thenReturn(university);
    }


    @Disabled
    void loginUser() throws Exception {

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUsername("test_username");
        loginDTO.setPassword("test_password");


        //call controller endpoints
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(asJsonString(loginDTO))
                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.userId").value("1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.jwtToken").isNotEmpty());

    }

    @Disabled
    void registerUser() throws Exception {

        RegisterDTO registerDTO = RegisterDTO.builder()
                .firstName("first_name")
                .lastName("last_name")
                .username("test_username1")
                .password(passwordEncoder.encode("test_password"))
                .email("test_email1@student.aru.ac.uk")
                .universityName("Anglia Ruskin University")
                .yearOfGraduation(2026)
                .location("Cambridge")
                .build();

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(asJsonString(registerDTO))
                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$").value("Are you sure this is your student email? We don't seem to recognise it"));

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