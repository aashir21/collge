package com.collge.ADMIN_SERVICE.repository;

import com.collge.ADMIN_SERVICE.dto.SearchDTO;
import com.collge.ADMIN_SERVICE.dto.UserAccountVerificationData;
import com.collge.ADMIN_SERVICE.dto.VerificationRejectionReasons;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

@Repository
@FeignClient(
        name = "USER-SERVICE",
        url = "${service-urls.baseEndpoint}"
)
public interface UserRepository {

    @PutMapping({"/api/v1/user/updateUserLinkUp"})
    ResponseEntity<String> updateUserLinkUp(@RequestParam String email, @RequestParam String verificationType);

    @GetMapping({"/api/v1/user/getUserDetailsByEmail"})
    SearchDTO getUserDetailsByEmail(@RequestParam String email);

    @GetMapping({"/api/v1/user/getUserAccountVerificationData"})
    UserAccountVerificationData getUserAccountVerificationData(@RequestParam String email);

    @PostMapping(value = {"/api/v1/user/sendRejectionEmail"})
    void sendRejectionEmail(@RequestBody VerificationRejectionReasons rejectionReasons);

}
