# StudyFlow — Measured Algorithm Results

- Date: 2026-10-04
- Random seed (Part C): 20261004 (mulberry32)
- Node: v24.13.0
- Session length: 90 minutes. Function under test: `src/lib/algorithm/generateTimetable.js` (imported directly, unmodified).
- Measurement only. No algorithm or app code was changed or tuned for these numbers.

## Part A — Ten named scenarios

| # | Courses | Credits | Avail. h | Sessions generated | Max physical capacity | Overlapping pairs | Sessions per course (actual) | Ideal sessions per course (unrounded) |
|---|---|---|---|---|---|---|---|---|
| 1 | 3 | 8 | 10 | 4 | 4 | 0 | 2, 1, 1 | 2.50, 2.50, 1.67 |
| 2 | 4 | 12 | 14 | 8 | 8 | 0 | 2, 2, 2, 2 | 2.33, 2.33, 2.33, 2.33 |
| 3 | 5 | 15 | 13 | 6 | 6 | 0 | 2, 1, 1, 1, 1 | 1.73, 1.73, 1.73, 1.73, 1.73 |
| 4 | 2 | 5 | 6 | 4 | 4 | 0 | 2, 2 | 2.40, 1.60 |
| 5 | 6 | 18 | 20 | 12 | 12 | 0 | 2, 2, 2, 2, 2, 2 | 2.22, 2.22, 2.22, 2.22, 2.22, 2.22 |
| 6 | 1 | 3 | 4.5 | 2 | 2 | 0 | 2 | 3.00 |
| 7 | 5 | 14 | 9 | 5 | 6 | 0 | 1, 1, 1, 1, 1 | 1.29, 1.29, 1.29, 1.29, 0.86 |
| 8 | 4 | 10 | 16 | 8 | 8 | 0 | 2, 2, 2, 2 | 3.20, 3.20, 2.13, 2.13 |
| 9 | 3 | 9 | 7.5 | 3 | 3 | 0 | 1, 1, 1 | 1.67, 1.67, 1.67 |
| 10 | 7 | 21 | 22 | 12 | 12 | 0 | 2, 2, 2, 2, 2, 1, 1 | 2.10, 2.10, 2.10, 2.10, 2.10, 2.10, 2.10 |

Ideal = (course credits / total credits) × available minutes ÷ 90, not rounded.

### Appendix — exact inputs used in Part A

| # | Courses (credit hours) | Slots |
|---|---|---|
| 1 | C1=3, C2=3, C3=2 | Mon 18:00–20:30, Tue 18:00–20:30, Wed 18:00–20:30, Thu 18:00–20:30 (10 h) |
| 2 | C1=3, C2=3, C3=3, C4=3 | Mon 18:00–21:00, Tue 18:00–21:00, Wed 18:00–21:00, Thu 18:00–20:30, Fri 18:00–20:30 (14 h) |
| 3 | C1=3, C2=3, C3=3, C4=3, C5=3 | Mon 18:00–21:00, Tue 18:00–20:30, Wed 18:00–20:30, Thu 18:00–20:30, Fri 18:00–20:30 (13 h) |
| 4 | C1=3, C2=2 | Mon 18:00–21:00, Tue 18:00–21:00 (6 h) |
| 5 | C1=3, C2=3, C3=3, C4=3, C5=3, C6=3 | Mon 18:00–21:30, Tue 18:00–21:30, Wed 18:00–21:30, Thu 18:00–21:30, Fri 18:00–21:00, Sat 10:00–13:00 (20 h) |
| 6 | C1=3 | Mon 18:00–20:30, Tue 18:00–20:00 (4.5 h) |
| 7 | C1=3, C2=3, C3=3, C4=3, C5=2 | Mon 18:00–21:00, Tue 18:00–21:00, Wed 18:00–21:00 (9 h) |
| 8 | C1=3, C2=3, C3=2, C4=2 | Mon 18:00–21:00, Tue 18:00–21:00, Wed 18:00–20:30, Thu 18:00–20:30, Fri 18:00–20:30, Sat 10:00–12:30 (16 h) |
| 9 | C1=3, C2=3, C3=3 | Mon 18:00–20:30, Tue 18:00–20:30, Wed 18:00–20:30 (7.5 h) |
| 10 | C1=3, C2=3, C3=3, C4=3, C5=3, C6=3, C7=3 | Mon 18:00–22:00, Tue 18:00–22:00, Wed 18:00–21:30, Thu 18:00–21:30, Fri 18:00–21:30, Sat 10:00–13:30 (22 h) |

## Part B — Worked example (credits 3, 2, 3)

| Available h | Slots | Sessions per course (A=3, B=2, C=3) | Total sessions | Capacity | Overlaps |
|---|---|---|---|---|---|
| 10 | Mon 18:00–20:30, Tue 18:00–20:30, Wed 18:00–20:30, Thu 18:00–20:30 | 2 : 1 : 1 | 4 | 4 | 0 |
| 12 | Mon 18:00–21:00, Tue 18:00–21:00, Wed 18:00–21:00, Thu 18:00–21:00 | 3 : 2 : 3 | 8 | 8 | 0 |

## Part C — 200 seeded random scenarios

Scenarios: 1–7 courses, credits 1–6, 1–7 slots of 1–4 h (30-minute steps), random days, random start times; overlapping slots are possible.

| Metric | Result |
|---|---|
| Conflict-free rate | 200/200 = 100.0% |
| Partial-session violations (sessions running past their slot) | 0 |
| Scenarios producing zero sessions (excluded from deviation) | 13 |
| Allocation deviation (pp), mean over 187 scenarios with sessions | 7.17 |
| Allocation deviation (pp), worst case | 50.00 |
| Slot coverage, mean (all 200) | 72.3% |
| Slot coverage, min | 0.0% |
| Slot coverage, max | 100.0% |
| Test Case 7 — scenarios with capacity ≥ number of courses | 128 |
| Test Case 7 — of those, a course got zero sessions | 9 |
| Test Case 7 — of those, a zero-session course whose planned count was ≥ 1 (not explained by rounding to 0) | 0 |

Allocation deviation = mean over courses of |actual share of scheduled sessions − credit weight|, in percentage points. Coverage = scheduled minutes ÷ available minutes after merging overlapping slots.

## Part D1 — generateTimetable() alone, Node, 1000 runs each

| Scenario | Mean (ms) | Max (ms) |
|---|---|---|
| Smallest (1 course, 3 credits, 4.5 h) | 0.0037 | 0.3550 |
| Largest (7 courses, 21 credits, 22 h) | 0.0127 | 0.2314 |

Pure function only: no network, no React, no Supabase. No warm-up runs were discarded.

## Part D2 — Full Generate click to timetable displayed, in the running app

Measured in the running dev app (Vite dev server, Browser pane) as a test account (2 courses, 2 availability slots, 4 sessions generated), from the Regenerate click until the "Timetable generated" toast was rendered, which happens after saveTimetable (read existing ids, insert, delete) and the refetch of entries and courses. Network: Supabase eu-central-1 from this machine. Five consecutive runs, each replacing the previous timetable. Wall-clock performance.now() measured in the page; not a production build.

| Run | Milliseconds |
|---|---|
| 1 | 994 |
| 2 | 988 |
| 3 | 933 |
| 4 | 862 |
| 5 | 973 |
| Mean | 950 |

**D1 and D2 are different measurements.** D1 times only the pure scheduling function. D2 includes the Supabase delete and insert round trips over the network, the refetch, and the re-render.
