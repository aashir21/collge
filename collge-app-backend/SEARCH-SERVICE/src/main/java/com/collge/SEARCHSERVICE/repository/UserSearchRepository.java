package com.collge.SEARCHSERVICE.repository;

import com.collge.SEARCHSERVICE.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSearchRepository extends JpaRepository<User, Long> {

    @Query(value = "SELECT username, user_id, first_name, last_name, avatar, is_premium_user, role FROM users " +
            "WHERE username LIKE %:query% OR " +
            "first_name LIKE %:query% OR " +
            "CONCAT(first_name, ' ', last_name) LIKE %:query% OR " +
            "last_name LIKE %:query%", nativeQuery = true)
    Page<User> findByUsernameOrFirstNameOrLastNameContaining(@Param("query") String query, Pageable pageable);

}
