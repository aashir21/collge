package com.collge.SEARCHSERVICE.repository_v2;

import com.collge.SEARCHSERVICE.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSearchRepository_V2 extends JpaRepository<User, Long> {

    @Query(
            value = """
        SELECT u.*
        FROM users u
        LEFT JOIN user_blocks bub 
            ON bub.blocker_id = :userId
           AND bub.blocked_id = u.user_id
        LEFT JOIN user_blocks wbm 
            ON wbm.blocker_id = u.user_id
           AND wbm.blocked_id = :userId
        WHERE (
            u.username LIKE %:query%
            OR u.first_name LIKE %:query%
            OR CONCAT(u.first_name, ' ', u.last_name) LIKE %:query%
            OR u.last_name LIKE %:query%
        )
        -- Exclude if user is blocked or blocking:
        AND bub.id IS NULL
        AND wbm.id IS NULL
        """,
            countQuery = """
        SELECT COUNT(*)
        FROM users u
        LEFT JOIN user_blocks bub 
            ON bub.blocker_id = :userId
           AND bub.blocked_id = u.user_id
        LEFT JOIN user_blocks wbm 
            ON wbm.blocker_id = u.user_id
           AND wbm.blocked_id = :userId
        WHERE (
            u.username LIKE %:query%
            OR u.first_name LIKE %:query%
            OR CONCAT(u.first_name, ' ', u.last_name) LIKE %:query%
            OR u.last_name LIKE %:query%
        )
        AND bub.id IS NULL
        AND wbm.id IS NULL
        """,
            nativeQuery = true
    )
    Page<User> searchUsersExcludingBlocked(@Param("query") String query,
                                           @Param("userId") Long userId,
                                           Pageable pageable);

}
