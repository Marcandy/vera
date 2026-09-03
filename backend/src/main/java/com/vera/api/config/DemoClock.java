package com.vera.api.config;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;

/**
 * The Java half of src/data/demoDay.js, and the reason the seed is a
 * CommandLineRunner rather than a data.sql: static SQL cannot compute an offset
 * from today, and a demo with fixed calendar dates is honest only the week it
 * is written. This one reached two months old once and every scheduled visit
 * read as a late check-in.
 *
 * Resolved once at class load, so one run of the application sees one clock.
 * To freeze the demo, replace DEMO_NOW with a literal instant and every offset
 * moves with it.
 */
public final class DemoClock {

    private static final Instant DEMO_NOW = Instant.now();

    /**
     * The agency's local zone, which is what a wall clock time means. Offsets in
     * whole days hang off the local date so "two days ago at 14:00" really reads
     * 2:00 PM rather than drifting with the hour the process started.
     */
    private static final ZoneId ZONE = ZoneId.systemDefault();
    private static final LocalDate DEMO_DAY = LocalDate.ofInstant(DEMO_NOW, ZONE);

    private static final long FIVE_MINUTES_MS = 5 * 60 * 1000L;

    private DemoClock() {
    }

    /** A wall clock time on a day relative to the demo day. Negative is the past. */
    public static Instant at(int dayOffset, String clockTime) {
        return DEMO_DAY.plusDays(dayOffset)
                .atTime(LocalTime.parse(clockTime))
                .atZone(ZONE)
                .toInstant();
    }

    /**
     * Visits happening right now cannot use a wall clock time: a check-in seeded
     * at 08:00 has not happened yet if the demo starts at 7am and is ten hours
     * overdue if it starts at 6pm. The attention thresholds are measured in
     * minutes from an event, so the seeds that must sit on a known side of one
     * are measured the same way.
     *
     * Rounded to a five minute boundary, always away from now, so these still
     * read like appointments and a seed placed past a threshold cannot round
     * back under it.
     */
    public static Instant minutesAgo(long minutes) {
        long target = DEMO_NOW.toEpochMilli() - minutes * 60_000L;
        return Instant.ofEpochMilli(Math.floorDiv(target, FIVE_MINUTES_MS) * FIVE_MINUTES_MS);
    }

    public static Instant minutesAhead(long minutes) {
        long target = DEMO_NOW.toEpochMilli() + minutes * 60_000L;
        return Instant.ofEpochMilli(Math.ceilDiv(target, FIVE_MINUTES_MS) * FIVE_MINUTES_MS);
    }
}
