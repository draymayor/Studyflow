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
| Hosting        | Vercel (deployment pending)          |

See `docs/ARCHITECTURE.md` for full system design. The database schema is described in `docs/DATABASE.md`.

---

## Project Structure

```
studyflow/
├── docs/                     # Planning, branding, architecture, data flow, measured results
├── src/                      # React application (pages, hooks, components, algorithm)
├── supabase/functions/       # Edge function that sends due reminders
│   └── send-due-reminders/
├── scripts/                  # Algorithm measurement script and results
├── public/                   # Static assets, including the push service worker (sw.js)
├── vercel.json               # Rewrites so client-side routes work after a refresh
├── .env.example              # Environment variable template
└── README.md                 # This file
```

---

## Local Setup

```bash
npm install
cp .env.example .env.local     # then fill in the three values below
npm run dev
```

`.env.local` needs three variables:

| Variable                | Value                                          |
|-------------------------|-------------------------------------------------|
| `VITE_SUPABASE_URL`      | Your Supabase project URL                       |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon (public) key                 |
| `VITE_VAPID_PUBLIC_KEY`  | The public half of your VAPID key pair (push)   |

The database schema is described in `docs/DATABASE.md`. Reminders are sent by the edge function in `supabase/functions/send-due-reminders`, which needs the secrets `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` and `VAPID_SUBJECT` and is called every minute by a Supabase cron job. Never commit the private key or the service role key.

---

## Status

The app is working: authentication, courses, availability, rule-based timetable generation, push reminders, PDF course materials, a dashboard and settings. Deployment is pending. See `docs/ROADMAP.md` for what's built vs. planned.

---

## Author

Ogunnubi Mayowa
Matric No: NOU223097475
Department of Computer Science, National Open University of Nigeria
