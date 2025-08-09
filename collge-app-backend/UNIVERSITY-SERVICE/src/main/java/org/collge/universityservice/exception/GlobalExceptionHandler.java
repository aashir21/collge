package org.collge.universityservice.exception;

import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;

@ControllerAdvice
@NoArgsConstructor
public class GlobalExceptionHandler {

    @ExceptionHandler(UniversityNotFoundException.class)
    public ResponseEntity<ErrorObject> handleUniversityNotFoundException(UniversityNotFoundException ex, WebRequest request) {
        ErrorObject errorObject = new ErrorObject();
        errorObject.setHttpStatus(HttpStatus.NOT_FOUND.value());
        errorObject.setErrorMessage(ex.getMessage());
        errorObject.setErrorDate(new Date());
        return new ResponseEntity<>(errorObject, HttpStatus.NOT_FOUND);
    }

}
