package com.vera.api.repository;

import com.vera.api.domain.Caregiver;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaregiverRepository extends JpaRepository<Caregiver, Long> {
}
