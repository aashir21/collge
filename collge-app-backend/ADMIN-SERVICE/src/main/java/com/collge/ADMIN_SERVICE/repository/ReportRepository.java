package com.collge.ADMIN_SERVICE.repository;

import com.collge.ADMIN_SERVICE.model.Report;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReportRepository extends MongoRepository<Report, String> {
}
