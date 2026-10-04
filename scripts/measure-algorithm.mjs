// Measurement only. Imports the real generateTimetable; nothing here changes app code.
// Usage: node scripts/measure-algorithm.mjs   (writes docs/MEASURED_RESULTS.md and prints it)
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { performance } from 'node:perf_hooks'
import { generateTimetable } from '../src/lib/algorithm/generateTimetable.js'

const SEED = 20261004
const SESSION = 90
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const toMin = (t) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
const toTime = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

// ---- helpers (measurement side only) ----
function mergeSlots(slots) {
  const sorted = slots
    .map((s) => ({ d: s.dayOfWeek, a: toMin(s.startTime), b: toMin(s.endTime) }))
    .sort((x, y) => DAYS.indexOf(x.d) - DAYS.indexOf(y.d) || x.a - y.a)
  const out = []
  for (const s of sorted) {
    const last = out[out.length - 1]
    if (last && last.d === s.d && s.a < last.b) last.b = Math.max(last.b, s.b)
    else out.push({ ...s })
  }
  return out
}
const capacity = (slots) =>
  slots.reduce((n, s) => n + Math.floor((toMin(s.endTime) - toMin(s.startTime)) / SESSION), 0)
const mergedCapacity = (merged) => merged.reduce((n, s) => n + Math.floor((s.b - s.a) / SESSION), 0)

function overlapPairs(es) {
  let n = 0
  for (let i = 0; i < es.length; i++) {
    for (let j = i + 1; j < es.length; j++) {
      if (
        es[i].dayOfWeek === es[j].dayOfWeek &&
        toMin(es[i].startTime) < toMin(es[j].endTime) &&
        toMin(es[j].startTime) < toMin(es[i].endTime)
      )
        n++
    }
  }
  return n
}
function partialViolations(es, merged) {
  return es.filter(
    (e) => !merged.some((s) => s.d === e.dayOfWeek && toMin(e.startTime) >= s.a && toMin(e.endTime) <= s.b),
  ).length
}
const perCourse = (es, courses) => courses.map((c) => es.filter((e) => e.courseId === c.id).length)

// As even as possible, larger values first.
function makeCourses(k, total) {
  const base = Math.floor(total / k)
  const rem = total % k
  return Array.from({ length: k }, (_, i) => ({
    id: `C${i + 1}`,
    courseName: `Course ${i + 1}`,
    creditHours: base + (i < rem ? 1 : 0),
  }))
}
// Spread H hours evenly over n evening slots (Mon..Fri 18:00, Saturday 10:00 as the 6th), 30-minute units.
function makeSlots(H) {
  const units = Math.round(H * 2)
  const n = Math.min(6, Math.max(Math.ceil(H / 3), 1))
  const base = Math.floor(units / n)
  const extra = units % n
  const dayFor = (i) => (i === 5 ? 'Saturday' : DAYS[i])
  return Array.from({ length: n }, (_, i) => {
    const u = base + (i < extra ? 1 : 0)
    const start = dayFor(i) === 'Saturday' ? 10 * 60 : 18 * 60
    return { dayOfWeek: dayFor(i), startTime: toTime(start), endTime: toTime(start + u * 30) }
  })
}
const slotText = (slots) => slots.map((s) => `${s.dayOfWeek.slice(0, 3)} ${s.startTime}–${s.endTime}`).join(', ')
const f2 = (x) => x.toFixed(2)
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length

const md = []
const out = (s = '') => md.push(s)

out('# StudyFlow — Measured Algorithm Results')
out()
out(`- Date: ${new Date().toISOString().slice(0, 10)}`)
out(`- Random seed (Part C): ${SEED} (mulberry32)`)
out(`- Node: ${process.version}`)
out(`- Session length: ${SESSION} minutes. Function under test: \`src/lib/algorithm/generateTimetable.js\` (imported directly, unmodified).`)
out('- Measurement only. No algorithm or app code was changed or tuned for these numbers.')
out()

// ---- Part A ----
out('## Part A — Ten named scenarios')
out()
const A = [[3, 8, 10], [4, 12, 14], [5, 15, 13], [2, 5, 6], [6, 18, 20], [1, 3, 4.5], [5, 14, 9], [4, 10, 16], [3, 9, 7.5], [7, 21, 22]]
const rowsA = []
const inputsA = []
A.forEach(([k, total, H], i) => {
  const courses = makeCourses(k, total)
  const slots = makeSlots(H)
  const es = generateTimetable({ courses, availabilitySlots: slots, sessionDurationMinutes: SESSION })
  const availMin = slots.reduce((n, s) => n + toMin(s.endTime) - toMin(s.startTime), 0)
  const ideal = courses.map((c) => ((c.creditHours / total) * availMin) / SESSION)
  rowsA.push({ id: i + 1, k, total, H, sessions: es.length, cap: capacity(slots), overlaps: overlapPairs(es), per: perCourse(es, courses), ideal })
  inputsA.push({ id: i + 1, courses, slots, availMin })
})
out('| # | Courses | Credits | Avail. h | Sessions generated | Max physical capacity | Overlapping pairs | Sessions per course (actual) | Ideal sessions per course (unrounded) |')
out('|---|---|---|---|---|---|---|---|---|')
rowsA.forEach((r) =>
  out(`| ${r.id} | ${r.k} | ${r.total} | ${r.H} | ${r.sessions} | ${r.cap} | ${r.overlaps} | ${r.per.join(', ')} | ${r.ideal.map(f2).join(', ')} |`),
)
out()
out('Ideal = (course credits / total credits) × available minutes ÷ 90, not rounded.')
out()
out('### Appendix — exact inputs used in Part A')
out()
out('| # | Courses (credit hours) | Slots |')
out('|---|---|---|')
inputsA.forEach((x) =>
  out(`| ${x.id} | ${x.courses.map((c) => `${c.id}=${c.creditHours}`).join(', ')} | ${slotText(x.slots)} (${x.availMin / 60} h) |`),
)
out()

// ---- Part B ----
out('## Part B — Worked example (credits 3, 2, 3)')
out()
out('| Available h | Slots | Sessions per course (A=3, B=2, C=3) | Total sessions | Capacity | Overlaps |')
out('|---|---|---|---|---|---|')
for (const H of [10, 12]) {
  const courses = [{ id: 'A', creditHours: 3 }, { id: 'B', creditHours: 2 }, { id: 'C', creditHours: 3 }]
  const slots = makeSlots(H)
  const es = generateTimetable({ courses, availabilitySlots: slots, sessionDurationMinutes: SESSION })
  out(`| ${H} | ${slotText(slots)} | ${perCourse(es, courses).join(' : ')} | ${es.length} | ${capacity(slots)} | ${overlapPairs(es)} |`)
}
out()

// ---- Part C ----
const rnd = mulberry32(SEED)
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1))
const N = 200
let conflictFree = 0
let partial = 0
let zeroSession = 0
const dev = []
const cov = []
let tc7Eligible = 0
let tc7Fail = 0
let tc7FailNotExplained = 0
for (let n = 0; n < N; n++) {
  const k = ri(1, 7)
  const courses = Array.from({ length: k }, (_, i) => ({ id: `C${i + 1}`, courseName: `C${i + 1}`, creditHours: ri(1, 6) }))
  const slots = Array.from({ length: ri(1, 7) }, () => {
    const len = ri(2, 8) * 30
    const start = ri(12, Math.floor((24 * 60 - len) / 30)) * 30 // 06:00 onwards, ends by midnight
    return { dayOfWeek: DAYS[ri(0, 6)], startTime: toTime(start), endTime: toTime(start + len) }
  })
  const es = generateTimetable({ courses, availabilitySlots: slots, sessionDurationMinutes: SESSION })
  const merged = mergeSlots(slots)
  const availMin = merged.reduce((s, m) => s + m.b - m.a, 0)
  const cap = mergedCapacity(merged)
  if (overlapPairs(es) === 0) conflictFree++
  partial += partialViolations(es, merged)
  cov.push((es.length * SESSION) / availMin)
  const per = perCourse(es, courses)
  const totalCredits = courses.reduce((s, c) => s + c.creditHours, 0)
  if (es.length === 0) zeroSession++
  else dev.push((courses.reduce((s, c, i) => s + Math.abs(per[i] / es.length - c.creditHours / totalCredits), 0) / k) * 100)
  if (cap >= k) {
    tc7Eligible++
    const zeroCourses = courses.filter((c, i) => per[i] === 0)
    if (zeroCourses.length > 0) {
      tc7Fail++
      const planned = (c) => Math.round(((c.creditHours / totalCredits) * availMin) / SESSION)
      if (zeroCourses.some((c) => planned(c) >= 1)) tc7FailNotExplained++
    }
  }
}
out(`## Part C — ${N} seeded random scenarios`)
out()
out('Scenarios: 1–7 courses, credits 1–6, 1–7 slots of 1–4 h (30-minute steps), random days, random start times; overlapping slots are possible.')
out()
out('| Metric | Result |')
out('|---|---|')
out(`| Conflict-free rate | ${conflictFree}/${N} = ${((conflictFree / N) * 100).toFixed(1)}% |`)
out(`| Partial-session violations (sessions running past their slot) | ${partial} |`)
out(`| Scenarios producing zero sessions (excluded from deviation) | ${zeroSession} |`)
out(`| Allocation deviation (pp), mean over ${dev.length} scenarios with sessions | ${f2(mean(dev))} |`)
out(`| Allocation deviation (pp), worst case | ${f2(Math.max(...dev))} |`)
out(`| Slot coverage, mean (all ${N}) | ${(mean(cov) * 100).toFixed(1)}% |`)
out(`| Slot coverage, min | ${(Math.min(...cov) * 100).toFixed(1)}% |`)
out(`| Slot coverage, max | ${(Math.max(...cov) * 100).toFixed(1)}% |`)
out(`| Test Case 7 — scenarios with capacity ≥ number of courses | ${tc7Eligible} |`)
out(`| Test Case 7 — of those, a course got zero sessions | ${tc7Fail} |`)
out(`| Test Case 7 — of those, a zero-session course whose planned count was ≥ 1 (not explained by rounding to 0) | ${tc7FailNotExplained} |`)
out()
out('Allocation deviation = mean over courses of |actual share of scheduled sessions − credit weight|, in percentage points. Coverage = scheduled minutes ÷ available minutes after merging overlapping slots.')
out()

// ---- Part D ----
function timeRuns(courses, slots) {
  const ts = []
  for (let i = 0; i < 1000; i++) {
    const t0 = performance.now()
    generateTimetable({ courses, availabilitySlots: slots, sessionDurationMinutes: SESSION })
    ts.push(performance.now() - t0)
  }
  return { mean: mean(ts), max: Math.max(...ts) }
}
const small = timeRuns(makeCourses(1, 3), makeSlots(4.5))
const large = timeRuns(makeCourses(7, 21), makeSlots(22))
out('## Part D1 — generateTimetable() alone, Node, 1000 runs each')
out()
out('| Scenario | Mean (ms) | Max (ms) |')
out('|---|---|---|')
out(`| Smallest (1 course, 3 credits, 4.5 h) | ${small.mean.toFixed(4)} | ${small.max.toFixed(4)} |`)
out(`| Largest (7 courses, 21 credits, 22 h) | ${large.mean.toFixed(4)} | ${large.max.toFixed(4)} |`)
out()
out('Pure function only: no network, no React, no Supabase. No warm-up runs were discarded.')
out()
out('## Part D2 — Full Generate click to timetable displayed, in the running app')
out()
const timingsPath = new URL('./app-timings.json', import.meta.url)
if (existsSync(timingsPath)) {
  const t = JSON.parse(readFileSync(timingsPath, 'utf8'))
  out(t.note)
  out()
  out('| Run | Milliseconds |')
  out('|---|---|')
  t.runs.forEach((ms, i) => out(`| ${i + 1} | ${ms} |`))
  out(`| Mean | ${mean(t.runs).toFixed(0)} |`)
} else {
  out('_Not measured yet (scripts/app-timings.json missing)._')
}
out()
out('**D1 and D2 are different measurements.** D1 times only the pure scheduling function. D2 includes the Supabase delete and insert round trips over the network, the refetch, and the re-render.')

const text = md.join('\n') + '\n'
writeFileSync(new URL('../docs/MEASURED_RESULTS.md', import.meta.url), text)
console.log(text)
