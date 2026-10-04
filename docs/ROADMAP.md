# StudyFlow — Roadmap

Tracks build progress. Update the checkboxes as work lands, this becomes source material for Chapter 4 screenshots and results.

## Phase 0 — Foundation
- [x] Repo structure created
- [x] Brand guide (`docs/BRAND.md`)
- [x] Architecture doc (`docs/ARCHITECTURE.md`)
- [x] Database schema doc (`docs/DATABASE.md`)
- [x] Project context doc (`docs/PROJECT_CONTEXT.md`)
- [x] Supabase project created
- [x] `.env.example` finalised with real key names

## Phase 1 — Scaffold
- [x] Vite + React app scaffolded
- [x] Tailwind configured with `docs/BRAND.md` tokens
- [x] React Router set up with the 8 MVP routes
- [x] Supabase client wired (`src/lib/supabase.js`)

## Phase 2 — Auth Module
- [x] Register screen
- [x] Login screen
- [x] Session persistence / protected routes
- [x] `users` table + trigger on signup

## Phase 3 — Core Data Entry
- [x] Course input screen (add/edit/delete)
- [x] Availability input screen
- [x] `courses` + `availability` tables + RLS

## Phase 4 — Scheduling Engine
- [x] `generateTimetable()` algorithm implemented
- [x] `timetable_entries` table + RLS
- [x] Timetable display screen (weekly grid)
- [x] Mark session complete

## Phase 5 — Reminders
- [x] Service worker registered
- [x] Web Push permission flow
- [x] `notifications` table + scheduling logic
- [ ] Reminder fires correctly at scheduled time (manual test)

## Phase 6 — PDF Materials
- [x] Supabase Storage bucket + policy
- [x] Upload UI on course detail
- [x] Material accessible from timetable session

## Phase 7 — Polish for Screenshots (Chapter 4 material)
- [ ] Dashboard screen populated with realistic demo data  *(the dashboard now reads live data)*
- [x] Empty states designed (no courses yet, no timetable yet)
- [ ] Mobile responsive check (375px width)
- [ ] Screenshot set captured: Login, Register, Dashboard, Add Course, Availability, Generated Timetable, Reminder notification, PDF upload

## Phase 8 — Evaluation Prep
- [ ] Deployed to Vercel (public URL for testers)
- [ ] Questionnaire drafted (Section 3.11.3 instrument)
- [ ] 20 ODL student testers recruited
- [ ] Results collected → feeds Chapter 4

---

## Notes / Decisions Log

*(Add a dated line here whenever a decision changes something documented elsewhere, so the docs and code never silently drift apart.)*

- **2026 (project start):** Confirmed no AI/ML component, rule-based algorithm only, to avoid backend complexity and stay within Chapter 1 scope.
- **2026:** Light mode only, indigo/blue on white, per brand guide.
