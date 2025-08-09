package com.collge.POSTSERVICE.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class University {

    private Integer universityId;
    private String uniName;
    private List<String> uniEmails;
    private List<String> uniLocations;

}
