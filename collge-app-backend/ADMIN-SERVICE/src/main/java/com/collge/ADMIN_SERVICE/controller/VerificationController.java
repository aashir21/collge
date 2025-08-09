package com.collge.ADMIN_SERVICE.controller;

import com.collge.ADMIN_SERVICE.dto.SubmitVerificationDTO;
import com.collge.ADMIN_SERVICE.dto.VerificationRejectionDTO;
import com.collge.ADMIN_SERVICE.service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequestMapping("/api/v1/admin/verify")
@RestController
@CrossOrigin("*")
public class VerificationController {

    @Autowired
    private VerificationService verificationService;

    @PostMapping
    public ResponseEntity<?> submitVerification(
            @RequestParam String verificationDataRequest,
            @RequestParam MultipartFile[] files) {

        // Pass the request data to the service for processing
        return verificationService.submitVerification(verificationDataRequest, files);
    }

    @GetMapping("/getVerificationStatusByEmail")
    public ResponseEntity<?> getVerificationStatusByEmail(@RequestParam String email){

        return verificationService.getVerificationStatusByEmail(email);
    }

    @GetMapping("/getAllVerificationRequest")
    public ResponseEntity<?> getAllVerificationRequests(@RequestParam Integer offset, @RequestParam Integer pageSize){
        return verificationService.getAllVerificationRequests(offset, pageSize);
    }

    @GetMapping("/getVerificationRequest")
    public ResponseEntity<?> getVerificationRequest(@RequestParam String email){
        return verificationService.getVerificationRequest(email);
    }

    @PostMapping("/approveVerificationRequest")
    public ResponseEntity<?> approveVerificationRequest(@RequestParam String email){
        return verificationService.approveVerificationRequest(email);
    }

    @PutMapping("/rejectVerificationRequest")
    public ResponseEntity<?> rejectVerificationRequest(@RequestBody VerificationRejectionDTO verificationRejectionDTO){
        return verificationService.rejectVerificationRequest(verificationRejectionDTO);
    }

}
