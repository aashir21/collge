package com.collge.ADMIN_SERVICE.service;

import com.collge.ADMIN_SERVICE.dto.UserInterestDTO;
import com.collge.ADMIN_SERVICE.model.UserInterest;
import com.collge.ADMIN_SERVICE.repository.UserInterestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserInterestService {

    @Autowired
    private UserInterestRepository userInterestRepository;

    public static final Logger LOGGER = LoggerFactory.getLogger(UserInterestService.class);

    public ResponseEntity<?> createInterest(UserInterestDTO interestDTO) {

        try{
            LOGGER.info("Fetching user");
            Optional<UserInterest> optionalUserInterest = userInterestRepository.getUserInterestByEmail(interestDTO.getEmail());

            LOGGER.info("Fetched user");

            if(!optionalUserInterest.isEmpty()){
                return new ResponseEntity<>("You have already registered!", HttpStatus.CONFLICT);
            }
            else{

                LOGGER.info("New user saving...");
                UserInterest newUserInterest = UserInterest.builder()
                        .email(interestDTO.getEmail())
                        .fullName(interestDTO.getFullName())
                        .universityName(interestDTO.getUniversityName().toUpperCase())
                        .gender(interestDTO.getGender())
                        .build();

                userInterestRepository.save(newUserInterest);
            }

            return new ResponseEntity<>("Thanks for showing interest!", HttpStatus.OK);
        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getAllUserInterests(int offset,int pageSize) {

        try{

            Pageable pageable = PageRequest.of(offset, pageSize);
            Page<UserInterest> optionalUserInterest = userInterestRepository.findAll(pageable);

            return new ResponseEntity<>(optionalUserInterest.get(), HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getAllUserInterestCount(){

        return new ResponseEntity<>(userInterestRepository.count(), HttpStatus.OK);

    }

}
