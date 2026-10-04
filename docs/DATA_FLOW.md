# StudyFlow — Data Flow & Function Spec

This is the granular reference `ARCHITECTURE.md` doesn't cover: exact function names, inputs, outputs, and which table each touches. Write code to match this, or update this file the moment a signature changes.

## 1. Auth Module

### `signUp({ email, password, fullName, matricNo })`
- Calls `supabase.auth.signUp()`
- On success, a Postgres trigger inserts a row into `users` (id, email, full_name, matric_no)
- Returns: `{ user, session }` or throws

### `signIn({ email, password })`
- Calls `supabase.auth.signInWithPassword()`
- Returns: `{ user, session }` or throws

### `signOut()`
- Calls `supabase.auth.signOut()`

### `useAuth()` (context hook)
- Returns: `{ user, session, loading, signUp, signIn, signOut }`
- Wraps the whole app in `<AuthContext.Provider>`; protected routes check `user` before rendering

---

## 2. Course Module

### `useCourses()`
- On mount: `supabase.from('courses').select('*').order('created_at')`
- Returns: `{ courses, loading, error, addCourse, updateCourse, deleteCourse, refetch }`

### `addCourse({ courseName, courseCode, creditHours })`
- Inserts into `courses` with `user_id = auth.uid()`
- Validates: `creditHours` is an integer between 1 and 6

### `updateCourse(courseId, updates)`
- Updates matching row in `courses`

### `deleteCourse(courseId)`
- Deletes matching row; cascades should NOT auto-delete existing `timetable_entries` (handle gracefully, prompt user to regenerate)

---

## 3. Availability Module

### `useAvailability()`
- On mount: `supabase.from('availability').select('*').order('day_of_week')`
- Returns: `{ slots, loading, error, addSlot, deleteSlot, refetch }`

### `addSlot({ dayOfWeek, startTime, endTime })`
- Validates: `endTime > startTime`
- Inserts into `availability` with `user_id = auth.uid()`

### `deleteSlot(slotId)`

---

## 4. Scheduling Algorithm (pure function, no side effects)

### `generateTimetable({ courses, availabilitySlots, sessionDurationMinutes = 90 })`

**Input:**
```js
courses: [{ id, courseName, creditHours }, ...]
availabilitySlots: [{ dayOfWeek, startTime, endTime }, ...]
sessionDurationMinutes: number
```

**Output:**
```js
[
  { courseId, dayOfWeek, startTime, endTime },
  ...
]
```

**Steps** (matches Chapter 3, Section 3.6.6 exactly, keep in sync):
1. `totalCredits = sum(course.creditHours)`
2. `totalAvailableMinutes = sum((slot.endTime - slot.startTime) for slot in availabilitySlots)`
3. For each course: `weight = creditHours / totalCredits`; `studyMinutes = weight * totalAvailableMinutes`; `sessionCount = round(studyMinutes / sessionDurationMinutes)`
4. Sort courses by `sessionCount` descending
5. Walk through each availability slot, round-robin assigning sessions from the sorted course list until the slot is filled
6. Return the flat list of entries

**This function must be unit-testable in isolation** (no Supabase import inside it), see `TESTING.md`.

### `saveTimetable(entries)`
- Deletes existing `timetable_entries` for the user (regeneration replaces, doesn't append)
- Batch inserts new entries
- Calls `scheduleNotifications(entries)` after successful save

---

## 5. Timetable Display Module

### `useTimetable()`
- Fetches `timetable_entries` joined with `courses` (for course name + colour tag)
- Returns: `{ entries, loading, error, markComplete, refetch }`

### `markComplete(entryId)`
- Updates `is_completed = true` on the matching `timetable_entries` row

---

## 6. Reminder Module

### `registerServiceWorker()`
- Called once on app load
- Registers `public/sw.js`

### `requestNotificationPermission()`
- Called from Settings screen or first-run onboarding
- Returns granted/denied

### `scheduleNotifications(entries)`
- For each entry, insert a row into `notifications` with `scheduled_at` computed from `dayOfWeek` + `startTime` (next occurrence)
- Actual push dispatch is handled by the service worker checking `scheduled_at <= now()` (polling or Supabase Realtime subscription, decide at build time; document the choice here once made)

### `useNotifications()`
- Returns upcoming notifications for display on Dashboard ("Next: Data Structures at 4:00 PM")

---

## 7. PDF Upload Module

### `uploadMaterial(courseId, file)`
- Uploads to Supabase Storage bucket `materials`, path `{user_id}/{course_id}.pdf`
- On success, updates `courses.material_url` with the public/signed URL
- Validates: file type is `application/pdf`, max size (decide limit, suggest 10MB, at build time)

### `getMaterialUrl(courseId)`
- Reads `courses.material_url` for the given course

---

## Sync Rule

Whenever `ARCHITECTURE.md`, `DATABASE.md`, or Chapter 3 Section 3.6/3.10 of the report changes, check this file for drift. This file is the one that code should literally follow function-by-function.
