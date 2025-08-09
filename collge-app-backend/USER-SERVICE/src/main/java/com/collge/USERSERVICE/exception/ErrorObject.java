package com.collge.USERSERVICE.exception;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ErrorObject {

    private Integer httpStatus;
    private String errorMessage;
    private Date errorDate;
}
