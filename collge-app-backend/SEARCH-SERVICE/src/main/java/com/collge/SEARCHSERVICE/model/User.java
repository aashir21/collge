package com.collge.SEARCHSERVICE.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private Long userId;

    private String firstName;

    private String lastName;

    private  String username;

    private String avatar;

    private boolean isPremiumUser;

    private String role;

}
