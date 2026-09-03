package com.vera.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * A patient.
 *
 * standingConcerns is what this patient needs help with in general, true across
 * every visit, which is why it lives here and not on a visit. What they raised
 * during one visit is that visit's patientConcern. Same words, different
 * lifetimes, so different tables.
 */
@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String phone;

    private String address;

    @Column(length = 2000)
    private String standingConcerns;

    protected Patient() {
    }

    public Patient(String name, String phone, String address, String standingConcerns) {
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.standingConcerns = standingConcerns;
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

    public String getAddress() {
        return address;
    }

    public String getStandingConcerns() {
        return standingConcerns;
    }
}
