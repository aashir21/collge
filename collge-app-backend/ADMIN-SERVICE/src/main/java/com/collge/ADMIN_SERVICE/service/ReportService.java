package com.collge.ADMIN_SERVICE.service;

import com.collge.ADMIN_SERVICE.dto.CreateReportDTO;
import com.collge.ADMIN_SERVICE.exception.AdminServiceException;
import com.collge.ADMIN_SERVICE.model.Report;
import com.collge.ADMIN_SERVICE.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;


    public ResponseEntity<?> createReport(CreateReportDTO createReportDTO) {

        try{

            Report newReport = Report.builder()
                    .actorId(createReportDTO.getActorId())
                    .userId(createReportDTO.getUserId())
                    .postId(createReportDTO.getPostId())
                    .commentId(createReportDTO.getCommentId())
                    .createdAt(Instant.now())
                    .reportType(createReportDTO.getReportType())
                    .reportReason(createReportDTO.getReportReason())
                    .build();

            reportRepository.save(newReport);

            return new ResponseEntity<>("Report submitted successfully!", HttpStatus.OK);

        }catch (AdminServiceException e){
            throw new AdminServiceException("Something went wrong: " + e.getMessage());
        }

    }
}
