package com.collge.USERSERVICE.model;

import com.collge.USERSERVICE.enums.FriendshipStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_friends")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Friendship {

    @EmbeddedId
    private FriendshipId id = new FriendshipId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("friendId")
    @JoinColumn(name = "friend_id")
    private User friend;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private FriendshipStatus status;

}
