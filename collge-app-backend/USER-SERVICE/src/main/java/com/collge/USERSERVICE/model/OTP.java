package com.collge.USERSERVICE.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(
        name = "one_time_pass"
)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OTP {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;
    private String otpValue;
    private LocalDateTime expiration;
    @OneToOne
    @JsonIgnore
    @JoinColumn(
            name = "user_id"
    )
    private User user;

}
