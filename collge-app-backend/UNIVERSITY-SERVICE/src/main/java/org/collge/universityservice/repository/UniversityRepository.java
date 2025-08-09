package org.collge.universityservice.repository;

import org.collge.universityservice.model.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Optional;

@Repository
public interface UniversityRepository extends JpaRepository<University, Integer> {

    Optional<University> findByUniName(String uniName);

    @Query(
            value = "SELECT e.uni_emails FROM university.university u INNER JOIN university.university_uni_emails e ON u.university_id = e.university_university_id WHERE u.university_name = ?1",
            nativeQuery = true
    )
    ArrayList<String> findAllUniEmailsByUniName(String UniName);

}
