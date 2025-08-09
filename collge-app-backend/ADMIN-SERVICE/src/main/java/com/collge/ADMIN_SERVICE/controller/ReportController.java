package com.collge.ADMIN_SERVICE.controller;

import com.collge.ADMIN_SERVICE.dto.CreateReportDTO;
import com.collge.ADMIN_SERVICE.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/admin/report")
@RestController
@CrossOrigin("*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody CreateReportDTO createReportDTO){
        return reportService.createReport(createReportDTO);
    }

}
