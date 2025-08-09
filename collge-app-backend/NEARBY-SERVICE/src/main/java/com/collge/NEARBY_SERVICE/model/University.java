package com.collge.NEARBY_SERVICE.model;

import lombok.*;

import java.util.List;


@AllArgsConstructor
@Builder
@Getter
@Setter
@NoArgsConstructor
public class University {

    private Integer universityId;
    private String uniName;
    private List<String> uniEmails;
    private List<String> uniLocations;

}
