package com.collge.USERSERVICE.repository;

import com.collge.USERSERVICE.enums.FriendshipStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.collge.USERSERVICE.model.Friendship;
import com.collge.USERSERVICE.model.FriendshipId;
import com.collge.USERSERVICE.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, FriendshipId> {

    @Query("SELECT f FROM Friendship f WHERE (f.user = :user AND f.friend = :friend) OR (f.user = :friend AND f.friend = :user)")
    List<Friendship> findFriendship(@Param("user") User user, @Param("friend") User friend);

    @Query("SELECT e FROM Friendship e WHERE e.user.userId = :userId AND e.status = 'ACCEPTED'")
    Page<Friendship> findAllByUserIdAndStatusAccepted(@Param("userId") Long userId, Pageable pageable);

    @Modifying
    @Query("DELETE FROM Friendship f WHERE f.id.userId = :userId OR f.id.friendId = :userId")
    void deleteAllFriendshipsByUserId(@Param("userId") Long userId);

}
