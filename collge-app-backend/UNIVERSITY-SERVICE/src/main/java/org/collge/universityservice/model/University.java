package org.collge.universityservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(
        name = "university"
)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Data
public class University {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    @Column(
            name = "university_id"
    )
    private Integer universityId;
    @Column(
            name = "university_name"
    )
    private @NotBlank(
            message = "Name is a required field"
    ) String uniName;


    @ElementCollection
    private List<String> uniEmails;
    @ElementCollection
    private List<String> uniLocations;
}
