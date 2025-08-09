package com.collge.USERSERVICE.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FriendshipId implements Serializable {

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "friend_id")
    private Long friendId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FriendshipId)) return false;
        FriendshipId that = (FriendshipId) o;
        return (userId.equals(that.userId) && friendId.equals(that.friendId)) ||
                (userId.equals(that.friendId) && friendId.equals(that.userId));
    }

    @Override
    public int hashCode() {
        return userId.hashCode() + friendId.hashCode();
    }

}
