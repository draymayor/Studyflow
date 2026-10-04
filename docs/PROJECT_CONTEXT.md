# StudyFlow — Academic Project Context

This file exists so the codebase stays anchored to the approved project report. If code and report ever disagree, the report (as submitted/approved by the supervisor) wins, update this file and the code to match, not the other way round.

## Project Title

Smart Study Timetable Generator with Reminder System

## Institution

National Open University of Nigeria (NOUN), Department of Computer Science, B.Sc. Computer Science final year project.

## The Three Objectives (approved, supervisor-signed-off)

1. **Design** a web-based Smart Study Timetable Generator with Reminder System (StudyFlow) that helps open and distance learning students automatically organise their study time.
2. **Implement** StudyFlow so that open and distance learning students can generate a personalised weekly study timetable and receive automatic study reminders, without a fixed lecture schedule to guide them.
3. **Evaluate** StudyFlow with open and distance learning students to determine its usability and effectiveness in improving study time management.

Every feature built should trace back to one of these three objectives. If a feature doesn't serve design, implementation, or evaluation of the above, it's scope creep, cut it or defer it.

## The Knowledge Gap (from Chapter 2)

No existing system simultaneously:
1. Accepts a student's course list and available weekly study hours as input;
2. Automatically distributes study time across courses using a credit-hour-weighted algorithm;
3. Enables optional PDF course material upload;
4. Delivers course-specific reminders tied to the generated timetable, with zero manual reminder configuration;
5. Runs as a lightweight, mobile-accessible, browser-based app suited to low-bandwidth Nigerian connections.

StudyFlow's build must satisfy all five, this is the differentiator from prior work reviewed in Chapter 2 (Chukwuemeka et al. 2022; Ekanem & Ekpenyong 2021; Waziri & Suleiman 2023; Opara & Nweke 2022, among others).

## Evaluation Plan (Chapter 3, Section 3.11 — for later)

- Framework: Technology Acceptance Model (TAM) — Perceived Usefulness, Perceived Ease of Use
- Minimum 20 ODL student participants
- Structured questionnaire, 3 sections: Usability / Timetable Accuracy / Reminder Effectiveness
- 5-point Likert scale
- Analysis: mean scores + percentage agreement

Keep this in mind while building, the app needs to be usable enough by a first-time student (no assistance) that the usability evaluation is meaningful, and accurate enough in scheduling that "accuracy" has something real to report on in Chapter 4.

## Non-negotiable constraints from the approved chapters

- Rule-based scheduling only. **No AI/ML claims anywhere** (title, docs, code comments, or report). This was a deliberate decision to avoid extra backend/server complexity, see Chapter 1, Scope.
- Reminders are **browser push notifications only** (no email/SMS).
- Mobile-first, low-bandwidth design is a hard requirement, not a nice-to-have (Chapter 1 & 2 cite Nigerian connectivity constraints repeatedly).
