package com.vera.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * A caregiver. Only what the visit slice needs: onboarding documents arrive
 * with their own endpoint later.
 *
 * Phone is a String because it is an identifier, not a quantity. Nothing ever
 * does arithmetic on it and leading zeros matter.
 */
@Entity
@Table(name = "caregivers")
public class Caregiver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String phone;

    protected Caregiver() {
    }

    public Caregiver(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }
}
