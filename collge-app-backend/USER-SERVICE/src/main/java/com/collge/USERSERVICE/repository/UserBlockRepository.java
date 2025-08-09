package com.collge.USERSERVICE.repository;

import com.collge.USERSERVICE.model.User;
import com.collge.USERSERVICE.model.UserBlock;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserBlockRepository extends JpaRepository<UserBlock, Long> {

    /**
     * Check if a specific block record exists.
     */
    @Query("SELECT COUNT(ub) > 0 " +
            "FROM UserBlock ub " +
            "WHERE ub.blockerId = :blockerId AND ub.blockedId = :blockedId")
    boolean existsByBlockerIdAndBlockedId(Long blockerId, Long blockedId);

    /**
     * Find all user IDs that a given user blocks.
     */
    @Query("SELECT ub.blockedId " +
            "FROM UserBlock ub " +
            "WHERE ub.blockerId = :blockerId")
    List<Long> findBlockedUserIdsByBlockerId(Long blockerId);

    @Query("""
    SELECT u
    FROM UserBlock ub
    JOIN User u ON u.userId = ub.blockedId
    WHERE ub.blockerId = :blockerId
""")
    Page<User> findBlockedUserWithData(@Param("blockerId") Long blockerId, Pageable pageable);

    /**
     * Find all user IDs that block a given user.
     */
    @Query("SELECT ub.blockerId " +
            "FROM UserBlock ub " +
            "WHERE ub.blockedId = :blockedId")
    List<Long> findBlockerIdsByBlockedId(Long blockedId);

    @Query("SELECT ub.blockedId " +
            "FROM UserBlock ub " +
            "WHERE ub.blockerId = :blockerId")
    List<Long> findBlockerIdsByBlockerId(Long blockerId);

    /**
     * Delete a single block record (e.g., when user unblocks someone).
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM UserBlock ub " +
            "WHERE ub.blockerId = :blockerId AND ub.blockedId = :blockedId")
    void deleteBlock(Long blockerId, Long blockedId);


}
