# StudyFlow — Architecture

This document mirrors the system design specified in Chapter Three of the project report. Keep this file and the report in sync, if a module changes here, update Chapter 3 too, and vice versa.

## 1. High-Level Architecture

StudyFlow is a **client-heavy single-page application**. There is no custom backend server; all persistence, auth, and file storage go through Supabase directly from the React frontend. The scheduling algorithm runs entirely client-side in the browser.

```
┌─────────────────────────────┐
│         React (Vite)         │
│  ┌─────────────────────────┐ │
│  │  Auth Module             │ │──┐
│  │  Course Input Module     │ │  │
│  │  Availability Module     │ │  │      ┌──────────────┐
│  │  Scheduling Algorithm    │ │──┼─────▶│   Supabase    │
│  │  Timetable Display       │ │  │      │ (Auth + DB +  │
│  │  Reminder Module         │ │  │      │   Storage)    │
│  │  PDF Upload Module       │ │──┘      └──────────────┘
│  └─────────────────────────┘ │
└─────────────────────────────┘
        │
        ▼
 Service Worker (Web Push API)
```

## 2. Modules

| # | Module                     | Responsibility                                                                 |
|---|------------------------------|---------------------------------------------------------------------------------|
| 1 | Authentication Module         | Registration, login, session management via Supabase Auth                     |
| 2 | Course Input Module            | Add/edit/delete enrolled courses and credit hours                             |
| 3 | Availability Input Module      | Set weekly available study time slots                                          |
| 4 | Scheduling Algorithm Module    | Credit-hour-weighted proportional distribution of study time (see below)      |
| 5 | Timetable Display Module        | Weekly calendar grid view, mark session complete, download                    |
| 6 | Reminder Notification Module    | Web Push + Service Worker, dispatches reminders at scheduled session times     |
| 7 | PDF Upload Module               | Upload/attach course materials via Supabase Storage                            |

## 3. Scheduling Algorithm (summary)

For full pseudocode see the project report, Section 3.6.6.

1. Fetch student's courses (with credit hours) and availability slots.
2. Compute each course's weight = `credit_hours / total_credit_hours`.
3. Compute each course's weekly study hours = `weight × total_available_hours`.
4. Compute session count per course = `round(study_hours / session_duration)`.
5. Distribute sessions round-robin across available slots, ordered by descending session count.
6. Save generated entries to `timetable_entries`; schedule notifications for each.

Default session duration: **1.5 hours** (configurable by the student).

## 4. Screens (MVP scope)

| Screen              | Route              | Notes                                                      |
|---------------------|---------------------|--------------------------------------------------------------|
| Login                | `/login`            | Email + password                                             |
| Register             | `/register`         | Name, email, matric no (optional), password                  |
| Dashboard             | `/`                  | Today's sessions, upcoming reminder, weekly summary          |
| My Courses            | `/courses`           | Add/edit/delete courses                                       |
| Availability           | `/availability`       | Set weekly time slots                                          |
| My Timetable           | `/timetable`          | Generated weekly grid, mark complete                            |
| Course Materials       | `/materials`           | Upload/view PDFs per course                                     |
| Profile / Settings      | `/settings`             | Name, password, notification preferences                        |

## 5. Non-Goals (explicitly out of scope for MVP)

- No native mobile app.
- No AI/ML-based scheduling, rule-based only (see project report Section 1.6, Scope).
- No group/collaborative scheduling.
- No integration with NOUN's official student portal (manual course entry only).
