package com.vera.api.config;

import com.vera.api.domain.Caregiver;
import com.vera.api.domain.Patient;
import com.vera.api.domain.ServiceType;
import com.vera.api.domain.Visit;
import com.vera.api.domain.VisitStatus;
import com.vera.api.repository.CaregiverRepository;
import com.vera.api.repository.PatientRepository;
import com.vera.api.repository.VisitRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static com.vera.api.config.DemoClock.at;
import static com.vera.api.config.DemoClock.minutesAgo;
import static com.vera.api.config.DemoClock.minutesAhead;

/**
 * The demo fixtures, transcribed from src/data so the API answers with exactly
 * what the mock answered with. The ready-to-bill total is $171.50 and the
 * seeded ids are the ones the README test table and the demo script name, so
 * neither is free to change.
 *
 * A CommandLineRunner rather than data.sql, because the timestamps are offsets
 * from the day the application starts and static SQL cannot compute those. See
 * DemoClock.
 *
 * Insertion order IS the id order: the identity column hands out 1, 2, 3 as
 * rows arrive, and the frontend's deep links point at specific ids.
 */
@Component
public class SeedData implements CommandLineRunner {

    private final CaregiverRepository caregivers;
    private final PatientRepository patients;
    private final VisitRepository visits;

    private final List<Caregiver> caregiverById = new ArrayList<>();
    private final List<Patient> patientById = new ArrayList<>();

    public SeedData(CaregiverRepository caregivers, PatientRepository patients, VisitRepository visits) {
        this.caregivers = caregivers;
        this.patients = patients;
        this.visits = visits;
    }

    @Override
    public void run(String... args) {
        // H2 is in memory and starts empty, but the guard keeps this honest the
        // day the database is Postgres and the process restarts.
        if (visits.count() > 0) {
            return;
        }

        seedCaregivers();
        seedPatients();
        seedVisits();
    }

    /** Currency, never a double. The scale is part of the value. */
    private static BigDecimal money(String amount) {
        return new BigDecimal(amount);
    }

    private Caregiver caregiver(int id) {
        return caregiverById.get(id - 1);
    }

    private Patient patient(int id) {
        return patientById.get(id - 1);
    }

    private void seedCaregivers() {
        caregiverById.add(caregivers.save(new Caregiver("Marcus Reed", "215-555-0142")));
        caregiverById.add(caregivers.save(new Caregiver("Dana Alvarez", "215-555-0187")));
        caregiverById.add(caregivers.save(new Caregiver("Keisha Thompson", "215-555-0116")));
        caregiverById.add(caregivers.save(new Caregiver("Luis Rivera", "215-555-0163")));
        caregiverById.add(caregivers.save(new Caregiver("Angela Brooks", "215-555-0129")));
    }

    private void seedPatients() {
        patientById.add(patients.save(new Patient("Eleanor Whitfield", "215-555-0231",
                "1642 S Broad St, Philadelphia, PA 19145",
                "Unsteady on stairs after dark. Prefers help with bathing earlier in the day.")));

        patientById.add(patients.save(new Patient("Samuel Okafor", "215-555-0244",
                "5310 Chestnut St, Philadelphia, PA 19139",
                "Appetite is inconsistent; meals need encouragement. Reminders for evening medication.")));

        patientById.add(patients.save(new Patient("Rosa Delgado", "215-555-0198",
                "2708 N 5th St, Philadelphia, PA 19133",
                "Wants to keep walking daily while she can. Spanish is her first language.")));

        patientById.add(patients.save(new Patient("Harold Brennan", "215-555-0176",
                "812 Fitzwater St, Philadelphia, PA 19147",
                "Knee replacement recovery. Physical therapy set is the priority every visit.")));

        patientById.add(patients.save(new Patient("Miriam Katz", "215-555-0159",
                "7401 Old York Rd, Elkins Park, PA 19027",
                "Lives alone and values the company. Hard of hearing on the left side.")));

        patientById.add(patients.save(new Patient("George Antonelli", "215-555-0287",
                "1919 S 10th St, Philadelphia, PA 19148",
                "Low vision. Labels and paperwork need reading aloud.")));

        patientById.add(patients.save(new Patient("Pearl Jackson", "215-555-0134",
                "4522 Baltimore Ave, Philadelphia, PA 19143",
                "Daughter handles paperwork and often signs. Prefers a familiar caregiver.")));

        patientById.add(patients.save(new Patient("Dorothy Chen", "215-555-0265",
                "1030 Race St, Philadelphia, PA 19107",
                "Wound care on the left forearm per care plan. Dressing changed each visit.")));

        patientById.add(patients.save(new Patient("Walter Osei", "215-555-0212",
                "6218 Chew Ave, Philadelphia, PA 19138",
                "Diabetic. Watches blood sugar closely and wants meals kept on schedule.")));

        patientById.add(patients.save(new Patient("Agnes Romano", "215-555-0221",
                "2436 E Cumberland St, Philadelphia, PA 19125",
                "Medication cabinet is disorganised and labels are too small for her to read.")));
    }

    private void seedVisits() {
        visits.save(new Visit(patient(1), caregiver(1),
                at(-1, "14:00"), VisitStatus.NEEDS_REVIEW, ServiceType.PERSONAL_CARE, money("34.00"),
                at(-1, "14:02"), at(-1, "15:01"),
                "Patient alert and in good spirits. Assisted with bathing and lunch. Mild swelling in left ankle, family notified.",
                "Worried about managing the stairs alone at night; asked if evening visits could start earlier.",
                null, null, null));

        visits.save(new Visit(patient(2), caregiver(2),
                at(-1, "16:30"), VisitStatus.NEEDS_REVIEW, ServiceType.HOMEMAKER, money("51.00"),
                at(-1, "16:33"), null,
                "Medication reminder completed. Prepared dinner, patient ate half portion.",
                null,
                null, null, null));

        visits.save(new Visit(patient(3), caregiver(1),
                at(-1, "09:00"), VisitStatus.READY_TO_BILL, ServiceType.PERSONAL_CARE, money("52.50"),
                at(-1, "08:58"), at(-1, "10:30"),
                "Morning routine assistance. Vitals stable, patient walked to mailbox and back without difficulty.",
                "Freezer stopped working and she is worried about meals for the weekend.",
                "Rosa Delgado", null, null));

        visits.save(new Visit(patient(4), caregiver(3),
                at(-1, "11:30"), VisitStatus.READY_TO_BILL, ServiceType.PERSONAL_CARE, money("56.00"),
                at(-1, "11:29"), at(-1, "13:05"),
                "Physical therapy exercises completed, full set. Patient reports less knee pain than last week.",
                null,
                "Harold Brennan", null, null));

        visits.save(new Visit(patient(5), caregiver(2),
                minutesAgo(50), VisitStatus.IN_PROGRESS, ServiceType.RESPITE_CARE, money("42.00"),
                minutesAgo(45), null,
                null,
                null,
                null, null, null));

        visits.save(new Visit(patient(6), caregiver(3),
                minutesAgo(40), VisitStatus.SCHEDULED, ServiceType.HOMEMAKER, money("38.50"),
                null, null,
                null,
                null,
                null, null, null));

        visits.save(new Visit(patient(7), caregiver(1),
                at(-1, "08:00"), VisitStatus.BILLED, ServiceType.PERSONAL_CARE, money("45.50"),
                at(-1, "07:57"), at(-1, "09:15"),
                "Overnight recap reviewed. Breakfast and morning medications administered on schedule.",
                "Asked whether the same caregiver can come Fridays, prefers familiar faces.",
                "P. Jackson (daughter)", "clm_mock_7", at(-1, "17:42")));

        visits.save(new Visit(patient(8), caregiver(3),
                at(-1, "10:00"), VisitStatus.READY_TO_BILL, ServiceType.PERSONAL_CARE, money("63.00"),
                at(-1, "09:58"), at(-1, "11:45"),
                "Wound dressing changed per care plan. Range-of-motion exercises completed, patient tolerated well.",
                null,
                "Dorothy Chen", null, null));

        visits.save(new Visit(patient(9), caregiver(2),
                minutesAgo(195), VisitStatus.IN_PROGRESS, ServiceType.COMPANION_CARE, money("47.00"),
                minutesAgo(190), null,
                null,
                null,
                null, null, null));

        visits.save(new Visit(patient(10), caregiver(1),
                minutesAhead(120), VisitStatus.SCHEDULED, ServiceType.PERSONAL_CARE, money("40.00"),
                null, null,
                null,
                "Wants help reorganizing the medication cabinet; labels are too small to read.",
                null, null, null));

        visits.save(new Visit(patient(1), caregiver(1),
                at(-15, "14:00"), VisitStatus.BILLED, ServiceType.PERSONAL_CARE, money("34.00"),
                at(-15, "13:58"), at(-15, "15:04"),
                "Bathing and lunch as usual. Ankle swelling unchanged from last week.",
                null,
                "Eleanor Whitfield", "clm_mock_11", at(-15, "18:10")));

        visits.save(new Visit(patient(1), caregiver(3),
                at(-8, "14:00"), VisitStatus.BILLED, ServiceType.PERSONAL_CARE, money("34.00"),
                at(-8, "14:05"), at(-8, "15:07"),
                "Covered for Marcus. Patient needed extra time on the stairs; no falls.",
                "Asked whether her regular caregiver would be back next week.",
                "Eleanor Whitfield", "clm_mock_12", at(-8, "17:55")));

        visits.save(new Visit(patient(3), caregiver(1),
                at(-13, "09:00"), VisitStatus.BILLED, ServiceType.PERSONAL_CARE, money("52.50"),
                at(-13, "09:01"), at(-13, "10:33"),
                "Walked to the corner and back. Good spirits, no shortness of breath.",
                null,
                "Rosa Delgado", "clm_mock_13", at(-13, "16:20")));

        visits.save(new Visit(patient(4), caregiver(3),
                at(-9, "11:30"), VisitStatus.BILLED, ServiceType.PERSONAL_CARE, money("56.00"),
                at(-9, "11:31"), at(-9, "13:02"),
                "Full physical therapy set completed. Reports stiffness in the morning only.",
                null,
                "Harold Brennan", "clm_mock_14", at(-9, "17:40")));
    }
}
