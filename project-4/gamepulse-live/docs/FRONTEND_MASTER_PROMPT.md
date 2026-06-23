# Frontend Master Prompt — GamePulse Live

> This document is the complete frontend build instruction for an AI developer (or a human
> developer) working on **GamePulse Live**. It captures the exact requirements, structure,
> and logic the frontend must implement.

You are working inside the existing GamePulse Live project, or you may create a new frontend
project if one is not available.

> **Permanent workflow rules** (see [../CLAUDE.md](../CLAUDE.md)): After any **frontend code
> change**, run the app automatically (`scripts/auto-run.ps1` — Vite on
> `http://localhost:5173`) and verify the UI loads before reporting done. **Never commit or
> push** unless the user explicitly says so (e.g. `commit now` / `make checkpoint`).
> **Docs-only** changes skip the dev server. Keep all changes **local**.

## Project Name

**GamePulse Live — College Cricket Live Streaming Portal**

## Main Goal

Create a complete working frontend for a college/local cricket live streaming portal.

For now, there is **no real backend and no real database**.
So build the frontend using **temporary mock data + localStorage**.

Later, when the Java Spring Boot backend and MySQL database are added, it should be possible
to remove the mock data and connect real APIs easily — by replacing only the service files.

---

## 1. Important Instructions

* Build **only** the frontend.
* Do **not** create the backend.
* Do **not** create the database.
* Use mock data and localStorage as a temporary backend/database.
* Keep the frontend **backend-ready**.
* Do **not** hardcode data directly inside UI components.
* Create a separate mock API/service layer.
* Later, the real backend API should replace only the service files.
* Make the frontend fully working now.
* All pages, buttons, admin actions, score updates, highlights, poll, and match status should
  work with temporary data.
* UI should be clean, modern, responsive, and suitable for a college cricket streaming project.
* Use Bootstrap for layout and styling, plus custom CSS for the sports theme.
* Design should not look plain. Use a clean sports theme with a red LIVE badge and green
  cricket accent.
* Make the admin/scorer panel mobile friendly because the scorer may update the score from
  the ground using a mobile device.

---

## 2. Technology Stack

Use:

* React.js
* Vite
* Bootstrap 5
* React Router DOM
* Axios-ready service structure
* localStorage for the temporary database
* Context API or simple state management
* CSS custom styling
* YouTube iframe for live video
* Optional: Recharts/Chart.js only if needed for admin overview

---

## 3. Temporary Backend Strategy

Create a mock backend system like this:

```text
src/
 ├── data/
 │   └── mockData.js
 ├── services/
 │   ├── storageService.js
 │   ├── authService.js
 │   ├── matchService.js
 │   ├── scoreService.js
 │   ├── highlightService.js
 │   └── pollService.js
```

Use `localStorage` to store and update:

* users
* teams
* players
* matches
* stream
* scoreboard
* ball events
* highlights
* polls
* votes

When the app first loads, seed `localStorage` with default mock data.

Later, backend connection should be easy by replacing service methods with real API calls.

Example service pattern:

```js
// temporary now
getLiveMatch() {
  return Promise.resolve(localStorageData);
}

// later real backend
getLiveMatch() {
  return axios.get("/api/matches/live");
}
```

---

## 4. Environment Setup

Create `.env`:

```env
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:8080
```

The frontend should use mock services when `VITE_USE_MOCK=true`.

---

## 5. Required Pages / Routes

| Route                   | Page               |
| ----------------------- | ------------------ |
| `/`                     | Home Page          |
| `/live/:matchId`        | Live Match Page    |
| `/highlights`           | Highlights Page    |
| `/teams`                | Teams Page         |
| `/players`              | Players Page       |
| `/login`                | Login Page         |
| `/admin`                | Admin Dashboard    |
| `/admin/matches`        | Match Management   |
| `/admin/score/:matchId` | Score Update Panel |
| `/admin/highlights`     | Highlight Management |
| `/admin/polls`          | Poll Management    |

---

## 6. User Roles

Create role-based frontend access using mock authentication.

Roles:

```text
USER
SCORER
ADMIN
```

Temporary users:

```js
[
  { id: 1, name: "Admin User",  email: "admin@gamepulse.com",  password: "admin123",  role: "ADMIN"  },
  { id: 2, name: "Scorer User", email: "scorer@gamepulse.com", password: "scorer123", role: "SCORER" },
  { id: 3, name: "Normal User", email: "user@gamepulse.com",   password: "user123",   role: "USER"   }
]
```

Login should store the logged-in user in `localStorage`.

---

## 7. Main UI Theme

Use this style direction:

```text
Theme: Clean sports theme
Primary accent: Cricket green
Live badge: Red pulsing LIVE badge
Background: Light + dark mixed sports layout
Cards: Rounded, shadow, clean spacing
Buttons: Clear and action-focused
Score area: Bold and readable
Mobile friendly: Very important
```

Use a professional layout:

* Navbar
* Hero section
* Live match card
* Score cards
* Admin sidebar
* Responsive mobile cards
* Clean footer

---

## 8. Home Page Requirements

Home page should show:

* Navbar
* Hero section with project name
* Live match banner
* Watch Live button
* Current live score preview
* Upcoming match card
* Latest highlights
* Teams preview
* Fan poll preview
* Footer

Home page should use mock data from the service layer.

---

## 9. Live Match Page Requirements

### 9.1 Video Section

* YouTube live video iframe
* Use a temporary YouTube video ID from mock data
* If the video ID is empty, show a placeholder card: "Live stream will appear here"

### 9.2 Score Overlay

Show a transparent score overlay on the video:

```text
JIET Warriors 124/3
Overs: 12.4
LIVE
```

### 9.3 Match Info

Show:

* Team A vs Team B
* Venue
* Match date
* Match status
* Toss winner
* Decision: Bat/Bowl
* Current innings

### 9.4 Live Scoreboard

Show:

* Runs
* Wickets
* Overs
* Balls
* Target
* Required runs
* Current batsman
* Current bowler
* Last 6 balls as circular badges

### 9.5 Commentary

Show ball-by-ball events. Example:

```text
12.4 — SIX by Rahul
12.3 — 2 runs
12.2 — Wicket
12.1 — Dot ball
```

### 9.6 Poll

Show a "Who will win today?" poll. User can vote once. Store vote in `localStorage`.

---

## 10. Admin Dashboard Requirements

Admin dashboard should show cards:

* Total matches
* Live match
* Total teams
* Total players
* Total highlights
* Total poll votes

Quick action buttons:

* Start Match
* Update Score
* Add Highlight
* Complete Match

Admin dashboard should look clean and professional.

---

## 11. Match Management Page

Admin can:

* Create match
* Edit match
* Set Team A
* Set Team B
* Set venue
* Set date/time
* Set match status: Upcoming, Live, Innings Break, Completed
* Add YouTube video ID
* Add toss winner
* Add toss decision: Bat/Bowl

Use temporary mock/localStorage data.

---

## 12. Score Update Panel Requirements

This is the most important page.

Route:

```text
/admin/score/:matchId
```

Make it mobile friendly.

Show the current score at top:

```text
JIET Warriors 124/3
Overs 12.4
Current Batsman: Rahul
Current Bowler: Aman
```

Add cricket scoring buttons:

```text
0  1  2  3  4  6
Wd  Nb  W  Undo
End Over  End Innings  Complete Match
```

### Button Logic

**Runs 0, 1, 2, 3, 4, 6**

* Add runs
* Increase ball count by 1
* Update overs
* Add event to commentary
* Add value to last 6 balls
* Save updated score in `localStorage`

**Wide**

* Add 1 run
* Do **not** increase ball count
* Add `Wd` to last 6 balls
* Add commentary event

**No Ball**

* Add 1 run
* Do **not** increase ball count
* Add `Nb` to last 6 balls
* Add commentary event

**Wicket**

* Increase wicket by 1
* Increase ball count by 1
* Add `W` to last 6 balls
* Add commentary event

**Undo**

* Remove last ball event
* Restore previous score state
* Keep score history for undo feature

**End Innings**

* Save first innings score
* Auto calculate target = first innings runs + 1
* Switch batting team and bowling team
* Reset runs, wickets, overs, balls for the second innings

**Complete Match**

* Set match status to Completed
* Generate a simple result summary

Example result summary:

```text
JIET Warriors won by 12 runs.
```

---

## 13. Current Batsman and Bowler

The score update panel should allow the scorer to manually update:

* Current batsman
* Current bowler

Use a dropdown or input field.

---

## 14. Highlights Page

Show highlight cards:

* Thumbnail
* Title
* Match name
* Category
* Watch button

Highlight categories:

```text
Four
Six
Wicket
Best Moment
Winning Moment
Full Match
```

Clicking watch should open the embedded YouTube video or video URL.

---

## 15. Highlight Management Page

Admin can add a highlight:

* Match select
* Highlight title
* Category
* YouTube video URL
* Thumbnail URL
* Description

For now, save data in `localStorage`.

---

## 16. Teams Page

Show teams:

* Team logo
* Team name
* Captain
* Short description
* Players count

Use mock/localStorage data.

---

## 17. Players Page

Show players:

* Player name
* Team
* Role
* Jersey number
* Basic stats

---

## 18. Poll Feature

Poll question:

```text
Who will win today?
```

Options:

* Team A
* Team B

User can vote once. Show result as percentage bars. Store vote in `localStorage`.

---

## 19. Mock Data Required

Create initial mock data for one cricket match.

### Teams

```js
teams: [
  { id: 1, name: "JIET Warriors", logo: "", captain: "Rahul Sharma", description: "College cricket team" },
  { id: 2, name: "Jodhpur Titans", logo: "", captain: "Aman Singh",  description: "Local cricket team"   }
]
```

### Players

Add at least 6 players per team.

### Match

```js
match: {
  id: 1,
  title: "JIET Warriors vs Jodhpur Titans",
  teamAId: 1,
  teamBId: 2,
  venue: "JIET College Ground",
  date: "2026-06-23",
  time: "04:00 PM",
  status: "Live",
  tossWinner: "JIET Warriors",
  tossDecision: "Bat",
  youtubeVideoId: "dQw4w9WgXcQ"
}
```

Use a placeholder YouTube video ID for now. Admin should be able to change it.

### Scoreboard

```js
scoreboard: {
  matchId: 1,
  innings: 1,
  battingTeamId: 1,
  bowlingTeamId: 2,
  runs: 0,
  wickets: 0,
  overs: 0,
  balls: 0,
  target: null,
  currentBatsman: "Rahul Sharma",
  currentBowler: "Aman Singh",
  lastSixBalls: []
}
```

### Ball Events

Start with an empty array.

### Highlights

Add 2 sample highlight cards.

### Poll

Create one poll:

```js
{
  id: 1,
  matchId: 1,
  question: "Who will win today?",
  options: ["JIET Warriors", "Jodhpur Titans"]
}
```

---

## 20. Components Required

Create reusable components:

```text
Navbar
Footer
LiveBadge
MatchCard
LiveVideoPlayer
ScoreOverlay
ScoreboardCard
LastSixBalls
CommentaryList
PollCard
TeamCard
PlayerCard
HighlightCard
AdminSidebar
DashboardCard
ScoreButtonPanel
ProtectedRoute
RoleBasedRoute
```

---

## 21. Backend-Ready Service Structure

Every data operation should go through services.

Example:

```text
authService.login()
matchService.getLiveMatch()
matchService.updateMatch()
scoreService.getScore()
scoreService.updateScore()
scoreService.addBallEvent()
highlightService.getHighlights()
highlightService.addHighlight()
pollService.vote()
```

Do **not** directly use `localStorage` inside UI components.

---

## 22. Simulated Real-Time Update

Since the backend is not available, simulate real-time updates.

When the score updates:

* Save the score in `localStorage`
* Dispatch a custom browser event
* Live match page listens and updates the scoreboard

Example idea:

```js
window.dispatchEvent(new Event("scoreUpdated"));
```

Live page should listen:

```js
window.addEventListener("scoreUpdated", loadScore);
```

Later this will be replaced by WebSocket.

---

## 23. Later Backend Connection Plan

Add comments in service files:

```js
// MOCK MODE: localStorage
// REAL API MODE: replace with axios call to Spring Boot backend
```

When the backend is ready:

* Replace localStorage logic with axios
* Use `VITE_API_BASE_URL`
* Keep UI components unchanged

---

## 24. UI Quality Requirements

* Fully responsive
* Mobile-friendly scorer panel
* Clean cards
* Good spacing
* Professional navbar
* Clear live match section
* Score should be easy to read
* Admin buttons should be large enough for mobile use
* Do not make the UI plain or boring
* Use the Bootstrap grid properly
* Add custom CSS for a sports look

---

## 25. Final Output Expected

After completion, the frontend should work completely without a backend:

* User can login using mock accounts
* Admin can create/edit match
* Admin can add YouTube video ID
* User can watch embedded video
* Scorer can update score
* Score updates on live match page
* Commentary updates
* Last 6 balls update
* Poll voting works
* Highlights can be added and shown
* Match can be completed
* Result summary generated
* Data persists using localStorage

---

## 26. Do Not Do

* Do not create the backend.
* Do not create a real database.
* Do not use paid APIs.
* Do not directly hardcode all data inside components.
* Do not make only a static UI.
* Do not skip admin/scorer functionality.
* Do not make the scorer panel desktop-only.
* Do not use IPL or copyrighted live content.
* Do not break the backend-ready structure.

---

## 27. Final Development Priority

Build in this order:

```text
1.  React + Bootstrap setup
2.  Folder structure
3.  Mock data + storage service
4.  Auth system
5.  Home page
6.  Live match page
7.  Scoreboard display
8.  Admin dashboard
9.  Score update panel
10. Match management
11. Highlights
12. Poll
13. Teams and players
14. Responsive design
15. Backend-ready service cleanup
```

---

## 28. Final Summary

Create a complete frontend for:

**GamePulse Live — College Cricket Live Streaming Portal**

The frontend should work now using mock data and localStorage, and later connect easily with
the Java Spring Boot backend and MySQL database by replacing service files only.

---

### Related Documents

* [Project Report](GAMEPULSE_PROJECT_REPORT.md)
* [Documentation Index](README.md)
* [Database Schema Plan](../database/schema-plan.md)
