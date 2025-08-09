package org.collge.universityservice.service;

import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.stereotype.Service;

import org.collge.universityservice.dto.AddValueDTO;
import org.collge.universityservice.dto.EmailDTO;
import org.collge.universityservice.exception.UniversityNotFoundException;
import org.collge.universityservice.model.University;
import org.collge.universityservice.repository.UniversityRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Service
public class UniversityService {

    private final UniversityRepository universityRepository;

    public UniversityService(UniversityRepository universityRepository) {
        this.universityRepository = universityRepository;
    }

    public ResponseEntity<String> addUni(University university) throws UniversityNotFoundException {
        try {
            Optional<University> optionalUniversity = this.universityRepository.findByUniName(university.getUniName());
            if (optionalUniversity.isPresent()) {
                return new ResponseEntity<>("University is already present", HttpStatus.CONFLICT);
            } else {
                this.universityRepository.save(university);
                return new ResponseEntity<>("University added successfully", HttpStatus.CREATED);
            }
        } catch (Exception e) {
            throw new UniversityNotFoundException("Something went wrong: " + e.getMessage());
        }
    }

    public List<University> getAllUnis() throws UniversityNotFoundException {
        try {
            return this.universityRepository.findAll();
        } catch (Exception var2) {
            throw new UniversityNotFoundException("Something went wrong...");
        }
    }

    public ResponseEntity<University> getUniByName(String uniName) throws UniversityNotFoundException {
        try {
            Optional<University> optionalUniversity = this.universityRepository.findByUniName(uniName);
            if (optionalUniversity.isPresent()) {
                University university = optionalUniversity.get();
                return new ResponseEntity<>(university, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception var4) {
            throw new UniversityNotFoundException("Something went wrong: " + var4.getMessage());
        }
    }

    public ResponseEntity<University> addUniEmail(AddValueDTO addValueDTO) throws UniversityNotFoundException {
        try {
            Optional<University> optionalUniversity = this.universityRepository.findById(addValueDTO.getUniversityId());
            if (optionalUniversity.isPresent()) {
                University university = optionalUniversity.get();
                university.getUniEmails().add(addValueDTO.getValue());
                this.universityRepository.save(university);
                return new ResponseEntity<>(university, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new University(), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            throw new UniversityNotFoundException("Something went wrong...." + e.getMessage());
        }
    }

    public ResponseEntity<University> addUniLocation(AddValueDTO addValueDTO) throws UniversityNotFoundException {
        try {
            Optional<University> optionalUniversity = this.universityRepository.findById(addValueDTO.getUniversityId());
            if (optionalUniversity.isPresent()) {
                University university = optionalUniversity.get();
                university.getUniLocations().add(addValueDTO.getValue());
                this.universityRepository.save(university);
                return new ResponseEntity<>(university, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception var4) {
            throw new UniversityNotFoundException("Something went wrong..." + var4.getMessage());
        }
    }

    public ResponseEntity<Boolean> checkUniEmailExistence(EmailDTO emailDTO) throws UniversityNotFoundException {
        try {
            ArrayList<String> emails = this.universityRepository.findAllUniEmailsByUniName(emailDTO.getUniName());
            return emails.contains(emailDTO.getUniEmail()) ? new ResponseEntity<>(true, HttpStatus.OK) : new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
        } catch (Exception var3) {
            throw new UniversityNotFoundException("University not found with email : " + var3.getMessage());
        }
    }

    public ResponseEntity<String> deleteUniById(Integer universityId) throws UniversityNotFoundException {
        try {
            Optional<University> optionalUniversity = this.universityRepository.findById(universityId);
            if (optionalUniversity.isPresent()) {
                University university = optionalUniversity.get();
                this.universityRepository.deleteById(university.getUniversityId());
                return new ResponseEntity<>("University Deleted", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("University Not Found with Id: " + universityId, HttpStatus.NOT_FOUND);
            }
        } catch (DataAccessException var4) {
            throw new UniversityNotFoundException("Something went wrong");
        }
    }

    public ResponseEntity<String> updateUniInfo(Integer universityId, University universityRequest) throws UniversityNotFoundException {
        try {
            Optional<University> optionalUniversity = this.universityRepository.findById(universityId);
            if (!optionalUniversity.isPresent()) {
                return new ResponseEntity<>("University Not Found with Id:" + universityId, HttpStatus.NOT_FOUND);
            } else {
                University existingUniversity = optionalUniversity.get();
                existingUniversity.setUniName(universityRequest.getUniName());
                existingUniversity.setUniEmails(universityRequest.getUniEmails());
                existingUniversity.setUniLocations(universityRequest.getUniLocations());
                this.universityRepository.save(existingUniversity);
                return new ResponseEntity<>("University Updated", HttpStatus.OK);
            }
        } catch (Exception var5) {
            throw new UniversityNotFoundException("Something went wrong: " + var5.getMessage());
        }
    }

    public List<String> getAllUniNames() throws UniversityNotFoundException {
        try {
            List<University> universities = this.universityRepository.findAll();
            return universities.stream()
                    .map(University::getUniName)
                    .filter(name -> !name.equalsIgnoreCase("Collge"))
                    .collect(Collectors.toList());
        } catch (Exception var2) {
            throw new UniversityNotFoundException("Something went wrong.." + var2.getMessage());
        }
    }

    public List<String> getUniLocationByName(String uniName) throws UniversityNotFoundException {
        try {
            Optional<University> optionalUniversity = this.universityRepository.findByUniName(uniName);
            List<String> locations = new ArrayList<>();
            if (optionalUniversity.isPresent()) {
                University university = optionalUniversity.get();
                locations = university.getUniLocations();
            }

            return locations;
        } catch (Exception var5) {
            throw new UniversityNotFoundException("University not found with name: " + uniName);
        }
    }

    public ResponseEntity<University> getUniById(Integer universityId) throws UniversityNotFoundException {
        try {
            Optional<University> optionalUniversity = this.universityRepository.findById(universityId);
            if (optionalUniversity.isPresent()) {
                University university = optionalUniversity.get();
                return new ResponseEntity<>(university, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception var4) {
            throw new UniversityNotFoundException("Something went wrong..." + var4.getMessage());
        }
    }

}
