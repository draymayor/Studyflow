# StudyFlow — Testing Plan

Two different kinds of "testing" happen in this project, keep them separate:

1. **Engineering correctness testing** (this doc, done during build, feeds Chapter 4's "accuracy" numbers)
2. **User evaluation** (Chapter 3, Section 3.11 — TAM questionnaire with 20+ ODL students, a separate exercise)

This doc covers #1: how we know the scheduling algorithm and reminder system actually work correctly, and how we turn that into real numbers for Chapter 4.

---

## 1. Scheduling Algorithm — Correctness Criteria

Before writing a single line of UI, `generateTimetable()` (see `DATA_FLOW.md`) must pass these test cases. Write them as actual unit tests once the function exists.

### Test Case 1 — Basic proportional distribution
**Input:** 3 courses, credit hours 3/2/3 (total 8), 10 available hours/week
**Expected:** Course A ≈ 3.75 study hrs, Course B ≈ 2.5 hrs, Course C ≈ 3.75 hrs (matches Chapter 3 worked example exactly)
**Pass condition:** Computed hours match expected within rounding tolerance (±1 session)

### Test Case 2 — No availability slots
**Input:** Courses present, zero availability slots
**Expected:** Function returns empty array or throws a clear validation error (not a silent crash)

### Test Case 3 — No courses
**Input:** Availability slots present, zero courses
**Expected:** Same as above — clear validation error, not a silent failure

### Test Case 4 — Single course
**Input:** 1 course, any credit hours, some availability
**Expected:** All available time allocated to that one course, no leftover unscheduled time within a slot

### Test Case 5 — Availability smaller than one session
**Input:** A slot shorter than `sessionDurationMinutes`
**Expected:** That slot is skipped, not partially filled or causing a negative-duration session

### Test Case 6 — Conflict-free output
**For every generated entry set:** No two entries for the same user share overlapping `dayOfWeek` + time range.
**Pass condition:** 0 overlaps across 100% of generated timetables tested.

### Test Case 7 — Every course gets at least one session (where mathematically possible)
**Given** enough total availability relative to number of courses, no course should be scheduled zero sessions unless its computed weight rounds to less than one session.

---

## 2. How This Becomes Chapter 4 "Accuracy" Numbers

Once the above test cases pass, generate a batch of **synthetic test scenarios** (varying number of courses, credit hour spreads, availability patterns) and report:

- **Scheduling accuracy:** % of generated timetables with zero time-slot conflicts (target: 100%)
- **Allocation accuracy:** average deviation between a course's *intended* proportional study time and its *actual* scheduled time (report as a percentage, e.g. "average deviation of 4.2% due to session-duration rounding")
- **Generation speed:** average time (ms) from clicking "Generate Timetable" to seeing the result, across N runs
- **Coverage:** % of available time slots that get filled with a session (vs. left empty because no course needed more time)

Run this against, say, 20–30 synthetic scenarios (not real users, just varied input combinations) and report the aggregate numbers. This gives Chapter 4 real, defensible "Results" content.

---

## 3. Reminder System — Correctness Criteria

- **Timing accuracy:** reminder fires within an acceptable window (e.g. ±1 minute) of the scheduled session start time
- **No duplicate sends:** `notifications.is_sent` correctly prevents a reminder firing twice for the same entry
- **No missed sends:** every `timetable_entries` row has a corresponding `notifications` row after generation

Test manually by generating a timetable with a session scheduled a few minutes in the future and confirming the browser notification appears on time.

---

## 4. Comparison to Existing Systems (for Chapter 4, Section on comparing to prior work)

Your supervisor specifically asked for this. Structure it as a table comparing StudyFlow's measured results against what's reported (not assumed) in the literature reviewed in Chapter 2:

| System                          | Reported Result                                              | StudyFlow Comparison                                    |
|----------------------------------|-----------------------------------------------------------------|-------------------------------------------------------------|
| Chukwuemeka et al. (2022)          | No automated time distribution; equal time per course regardless of credit hours | StudyFlow allocates proportionally by credit hours (report your measured allocation accuracy here) |
| Yilmaz & Soyer (2022)               | Automated scheduling tools → 18% increase in weekly study hours (manual course entry) | StudyFlow additionally automates the schedule *generation* itself, not just tracking |
| Ekanem & Ekpenyong (2021)            | Reminder system required full manual configuration               | StudyFlow requires zero manual reminder setup (report your generation-to-reminder pipeline as evidence) |
| Waziri & Suleiman (2023)              | Manual study session entry, no automated timetable                 | StudyFlow generates 100% of sessions automatically (report your conflict-free % here) |

**Important:** only fill in the "StudyFlow Comparison" column with numbers you actually measured from Section 2 above. Do not invent comparison numbers, if you don't have a measured result for a row, say so explicitly in Chapter 4 rather than guessing.

---

## Sync Rule

Update this file's Section 4 table once real Section 2 numbers exist. Chapter 4 of the report should be a narrated version of what ends up in this file.
