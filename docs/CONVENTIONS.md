# StudyFlow — Code Conventions

Keep this consistent across every file generated, whether by hand or by an AI coding tool. If a generated file breaks one of these, fix it before merging.

## 1. Folder Structure (inside `src/`)

```
src/
├── main.jsx
├── App.jsx
├── lib/
│   └── supabase.js              # Supabase client init, exported once
├── context/
│   └── AuthContext.jsx          # Auth state provider
├── hooks/
│   ├── useCourses.js
│   ├── useAvailability.js
│   ├── useTimetable.js
│   └── useNotifications.js
├── lib/algorithm/
│   └── generateTimetable.js     # Pure function, no React, no Supabase calls inside
├── components/
│   ├── ui/                       # Generic reusable pieces (Button, Card, Input, Badge)
│   ├── layout/                   # Sidebar, MobileNav, PageHeader
│   └── domain/                    # CourseCard, AvailabilitySlot, TimetableGrid, ReminderToast
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Courses.jsx
│   ├── Availability.jsx
│   ├── Timetable.jsx
│   ├── Materials.jsx
│   └── Settings.jsx
└── routes.jsx
```

## 2. Naming

| Thing                | Convention              | Example                    |
|------------------------|--------------------------|------------------------------|
| Component files         | PascalCase               | `CourseCard.jsx`             |
| Hook files               | camelCase, `use` prefix  | `useCourses.js`               |
| Utility/algorithm files  | camelCase                | `generateTimetable.js`        |
| Supabase table names      | snake_case               | `timetable_entries`            |
| Supabase column names      | snake_case               | `credit_hours`                  |
| React component names        | PascalCase               | `function CourseCard() {}`       |
| Hook function names            | camelCase, `use` prefix  | `function useCourses() {}`        |
| CSS/Tailwind custom tokens        | kebab-case, `sf-` prefix | `--sf-primary` (see BRAND.md)      |

## 3. Component Rules

- **One component per file.** No multi-export component files.
- **Functional components only.** No class components.
- **Props destructured in the function signature**, not accessed via `props.x`.
- **No inline Supabase calls inside JSX-heavy components.** Data fetching goes through a hook (`useCourses()`, etc.); the component just consumes the hook's return value.
- **Tailwind only for styling.** No separate `.css` files per component. Global tokens live in `tailwind.config.js`, mapped from `docs/BRAND.md`.

## 4. Data Fetching Pattern

Every domain hook follows the same shape:

```js
// src/hooks/useCourses.js
export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch on mount, expose refetch + mutation helpers
  // returns: { courses, loading, error, addCourse, updateCourse, deleteCourse, refetch }
}
```

Pages call the hook, never call `supabase.from(...)` directly inside a page or component.

## 5. Error Handling

- Every Supabase call is wrapped in try/catch.
- User-facing errors use the `--sf-danger` / `--sf-danger-bg` tokens from BRAND.md, shown as an inline banner, not a raw `alert()`.
- Console errors are fine during development but must not leak Supabase error internals to the UI (show a friendly message, log the real error).

## 6. Commit Messages

Simple conventional-commit style, since this is a solo academic project, keep it lightweight:

```
feat: add course input form
fix: correct credit-hour weighting in scheduler
docs: update ARCHITECTURE.md with reminder flow
chore: add .env.example
```

## 7. Branching (if using git)

- `main` — always deployable / demo-ready
- `dev` — active work
- Feature branches optional for a solo project; direct commits to `dev` then merge to `main` when a phase in `ROADMAP.md` is complete.
