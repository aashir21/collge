package com.collge.USERSERVICE.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sendgrid.Email;
import com.sendgrid.Mail;
import com.sendgrid.Method;
import com.sendgrid.Personalization;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;


@Service("emailService")
public class EmailService {

    @Value("${spring.sendgrid.api-key}")
    private String API_KEY;

    @Autowired
    private JavaMailSender javaMailSender;

    private static final String NO_REPLY_EMAIL_DOMAIN = "noreply@collge.io";

    @Autowired
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Async
    public void sendEmail(SimpleMailMessage email) {
        this.javaMailSender.send(email);
    }

    public String send(String receiver, String link) throws IOException {
        Email from = new Email(NO_REPLY_EMAIL_DOMAIN);
        Email to = new Email(receiver);
        Mail mail = new Mail();
        DynamicTemplatePersonalization personalization = new DynamicTemplatePersonalization();
        personalization.addTo(to);
        mail.setFrom(from);
        mail.setSubject("Verify Your Account - Collge App");
        personalization.addDynamicTemplateData("link", link);
        mail.addPersonalization(personalization);
        mail.setTemplateId("d-ad14c7d65b094652bb050ab052fb7a40");
        SendGrid sg = new SendGrid(API_KEY);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            return response.getBody();
        } catch (IOException var10) {
            throw var10;
        }
    }

    public String sendWelcomeMail(String receiver) throws IOException {
        Email from = new Email(NO_REPLY_EMAIL_DOMAIN);
        Email to = new Email(receiver);
        Mail mail = new Mail();
        DynamicTemplatePersonalization personalization = new DynamicTemplatePersonalization();
        personalization.addTo(to);
        mail.setFrom(from);
        mail.setSubject("Welcome to Collge");
        mail.addPersonalization(personalization);
        mail.setTemplateId("d-2cb6d1f7b792440485dbe0fa4bffbd12");
        SendGrid sg = new SendGrid(API_KEY);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            return response.getBody();
        } catch (IOException var10) {
            throw var10;
        }
    }

    public String sendOTP(String receiver, String otp) throws IOException {
        Email from = new Email(NO_REPLY_EMAIL_DOMAIN);
        Email to = new Email(receiver);
        Mail mail = new Mail();
        DynamicTemplatePersonalization personalization = new DynamicTemplatePersonalization();
        personalization.addTo(to);
        mail.setFrom(from);
        mail.setSubject("Reset Your Password");
        personalization.addDynamicTemplateData("otp", otp);
        mail.addPersonalization(personalization);
        mail.setTemplateId("d-edf3430efe404e64a553b7e64ff48831");
        SendGrid sg = new SendGrid(API_KEY);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            return response.getBody();
        } catch (IOException var10) {
            throw var10;
        }
    }

    public String sendVerificationSuccessfulEmail(String receiver, String firstName, String verificationType) throws IOException {
        Email from = new Email(NO_REPLY_EMAIL_DOMAIN);
        Email to = new Email(receiver);
        Mail mail = new Mail();
        DynamicTemplatePersonalization personalization = new DynamicTemplatePersonalization();
        personalization.addTo(to);
        mail.setFrom(from);
        mail.setSubject("Identity Verified - Collge");
        personalization.addDynamicTemplateData("username", firstName);
        mail.addPersonalization(personalization);

        String templateId = "d-545d663b731d4dc8a227d425d68f93fd";

        if(verificationType.equals("LINKUP")){
            templateId = "d-d00ba07af427416fad6c04d08d65511b";
        }

        mail.setTemplateId(templateId);
        SendGrid sg = new SendGrid(API_KEY);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            return response.getBody();
        } catch (IOException var10) {
            throw var10;
        }
    }

    public String sendVerificationRejectionEmail(String receiver, String firstName, String reasons) throws IOException {
        Email from = new Email(NO_REPLY_EMAIL_DOMAIN);
        Email to = new Email(receiver);
        Mail mail = new Mail();
        DynamicTemplatePersonalization personalization = new DynamicTemplatePersonalization();
        personalization.addTo(to);
        mail.setFrom(from);
        mail.setSubject("Identity Verified - Collge");
        personalization.addDynamicTemplateData("username", firstName);
        personalization.addDynamicTemplateData("reasons", reasons);
        mail.addPersonalization(personalization);

        mail.setTemplateId("d-d00ba07af427416fad6c04d08d65511b");
        SendGrid sg = new SendGrid(API_KEY);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            return response.getBody();
        } catch (IOException var10) {
            throw var10;
        }
    }

    private static class DynamicTemplatePersonalization extends Personalization {
        @JsonProperty("dynamic_template_data")
        private Map<String, String> dynamic_template_data;

        private DynamicTemplatePersonalization() {
        }

        @JsonProperty("dynamic_template_data")
        public Map<String, String> getDynamicTemplateData() {
            return this.dynamic_template_data == null ? Collections.emptyMap() : this.dynamic_template_data;
        }

        public void addDynamicTemplateData(String key, String value) {
            if (this.dynamic_template_data == null) {
                this.dynamic_template_data = new HashMap();
                this.dynamic_template_data.put(key, value);
            } else {
                this.dynamic_template_data.put(key, value);
            }

        }
    }

}
