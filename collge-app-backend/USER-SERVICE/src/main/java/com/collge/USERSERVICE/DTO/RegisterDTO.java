package com.collge.USERSERVICE.DTO;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterDTO {

    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String universityName;
    private String email;
    private Integer yearOfGraduation;
    private String location;

}
