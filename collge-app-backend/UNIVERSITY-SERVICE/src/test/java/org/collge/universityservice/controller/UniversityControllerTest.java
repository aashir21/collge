package org.collge.universityservice.controller;


import org.collge.universityservice.dto.AddValueDTO;
import org.collge.universityservice.dto.EmailDTO;
import org.collge.universityservice.model.University;
import org.collge.universityservice.repository.UniversityRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
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


import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
class UniversityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UniversityRepository universityRepository;

    @Container
    static MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0.36");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mySQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mySQLContainer::getUsername);
        registry.add("spring.datasource.password", mySQLContainer::getPassword);
    }

    @BeforeEach
    public void setUp() {
        University university = University.builder()
                .universityId(1)
                .uniName("Test University")
                .uniLocations(List.of("Location"))
                .uniEmails(List.of("Email","Email2"))
                .build();

        University university2 = University.builder()
                .universityId(2)
                .uniName("Test University2")
                .uniLocations(List.of("Location2"))
                .uniEmails(List.of("Email2", "Email3"))
                .build();

        universityRepository.save(university);
        universityRepository.save(university2);
    }

    @Disabled
    void addUni() throws Exception{

        University university = University.builder()
                .universityId(1)
                .uniName("Anglia Ruskin University")
                .uniLocations(List.of("Location1"))
                .uniEmails(List.of("Email1"))
                .build();
        //call controller endpoints
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/v1/university/addUni")
                        .contentType("application/json")
                        .content(asJsonString(university))
                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$").value("University added successfully"));


    }

    @Disabled
    void updateUniInfo() throws Exception {

        University university = University.builder()
                .universityId(1)
                .uniName("Anglia Ruskin University")
                .uniLocations(List.of("Location1"))
                .uniEmails(List.of("Email1"))
                .build();
        //call controller endpoints
        mockMvc.perform(MockMvcRequestBuilders
                        .put("/api/v1/university/updateUniInfo/1")
                        .contentType("application/json")
                        .content(asJsonString(university))
                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$").value("University Updated"));

    }

    @Disabled
    void getAllUnis() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/v1/university/getAllUnis")
                        .contentType("application/json")

                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$").isArray())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].uniName").value("Test University"));

    }

    @Disabled
    void getUniByName() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/v1/university/getUniByName/Test University")
                        .contentType("application/json")

                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.uniName").value("Test University"));

    }

    @Disabled
    void getUniById() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/v1/university/getUniById/1")
                        .contentType("application/json")

                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.uniName").value("Test University"));

    }

    @Disabled
    void getAllUniNames() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/v1/university/getAllUniNames")
                        .contentType("application/json")

                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0]").value("Test University"));


    }

    @Disabled
    void addUniEmail() throws Exception {

        AddValueDTO addValueDTO = AddValueDTO.builder()
                .universityId(1)
                .value("Email2")
                .build();

        //call controller endpoints
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/v1/university/addUniEmail")
                        .contentType("application/json")
                        .content(asJsonString(addValueDTO))
                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.uniEmails[1]").value("Email2"));


    }

    @Disabled
    void addUniLocation() throws  Exception{

        AddValueDTO addValueDTO = AddValueDTO.builder()
                .universityId(1)
                .value("Location2")
                .build();

        //call controller endpoints
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/v1/university/addUniLocation")
                        .contentType("application/json")
                        .content(asJsonString(addValueDTO))
                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.uniLocations[1]").value("Location2"));

    }


    @Disabled
    void checkUniEmailExistence() throws Exception {

        EmailDTO emailDTO = EmailDTO.builder()
                .uniName("Test University2")
                .uniEmail("Email2")
                .build();

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/v1/university/checkUniEmail")
                        .contentType("application/json")
                        .content(asJsonString(emailDTO))
                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andExpect(MockMvcResultMatchers.content().string("false"));

    }

    @Disabled
    void deleteUni() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/v1/university/deleteUni/2")
                        .contentType("application/json")
                        .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$").value("University Deleted"));

    }

    @Disabled
    void getUniLocationsByName() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/v1/university/getUniLocationsByName?uniName=Test University")
                        .contentType("application/json")
                        .accept("application/json"))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.jsonPath("$").isArray())
                .andExpect(MockMvcResultMatchers.jsonPath("$").isNotEmpty())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0]").value("Location"));

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