package com.collge.USERSERVICE.repository;

import java.util.List;
import java.util.Optional;

import com.collge.USERSERVICE.model.Token;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TokenRepository extends JpaRepository<Token, Long> {

    @Query("select t from Token t inner join User u on t.user.userId = u.userId\n    where u.userId = :userId and (t.expired =false or t.revoked = false)\n")
    List<Token> findAllValidTokensByUser(Long userId);

    List<Token> findByToken(String token);

    @Modifying
    @Query("DELETE FROM Token t WHERE t.user.userId = :userId")
    void deleteAllTokensByUserId(@Param("userId") Long userId);

}
