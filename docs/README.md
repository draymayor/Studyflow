# StudyFlow

**Smart Study Timetable Generator with Reminder System**

StudyFlow is a web-based application that helps university students, particularly open and distance learning (ODL) students at the National Open University of Nigeria (NOUN), automatically organise their study time. Students enter their enrolled courses and available study hours; StudyFlow's scheduling algorithm distributes study time proportionally across courses by credit-hour weight, generates a personalised weekly timetable, and delivers browser-based reminders for each scheduled study session.

This project is a final-year B.Sc. Computer Science project (NOUN, Department of Computer Science).

---

## Why StudyFlow

Distance learners have no fixed lecture timetable to structure their week. Research reviewed in this project (see `docs/PROJECT_CONTEXT.md`) shows that:

- Poor time management is the single strongest predictor of academic failure among NOUN distance learners.
- Fewer than 10% of Nigerian university students use any dedicated study planner app.
- Existing scheduling tools either serve institutions (not individual students) or require full manual configuration of every study session and reminder.

StudyFlow is the first system to combine automated, credit-hour-weighted study time allocation with integrated, zero-configuration reminders, in one lightweight, mobile-accessible web app.

---

## Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Frontend       | React 19 + Vite                      |
| Styling        | Tailwind CSS                         |
| Backend        | Supabase (PostgreSQL, Auth, Storage) |
| Notifications  | Web Push API + Service Worker        |
| Hosting        | Vercel                               |

See `docs/ARCHITECTURE.md` for full system design and `docs/DATABASE.md` for the schema.

---

## Project Structure

```
studyflow/
├── docs/                     # Planning, branding, architecture docs
│   ├── BRAND.md              # Colours, typography, tone, UI principles
│   ├── ARCHITECTURE.md       # System modules, high-level data flow
│   ├── DATABASE.md           # Supabase schema reference
│   ├── PROJECT_CONTEXT.md    # Academic project context (gaps, objectives)
│   ├── CONVENTIONS.md        # Folder structure, naming, coding rules
│   ├── DATA_FLOW.md          # Function-level spec per module
│   ├── TESTING.md            # Correctness criteria + Chapter 4 results plan
│   └── ROADMAP.md            # Build phases / progress tracker
├── src/                      # React application source (added when code build starts)
├── supabase/                 # SQL migrations (added when Supabase is set up)
├── public/                   # Static assets
├── .env.example               # Environment variable template
└── README.md                  # This file
```

---

## Getting Started (once code build begins)

```bash
npm install
cp .env.example .env.local     # then fill in your Supabase project URL and anon key
npm run dev
```

---

## Status

Currently in the **design and documentation phase**. Supabase project has not yet been created. See `docs/ROADMAP.md` for what's built vs. planned.

---

## Author

Ogunnubi Mayowa
Matric No: NOU223097475
Department of Computer Science, National Open University of Nigeria
