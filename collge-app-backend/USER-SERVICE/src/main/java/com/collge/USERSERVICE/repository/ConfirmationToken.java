package com.collge.USERSERVICE.repository;

import com.collge.USERSERVICE.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ConfirmationToken extends JpaRepository<com.collge.USERSERVICE.model.ConfirmationToken, Long> {

    Optional<com.collge.USERSERVICE.model.ConfirmationToken> findByUser(User user);

}
