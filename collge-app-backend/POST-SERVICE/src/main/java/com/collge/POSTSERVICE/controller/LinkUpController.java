package com.collge.POSTSERVICE.controller;

import com.collge.POSTSERVICE.dto.NewLinkUpPostDTO;
import com.collge.POSTSERVICE.service.LinkUpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/linkup")
public class LinkUpController {

    @Autowired
    private LinkUpService linkUpService;

    @PostMapping
    public ResponseEntity<?> createNewLinkUpPost(@RequestBody NewLinkUpPostDTO newLinkUpPostDTO){

        return linkUpService.createNewLinkUpPost(newLinkUpPostDTO);

    }

    @PostMapping("/respondToCollabRequest")
    public ResponseEntity<?> respondToCollabRequest(@RequestParam Long authorId, @RequestParam Long friendId, @RequestParam boolean isAccepted){

        return linkUpService.respondToCollabRequest(authorId, friendId, isAccepted);

    }

    @PostMapping("/createLinkUpRequest")
    public ResponseEntity<?> createLinkUpRequest(@RequestParam String postId, @RequestParam Long userId){

        return linkUpService.createLinkUpRequest(postId, userId);

    }

    @GetMapping("/isLinkUpInterestPresent")
    public ResponseEntity<?> isLinkUpInterestPresent(@RequestParam String postId, @RequestParam Long userId){

        return linkUpService.isLinkUpInterestPresent(postId, userId);

    }

    @PostMapping("/acceptLinkUpRequest")
    public ResponseEntity<?> acceptLinkUpRequest(@RequestParam Long userId, @RequestParam String postId){

        return linkUpService.acceptLinkUpRequest(userId,postId);

    }

    @GetMapping
    public ResponseEntity<?> getAllLinkUps(@RequestParam Integer universityId,@RequestParam Long userId, @RequestParam int offset, @RequestParam int pageSize){

        return linkUpService.getAllLinkUps(universityId,userId,offset, pageSize);

    }

    @GetMapping("/getAllLinkUpsByCampus")
    public ResponseEntity<?> getAllLinkUpsByCampus(@RequestParam Long userId,@RequestParam Integer universityId,@RequestParam int offset, @RequestParam int pageSize){
        return linkUpService.getAllLinkUpsByCampus(userId, universityId, offset, pageSize);
    }

    @GetMapping("/getAllLinkUpRequestsByAuthorId")
    public ResponseEntity<?> getAllLinkUpRequestsByUserId(@RequestParam Long authorId, @RequestParam int offset, @RequestParam int pageSize){
        return linkUpService.getAllLinkUpRequestsByUserId(authorId, offset, pageSize);
    }

    @GetMapping("/getAllLinkUpsByParticipantId")
    public ResponseEntity<?> getAllLinkUpsByParticipantId(@RequestParam Long participantId, @RequestParam int offset, @RequestParam int pageSize){
        return linkUpService.getAllLinkUpsByParticipantId(participantId, offset, pageSize);
    }

    @GetMapping("/getAllLinkUpsByAuthorId")
    public ResponseEntity<?> getAllLinkUpsByAuthorId(@RequestParam Long authorId, @RequestParam int offset, @RequestParam int pageSize){
        return linkUpService.getAllLinkUpsByAuthorId(authorId, offset, pageSize);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteLinkUp(@RequestParam String postId){
        return linkUpService.deleteLinkUp(postId);
    }

    @GetMapping("/getLinkUpProfileData")
    public ResponseEntity<?> getLinkUpProfileData(@RequestParam Long userId){

        return linkUpService.getLinkUpProfileData(userId);

    }

    @PostMapping("/addLinkUpPhotos")
    public ResponseEntity<?> addLinkUpPhotos(@RequestParam String linkUpPhotosData, @RequestParam MultipartFile[] files){
        return linkUpService.addLinkUpPhotos(linkUpPhotosData, files);
    }

    @DeleteMapping("/deleteLinkUpPhoto")
    public ResponseEntity<?> deleteLinkUpPhoto(@RequestParam String mediaId){
        return linkUpService.deleteLinkUpPhoto(mediaId);
    }

}