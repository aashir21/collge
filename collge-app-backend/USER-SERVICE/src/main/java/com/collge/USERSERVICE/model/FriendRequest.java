package com.collge.USERSERVICE.model;


import com.collge.USERSERVICE.enums.FriendshipStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "friend_requests"
)
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FriendRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer requestId;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    @JsonIgnore
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    @JsonIgnore
    private User receiver;

    @Enumerated(EnumType.STRING)
    private FriendshipStatus status;

}
