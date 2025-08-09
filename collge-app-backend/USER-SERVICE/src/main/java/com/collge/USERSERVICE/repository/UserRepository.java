package com.collge.USERSERVICE.repository;

import java.util.Optional;

import com.collge.USERSERVICE.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = :email OR u.username = :username")
    Optional<User> findUserByUsernameOrEmail(String username, String email);

    @Query(value = "SELECT u FROM User u WHERE u.universityId = :universityId")
    Page<User> findByUniversityId(@Param("universityId") Integer universityId, Pageable pageable);


}
