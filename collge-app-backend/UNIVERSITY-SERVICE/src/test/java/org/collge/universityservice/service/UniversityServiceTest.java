package org.collge.universityservice.service;

import org.collge.universityservice.dto.AddValueDTO;
import org.collge.universityservice.dto.EmailDTO;
import org.collge.universityservice.model.University;
import org.collge.universityservice.repository.UniversityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UniversityServiceTest {

    @Mock
    private UniversityRepository mockUniversityRepository;

    private UniversityService universityServiceUnderTest;

    @BeforeEach
    void setUp() {
        universityServiceUnderTest = new UniversityService(mockUniversityRepository);
    }

    @Test
    void testAddUni() throws Exception {
        // Setup
        final University university = University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build();
        final ResponseEntity<String> expectedResult = new ResponseEntity<>("University is already present",
                HttpStatusCode.valueOf(409));

        // Configure UniversityRepository.findByUniName(...).
        University university1 = University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build();
        when(mockUniversityRepository.findByUniName("uniName")).thenReturn(Optional.of(university1));

        // Run the test
        final ResponseEntity<String> result = universityServiceUnderTest.addUni(university1);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testAddUni_UniversityRepositoryFindByUniNameReturnsAbsent() throws Exception {
        // Setup
        final University university = University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build();
        final ResponseEntity<String> expectedResult = new ResponseEntity<>("University added successfully",
                HttpStatusCode.valueOf(201));
        when(mockUniversityRepository.findByUniName("uniName")).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<String> result = universityServiceUnderTest.addUni(university);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
        verify(mockUniversityRepository).save(University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build());
    }

    @Test
    void testGetAllUnis() throws Exception {
        // Setup
        final List<University> expectedResult = List.of(University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build());

        // Configure UniversityRepository.findAll(...).
        final List<University> universities = List.of(University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build());
        when(mockUniversityRepository.findAll()).thenReturn(universities);

        // Run the test
        final List<University> result = universityServiceUnderTest.getAllUnis();

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetAllUnis_UniversityRepositoryReturnsNoItems() throws Exception {
        // Setup
        when(mockUniversityRepository.findAll()).thenReturn(Collections.emptyList());

        // Run the test
        final List<University> result = universityServiceUnderTest.getAllUnis();

        // Verify the results
        assertThat(result).isEqualTo(Collections.emptyList());
    }

    @Test
    void testGetUniByName() throws Exception {
        // Setup
        final ResponseEntity<University> expectedResult = new ResponseEntity<>(University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build(), HttpStatusCode.valueOf(200));

        // Configure UniversityRepository.findByUniName(...).
        final Optional<University> university = Optional.of(University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build());
        when(mockUniversityRepository.findByUniName("uniName")).thenReturn(university);

        // Run the test
        final ResponseEntity<University> result = universityServiceUnderTest.getUniByName("uniName");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetUniByName_UniversityRepositoryReturnsAbsent() throws Exception {
        // Setup
        final ResponseEntity<University> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(404));
        when(mockUniversityRepository.findByUniName("uniName")).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<University> result = universityServiceUnderTest.getUniByName("uniName");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testAddUniEmail() throws Exception {
        // Setup
        AddValueDTO addValueDTO = new AddValueDTO();
        addValueDTO.setUniversityId(1); // Example ID
        addValueDTO.setValue("newemail@university.com");

        University university = new University();
        university.setUniversityId(1);
        university.setUniEmails(new ArrayList<>());

        when(mockUniversityRepository.findById(1)).thenReturn(Optional.of(university));

        // Act
        ResponseEntity<University> response = universityServiceUnderTest.addUniEmail(addValueDTO);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().getUniEmails().contains("newemail@university.com"));
    }

    @Test
    void testAddUniEmail_UniversityRepositoryFindByIdReturnsAbsent() throws Exception {
        // Setup
        final AddValueDTO addValueDTO = AddValueDTO.builder()
                .universityId(0)
                .value("value")
                .build();
        final ResponseEntity<University> expectedResult = new ResponseEntity<>(University.builder()
                .universityId(null)
                .uniName(null)
                .uniEmails(null)
                .uniLocations(null)
                .build(), HttpStatusCode.valueOf(404));
        when(mockUniversityRepository.findById(0)).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<University> result = universityServiceUnderTest.addUniEmail(addValueDTO);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testAddUniLocation() throws Exception {
        // Setup
        final AddValueDTO addValueDTO = AddValueDTO.builder()
                .universityId(1)
                .value("value")
                .build();

        University university = new University();
        university.setUniversityId(1);
        university.setUniLocations(new ArrayList<>());

        // Configure UniversityRepository.findById(...).
        when(mockUniversityRepository.findById(1)).thenReturn(Optional.of(university));

        // Run the test
        final ResponseEntity<University> result = universityServiceUnderTest.addUniLocation(addValueDTO);

        // Verify the results
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertTrue(result.getBody().getUniLocations().contains("value"));

        verify(mockUniversityRepository, times(1)).save(any(University.class));
    }

    @Test
    void testAddUniLocation_UniversityRepositoryFindByIdReturnsAbsent() throws Exception {
        // Setup
        final AddValueDTO addValueDTO = AddValueDTO.builder()
                .universityId(0)
                .value("value")
                .build();
        final ResponseEntity<University> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(404));
        when(mockUniversityRepository.findById(0)).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<University> result = universityServiceUnderTest.addUniLocation(addValueDTO);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testCheckUniEmailExistence() throws Exception {
        // Setup
        final EmailDTO emailDTO = EmailDTO.builder()
                .uniName("uniName")
                .uniEmail("uniEmail")
                .build();
        final ResponseEntity<Boolean> expectedResult = new ResponseEntity<>(false, HttpStatusCode.valueOf(404));
        when(mockUniversityRepository.findAllUniEmailsByUniName("uniName"))
                .thenReturn(new ArrayList<>(List.of("value")));

        // Run the test
        final ResponseEntity<Boolean> result = universityServiceUnderTest.checkUniEmailExistence(emailDTO);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testCheckUniEmailExistence_UniversityRepositoryReturnsNoItems() throws Exception {
        // Setup
        final EmailDTO emailDTO = EmailDTO.builder()
                .uniName("uniName")
                .uniEmail("uniEmail")
                .build();
        final ResponseEntity<Boolean> expectedResult = new ResponseEntity<>(false, HttpStatusCode.valueOf(404));
        when(mockUniversityRepository.findAllUniEmailsByUniName("uniName")).thenReturn(new ArrayList<>());

        // Run the test
        final ResponseEntity<Boolean> result = universityServiceUnderTest.checkUniEmailExistence(emailDTO);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testDeleteUniById() throws Exception {
        // Setup
        final ResponseEntity<String> expectedResult = new ResponseEntity<>("University Deleted",
                HttpStatusCode.valueOf(200));

        // Configure UniversityRepository.findById(...).
        final Optional<University> university = Optional.of(University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build());
        when(mockUniversityRepository.findById(0)).thenReturn(university);

        // Run the test
        final ResponseEntity<String> result = universityServiceUnderTest.deleteUniById(0);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
        verify(mockUniversityRepository).deleteById(0);
    }

    @Test
    void testDeleteUniById_UniversityRepositoryFindByIdReturnsAbsent() throws Exception {
        // Setup
        final ResponseEntity<String> expectedResult = new ResponseEntity<>("University Not Found with Id: 0",
                HttpStatusCode.valueOf(404));
        when(mockUniversityRepository.findById(0)).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<String> result = universityServiceUnderTest.deleteUniById(0);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testUpdateUniInfo() throws Exception {
        // Setup
        final University universityRequest = University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build();
        final ResponseEntity<String> expectedResult = new ResponseEntity<>("University Updated",
                HttpStatusCode.valueOf(200));

        // Configure UniversityRepository.findById(...).
        final Optional<University> university = Optional.of(University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build());
        when(mockUniversityRepository.findById(0)).thenReturn(university);

        // Run the test
        final ResponseEntity<String> result = universityServiceUnderTest.updateUniInfo(0, universityRequest);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
        verify(mockUniversityRepository).save(University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build());
    }

    @Test
    void testUpdateUniInfo_UniversityRepositoryFindByIdReturnsAbsent() throws Exception {
        // Setup
        final University universityRequest = University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build();
        final ResponseEntity<String> expectedResult = new ResponseEntity<>("University Not Found with Id:" + universityRequest.getUniversityId(),
                HttpStatusCode.valueOf(404));
        when(mockUniversityRepository.findById(0)).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<String> result = universityServiceUnderTest.updateUniInfo(0, universityRequest);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetAllUniNames() throws Exception {
        // Setup
        // Configure UniversityRepository.findAll(...).
        final List<University> universities = List.of(University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build());
        when(mockUniversityRepository.findAll()).thenReturn(universities);

        // Run the test
        final List<String> result = universityServiceUnderTest.getAllUniNames();

        // Verify the results
        assertThat(result).isEqualTo(List.of("uniName"));
    }

    @Test
    void testGetAllUniNames_UniversityRepositoryReturnsNoItems() throws Exception {
        // Setup
        when(mockUniversityRepository.findAll()).thenReturn(Collections.emptyList());

        // Run the test
        final List<String> result = universityServiceUnderTest.getAllUniNames();

        // Verify the results
        assertThat(result).isEqualTo(Collections.emptyList());
    }

    @Test
    void testGetUniLocationByName() throws Exception {
        // Setup
        // Configure UniversityRepository.findByUniName(...).
        final Optional<University> university = Optional.of(University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build());
        when(mockUniversityRepository.findByUniName("uniName")).thenReturn(university);

        // Run the test
        final List<String> result = universityServiceUnderTest.getUniLocationByName("uniName");

        // Verify the results
        assertThat(result).isEqualTo(List.of("value"));
    }

    @Test
    void testGetUniLocationByName_UniversityRepositoryReturnsAbsent() throws Exception {
        // Setup
        when(mockUniversityRepository.findByUniName("uniName")).thenReturn(Optional.empty());

        // Run the test
        final List<String> result = universityServiceUnderTest.getUniLocationByName("uniName");

        // Verify the results
        assertThat(result).isEqualTo(Collections.emptyList());
    }

    @Test
    void testGetUniById() throws Exception {
        // Setup
        final ResponseEntity<University> expectedResult = new ResponseEntity<>(University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build(), HttpStatusCode.valueOf(200));

        // Configure UniversityRepository.findById(...).
        final Optional<University> university = Optional.of(University.builder()
                .universityId(0)
                .uniName("uniName")
                .uniEmails(List.of("value"))
                .uniLocations(List.of("value"))
                .build());
        when(mockUniversityRepository.findById(0)).thenReturn(university);

        // Run the test
        final ResponseEntity<University> result = universityServiceUnderTest.getUniById(0);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetUniById_UniversityRepositoryReturnsAbsent() throws Exception {
        // Setup
        final ResponseEntity<University> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(404));
        when(mockUniversityRepository.findById(0)).thenReturn(Optional.empty());

        // Run the test
        final ResponseEntity<University> result = universityServiceUnderTest.getUniById(0);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }
}
