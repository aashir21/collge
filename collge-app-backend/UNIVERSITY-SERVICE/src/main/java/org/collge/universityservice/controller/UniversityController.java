package org.collge.universityservice.controller;

import org.collge.universityservice.exception.UniversityNotFoundException;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.RestController;
import org.collge.universityservice.dto.AddValueDTO;
import org.collge.universityservice.dto.EmailDTO;
import org.collge.universityservice.model.University;
import org.collge.universityservice.service.UniversityService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController
@RequestMapping("/api/v1/university")
@RefreshScope
public class UniversityController {

    private final UniversityService universityService;

    public UniversityController(UniversityService universityService) {
        this.universityService = universityService;
    }

    @PostMapping("/addUni")
    public ResponseEntity<String> addUni(@RequestBody @Valid University university) throws UniversityNotFoundException {
        return this.universityService.addUni(university);
    }

    @PutMapping("/updateUniInfo/{universityId}")
    public ResponseEntity<String> updateUniInfo(@PathVariable Integer universityId, @RequestBody @Valid University universityRequest) throws UniversityNotFoundException {
        return this.universityService.updateUniInfo(universityId, universityRequest);
    }

    @GetMapping("/getAllUnis")
    @ResponseStatus(HttpStatus.OK)
    public List<University> getAllUnis() throws UniversityNotFoundException {
        return this.universityService.getAllUnis();
    }

    @GetMapping("/getUniByName/{uniName}")
    public ResponseEntity<University> getUniByName(@PathVariable String uniName) throws UniversityNotFoundException {
        return this.universityService.getUniByName(uniName);
    }

    @GetMapping("/getUniById/{universityId}")
    public ResponseEntity<University> getUniById(@PathVariable Integer universityId) throws UniversityNotFoundException {
        return this.universityService.getUniById(universityId);
    }

    @GetMapping("/getAllUniNames")
    @ResponseStatus(HttpStatus.OK)
    public List<String> getAllUniNames() throws UniversityNotFoundException {
        return this.universityService.getAllUniNames();
    }

    @PostMapping("/addUniEmail")
    public ResponseEntity<University> addUniEmail(@RequestBody AddValueDTO addValueDTO) throws UniversityNotFoundException {
        return this.universityService.addUniEmail(addValueDTO);
    }

    @PostMapping({"/addUniLocation"})
    public ResponseEntity<University> addUniLocation(@RequestBody AddValueDTO addValueDTO) throws UniversityNotFoundException {
        return this.universityService.addUniLocation(addValueDTO);
    }

    @PostMapping({"/checkUniEmail"})
    public ResponseEntity<Boolean> checkUniEmailExistence(@RequestBody EmailDTO emailDTO) throws UniversityNotFoundException {
        return this.universityService.checkUniEmailExistence(emailDTO);
    }

    @DeleteMapping({"/deleteUni/{universityId}"})
    public ResponseEntity<String> deleteUni(@PathVariable Integer universityId) throws UniversityNotFoundException {
        return this.universityService.deleteUniById(universityId);
    }

    @GetMapping({"/getUniLocationsByName"})
    public List<String> getUniLocationsByName(@RequestParam String uniName) throws UniversityNotFoundException {
        return this.universityService.getUniLocationByName(uniName);
    }

}
