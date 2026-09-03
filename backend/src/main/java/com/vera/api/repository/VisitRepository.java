package com.vera.api.repository;

import com.vera.api.domain.Visit;
import com.vera.api.domain.VisitStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * The repository behind GET /api/visits.
 *
 * ONE query with optional predicates, which is what the mock's getVisits({...})
 * already was. Each parameter is skipped when null, so an absent filter means
 * no restriction, exactly as it does in JavaScript.
 *
 * JOIN FETCH is the reason both relations can be LAZY on the entity. Without
 * it, rendering a list of fourteen visits would issue one query for the visits
 * and then two more per row to fetch the names: the N+1 problem, invisible in
 * development against fourteen rows and fatal against fourteen thousand.
 */
public interface VisitRepository extends JpaRepository<Visit, Long> {

    @Query("""
            SELECT v FROM Visit v
            JOIN FETCH v.patient p
            JOIN FETCH v.caregiver c
            WHERE (:status IS NULL OR v.status = :status)
              AND (:caregiverId IS NULL OR c.id = :caregiverId)
              AND (:patientId IS NULL OR p.id = :patientId)
              AND (:namePattern IS NULL
                   OR LOWER(p.name) LIKE :namePattern
                   OR LOWER(c.name) LIKE :namePattern)
            """)
    List<Visit> search(@Param("status") VisitStatus status,
                       @Param("namePattern") String namePattern,
                       @Param("caregiverId") Long caregiverId,
                       @Param("patientId") Long patientId);

    /**
     * One grouped query rather than one query per status, and certainly not
     * fetching every row to count them in Java. This is the whole reason the
     * counts are their own endpoint: they describe the collection, so they must
     * not be derived from a page of it.
     */
    @Query("SELECT v.status, COUNT(v) FROM Visit v GROUP BY v.status")
    List<Object[]> countByStatus();

    /**
     * Fetches the relations too, so the DTO can be built after the transaction
     * closes without tripping a lazy initialization exception.
     */
    @Query("""
            SELECT v FROM Visit v
            JOIN FETCH v.patient
            JOIN FETCH v.caregiver
            WHERE v.id = :id
            """)
    Optional<Visit> findByIdWithRelations(@Param("id") Long id);
}
