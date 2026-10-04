# StudyFlow — Brand Guide

## 1. Product Identity

**Name:** StudyFlow
**Tagline:** Your study time, automatically organised.
**One-line description:** A web-based Smart Study Timetable Generator with Reminder System that helps open and distance learning students automatically organise their study time.

**Tone of voice:** Calm, encouraging, practical. StudyFlow speaks like a supportive study partner, not a corporate productivity tool. No hype, no jargon. Short sentences. Direct instructions ("Add your first course to get started" rather than "Please proceed to input your academic course information").

**Target user:** A NOUN / open-and-distance-learning student, often on a mid-range Android phone, on a mobile data connection, checking StudyFlow between work, family, and study.

---

## 2. Colour Palette (Light Mode Only)

StudyFlow ships in **light mode only** for the academic project version. White background, indigo/blue accent system, calm and academic.

### Core palette

| Token              | Hex       | Usage                                              |
|---------------------|-----------|-----------------------------------------------------|
| `--sf-bg`            | `#FFFFFF` | Primary app background                             |
| `--sf-surface`       | `#F8FAFC` | Card / panel background (slate-50)                 |
| `--sf-surface-alt`   | `#F1F5F9` | Secondary surface, table stripes (slate-100)        |
| `--sf-border`        | `#E2E8F0` | Default borders, dividers (slate-200)               |
| `--sf-text-primary`  | `#0F172A` | Headings, primary body text (slate-900)             |
| `--sf-text-secondary`| `#475569` | Secondary text, captions (slate-600)                |
| `--sf-text-muted`    | `#94A3B8` | Placeholder text, disabled state (slate-400)        |

### Brand indigo/blue accent

| Token              | Hex       | Usage                                              |
|---------------------|-----------|-----------------------------------------------------|
| `--sf-primary`       | `#4F46E5` | Primary buttons, active nav, links (indigo-600)     |
| `--sf-primary-hover` | `#4338CA` | Button hover state (indigo-700)                     |
| `--sf-primary-light` | `#EEF2FF` | Selected chips, subtle highlight bg (indigo-50)     |
| `--sf-accent-blue`   | `#2563EB` | Secondary accent, info states (blue-600)            |

### Semantic colours

| Token              | Hex       | Usage                                              |
|---------------------|-----------|-----------------------------------------------------|
| `--sf-success`       | `#16A34A` | Completed session, success toast (green-600)        |
| `--sf-success-bg`    | `#F0FDF4` | Success banner background (green-50)                |
| `--sf-warning`       | `#D97706` | Upcoming reminder badge (amber-600)                 |
| `--sf-warning-bg`    | `#FFFBEB` | Warning banner background (amber-50)                |
| `--sf-danger`        | `#DC2626` | Errors, destructive actions (red-600)                |
| `--sf-danger-bg`     | `#FEF2F2` | Error banner background (red-50)                     |

### Course colour tags (for timetable blocks)

Each course a student adds is auto-assigned one of these six colours, cycling in order:

| Name        | Hex       |
|-------------|-----------|
| Indigo      | `#4F46E5` |
| Sky         | `#0284C7` |
| Teal        | `#0D9488` |
| Violet      | `#7C3AED` |
| Rose        | `#E11D48` |
| Amber       | `#D97706` |

---

## 3. Typography

**Font family:** `Inter`, falling back to system UI sans-serif.
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

| Style          | Size    | Weight | Usage                          |
|----------------|---------|--------|----------------------------------|
| Display        | 32px    | 700    | Onboarding / marketing headline |
| H1             | 24px    | 700    | Page titles ("My Timetable")    |
| H2             | 18px    | 600    | Section headings                |
| Body           | 15px    | 400    | Default body text               |
| Body Small     | 13px    | 400    | Captions, helper text           |
| Label          | 13px    | 500    | Form labels, uppercase-tracked  |

---

## 4. Iconography & Imagery

- Icon set: **Lucide** (matches available React icon library, clean line-style, works well at small mobile sizes).
- No stock photography. No illustrations of people (keeps the product feeling utilitarian, not consumer-lifestyle).
- Course colour dots and simple line icons only.

---

## 5. Logo Concept (text-based, no image asset required for MVP)

Wordmark: **StudyFlow**, set in Inter Bold, with "Study" in `--sf-text-primary` and "Flow" in `--sf-primary`.

```
Study Flow
```
("Study" = slate-900, "Flow" = indigo-600)

Small mark (favicon-style): a simple rounded square in `--sf-primary` with a white clock/checkmark glyph. Not required for academic submission but documented here for consistency if built later.

---

## 6. UI Principles

1. **White space over decoration.** Cards on white background, subtle slate-200 borders, no heavy shadows.
2. **One primary action per screen.** E.g. "Generate Timetable" is always the single indigo filled button; everything else is secondary/outline.
3. **Minimum steps to value.** Registration → Add courses → Set availability → Generate. No unnecessary screens in between.
4. **Mobile-first.** Every screen is designed at 375px width first, then scaled up.
