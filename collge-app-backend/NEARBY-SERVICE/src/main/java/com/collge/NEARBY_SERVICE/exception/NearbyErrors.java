package com.collge.NEARBY_SERVICE.exception;

public enum NearbyErrors {

    CLG9098_FAILED_TO_UPDATE_LOCATION           (9098_1, ": Something went wrong updating user location. Cause: {{0}}"),
    CLG9098_MISSING_USER_ID                     (9098_2, ": No User ID were provided. Please provide a User ID. Bad Request"),
    CLG9098_LOCATION_ENTRY_NOT_FOUND            (9098_3, ": No user location entry was found. Not Found"),
    CLG9098_FAILED_TO_GET_NEARBY_USERS          (9098_4, ": Something went wrong fetching nearby users. Cause: {{0}}")

    ;
    private String template;
    private int templateNumber;

    private NearbyErrors(int templateNumber , String template) {
        this.template = "CLG"+Integer.toString(templateNumber)+template ;
        this.templateNumber = templateNumber ;
    }

    public String toString() {
        return this.template ;
    }

    public int getTemplateNumber() {
        return this.templateNumber;
    }

}
