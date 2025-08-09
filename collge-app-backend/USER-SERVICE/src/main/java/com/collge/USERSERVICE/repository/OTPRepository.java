package com.collge.USERSERVICE.repository;

import java.util.Optional;

import com.collge.USERSERVICE.model.OTP;
import com.collge.USERSERVICE.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;


public interface OTPRepository extends JpaRepository<OTP, Long> {

    Optional<OTP> findByUser(User user);

}
