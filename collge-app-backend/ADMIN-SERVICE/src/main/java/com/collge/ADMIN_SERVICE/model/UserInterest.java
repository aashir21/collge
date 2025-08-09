package com.collge.ADMIN_SERVICE.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "user_interest")
public class UserInterest {

    @Id
    private String entryId;

    private String fullName;
    private String gender;
    private String email;
    private String universityName;

}
