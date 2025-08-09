package com.collge.NOTIFICATION_SERVICE.error;

public enum NotificationError {

    CLG9095_MISSING_USER_ID                     (9095_1, ": No User IDs were provided. At least one User ID is required. Bad Request"),
    CLG9095_MISSING_UNIVERSITY_ID               (9095_2, ": No University IDs were provided. At least one University ID is required. Bad Request"),

    CLG9095_MISSING_NOTIF_TOKEN_USERID          (9095_3,": No User ID was provided. Please provide a userId along with the request. Bad Request");
    private String template;
    private int templateNumber;

    private NotificationError(int templateNumber , String template) {
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
