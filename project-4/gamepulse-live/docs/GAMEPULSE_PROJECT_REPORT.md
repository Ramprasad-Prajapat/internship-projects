# GamePulse Live — College Cricket Live Streaming Portal

> **Project Report** · College Project Documentation
> Status: Planning / Frontend-first development
> Last updated: 2026-06-23

---

## Table of Contents

1. [Project Title](#1-project-title)
2. [Project Type](#2-project-type)
3. [Project Category](#3-project-category)
4. [Project Overview](#4-project-overview)
5. [Problem Statement](#5-problem-statement)
6. [Proposed Solution](#6-proposed-solution)
7. [Main Objective](#7-main-objective)
8. [Target Users](#8-target-users)
9. [User Roles](#9-user-roles)
10. [Final Confirmed Project Scope](#10-final-confirmed-project-scope)
11. [Core Features](#11-core-features)
12. [Live Match Flow](#12-live-match-flow)
13. [Live Score Flow](#13-live-score-flow)
14. [Highlights Flow](#14-highlights-flow)
15. [Technology Stack](#15-technology-stack)
16. [Main Pages](#16-main-pages)
17. [Live Match Page Sections](#17-live-match-page-sections)
18. [Admin Dashboard Sections](#18-admin-dashboard-sections)
19. [Scoreboard Features](#19-scoreboard-features)
20. [Cricket Score Buttons](#20-cricket-score-buttons)
21. [Match Status](#21-match-status)
22. [Database Tables](#22-database-tables)
23. [Backend APIs](#23-backend-apis)
24. [WebSocket Topics](#24-websocket-topics)
25. [Project Folder Structure](#25-project-folder-structure)
26. [Frontend Components](#26-frontend-components)
27. [Backend Modules](#27-backend-modules)
28. [Authentication](#28-authentication)
29. [UI Theme](#29-ui-theme)
30. [Deployment Plan](#30-deployment-plan)
31. [Free Tools Used](#31-free-tools-used)
32. [Development Roadmap](#32-development-roadmap)
33. [MVP Features Checklist](#33-mvp-features-checklist)
34. [Future Scope](#34-future-scope)
35. [Final Conclusion](#35-final-conclusion)
36. [Final Project Summary](#36-final-project-summary)

---

## 1. Project Title

**GamePulse Live — College Cricket Live Streaming Portal**

---

## 2. Project Type

**Web Application**

---

## 3. Project Category

**Sports Streaming + Live Scoreboard + Tournament Management**

---

## 4. Project Overview

GamePulse Live is a college-level cricket live streaming web application where users can
watch a live cricket match, view real-time scoreboard updates, follow ball-by-ball
commentary, check team/player details, vote in fan polls, and watch match highlights.

The project is designed for college matches, local tournaments, school matches, and small
sports events.

---

## 5. Problem Statement

College and local cricket matches usually do not have a proper digital platform for live
video, live score updates, commentary, highlights, and match result management.

Most updates are shared manually through WhatsApp, posters, or social media, which creates
scattered information and a poor user experience.

---

## 6. Proposed Solution

GamePulse Live provides a single platform where:

* Users can watch live cricket matches.
* Scorers can update live score ball-by-ball.
* Admin can manage matches, teams, players, stream links, highlights, and results.
* Viewers can see live scoreboard, commentary, highlights, and fan polls.

---

## 7. Main Objective

To build a cricket match live streaming portal for college/local matches using free tools
like YouTube Live Embed, React, Spring Boot, MySQL, and free deployment platforms.

---

## 8. Target Users

* College students
* Teachers
* Players
* Sports coordinators
* Local audience
* Tournament organizers
* Admin
* Scorer

---

## 9. User Roles

| Role            | Main Work                                                |
| --------------- | -------------------------------------------------------- |
| Guest User      | Watch live match, view score, highlights, schedule       |
| Registered User | Vote in poll, favorite team, view live match             |
| Scorer          | Update live score and commentary                         |
| Admin           | Manage match, teams, players, stream, highlights, result |

---

## 10. Final Confirmed Project Scope

| Feature          | Selected Decision                                               |
| ---------------- | --------------------------------------------------------------- |
| Sport            | Cricket                                                         |
| Match Type       | One college/local cricket match first                           |
| Live Video       | YouTube Live Embed                                              |
| Scoreboard       | Manual admin/scorer update                                      |
| Real-Time Update | API polling first, WebSocket optional/advanced                  |
| Backend          | Java Spring Boot                                                |
| Frontend         | React.js                                                        |
| Database         | MySQL                                                           |
| Styling          | Bootstrap / simple clean design with sports theme               |
| Media Storage    | YouTube unlisted + optional Cloudinary                          |
| Deployment       | Vercel + Render/Railway + MySQL hosting                         |
| Auth             | JWT authentication                                              |
| Roles            | User + Admin + Scorer                                           |
| MVP Goal         | Live video + scoreboard + commentary + highlights + admin panel |

---

## 11. Core Features

### 11.1 User Side Features

* Home page
* Live match page
* YouTube live video player
* Live cricket scoreboard
* Ball-by-ball commentary
* Match details
* Team details
* Player details
* Highlights page
* Fan poll
* Match result summary

### 11.2 Admin Side Features

* Admin login
* Create match
* Add teams
* Add players
* Add YouTube stream URL
* Start match
* Update score
* Add ball-by-ball events
* Add commentary
* Upload/add highlights
* Complete match
* Publish result

### 11.3 Scorer Side Features

* Mobile-friendly score update panel
* Score buttons: 0, 1, 2, 3, 4, 6
* Extra buttons: Wide, No Ball
* Wicket button
* Undo last ball
* Current batsman update
* Current bowler update
* Over update
* Commentary update

---

## 12. Live Match Flow

```text
College Ground
   ↓
Mobile Camera / Laptop + OBS
   ↓
YouTube Live
   ↓
YouTube Video ID / Embed URL
   ↓
Admin saves stream URL
   ↓
React website shows live video
```

---

## 13. Live Score Flow

```text
Scorer/Admin
   ↓
Score Update Panel
   ↓
Spring Boot Backend
   ↓
MySQL Database
   ↓
API Polling / WebSocket
   ↓
React Live Scoreboard
```

---

## 14. Highlights Flow

```text
Match highlight video
   ↓
YouTube Unlisted / Cloudinary
   ↓
Admin adds highlight URL
   ↓
Website shows highlight card
```

---

## 15. Technology Stack

### 15.1 Frontend

| Technology               | Use                  |
| ------------------------ | -------------------- |
| React.js                 | Frontend UI          |
| Vite                     | React project setup  |
| Bootstrap / Tailwind CSS | Styling              |
| React Router             | Page routing         |
| Axios                    | API calls            |
| YouTube iframe           | Live video embed     |
| STOMP Client             | WebSocket connection |

### 15.2 Backend

| Technology       | Use                     |
| ---------------- | ----------------------- |
| Java 21          | Backend language        |
| Spring Boot 3    | Backend framework       |
| Spring Web       | REST APIs               |
| Spring Security  | Authentication          |
| JWT              | Secure login            |
| Spring Data JPA  | Database operations     |
| Spring WebSocket | Real-time score updates |
| MySQL Driver     | MySQL connection        |
| Swagger/OpenAPI  | API documentation       |

### 15.3 Database

| Technology          | Use                        |
| ------------------- | -------------------------- |
| MySQL               | Main database              |
| Aiven/Railway MySQL | Online database deployment |

### 15.4 Media

| Tool             | Use                          |
| ---------------- | ---------------------------- |
| YouTube Live     | Free live match streaming    |
| YouTube Unlisted | Highlight videos             |
| Cloudinary       | Optional image/video storage |

### 15.5 Deployment

| Part     | Platform                    |
| -------- | --------------------------- |
| Frontend | Vercel                      |
| Backend  | Render / Railway            |
| Database | Aiven MySQL / Railway MySQL |
| Media    | YouTube / Cloudinary        |

---

## 16. Main Pages

| Page                      | Purpose                                     |
| ------------------------- | ------------------------------------------- |
| Home Page                 | Show live match, upcoming match, highlights |
| Live Match Page           | Show video, score, commentary               |
| Match Details Page        | Show full match information                 |
| Teams Page                | Show team details                           |
| Players Page              | Show player details                         |
| Highlights Page           | Show match highlights                       |
| Login Page                | User/admin/scorer login                     |
| Admin Dashboard           | Admin overview                              |
| Score Update Panel        | Scorer updates live score                   |
| Match Management Page     | Admin creates and manages match             |
| Highlight Management Page | Admin adds highlights                       |

---

## 17. Live Match Page Sections

* YouTube live video player
* Transparent score overlay
* Team A vs Team B
* Live scorecard
* Overs and wickets
* Current batsman
* Current bowler
* Last 6 balls
* Ball-by-ball commentary
* Fan poll
* Match status
* Result summary

---

## 18. Admin Dashboard Sections

* Total matches
* Live match
* Total teams
* Total players
* Total highlights
* Total poll votes
* Start match button
* Update score button
* Add highlight button
* Complete match button

---

## 19. Scoreboard Features

| Feature         | Status   |
| --------------- | -------- |
| Runs            | Required |
| Wickets         | Required |
| Overs           | Required |
| Balls           | Required |
| Current batsman | Required |
| Current bowler  | Required |
| Last 6 balls    | Required |
| Target score    | Required |
| Toss result     | Required |
| Match status    | Required |
| Commentary      | Required |
| Undo last ball  | Required |

---

## 20. Cricket Score Buttons

| Button | Use                     |
| ------ | ----------------------- |
| 0      | Dot ball                |
| 1      | One run                 |
| 2      | Two runs                |
| 3      | Three runs              |
| 4      | Four                    |
| 6      | Six                     |
| Wd     | Wide ball               |
| Nb     | No ball                 |
| W      | Wicket                  |
| Undo   | Remove last ball update |

---

## 21. Match Status

| Status        | Meaning                 |
| ------------- | ----------------------- |
| Upcoming      | Match not started       |
| Live          | Match running           |
| Innings Break | First innings completed |
| Completed     | Match completed         |

---

## 22. Database Tables

| Table Name  | Important Fields                                    |
| ----------- | --------------------------------------------------- |
| users       | id, name, email, password, role                     |
| teams       | id, team_name, logo, captain_name                   |
| players     | id, team_id, name, role, jersey_number              |
| matches     | id, team_a_id, team_b_id, venue, match_date, status |
| streams     | id, match_id, youtube_video_id, embed_url, is_live  |
| scoreboards | id, match_id, runs, wickets, overs, target          |
| ball_events | id, match_id, over_no, ball_no, runs, event_type    |
| highlights  | id, match_id, title, video_url, category            |
| polls       | id, match_id, question, option_a, option_b          |
| votes       | id, poll_id, user_id, selected_option               |

> Full table planning lives in [`../database/schema-plan.md`](../database/schema-plan.md).

---

## 23. Backend APIs

### 23.1 Auth APIs

| API                | Method | Use           |
| ------------------ | ------ | ------------- |
| /api/auth/register | POST   | User register |
| /api/auth/login    | POST   | User login    |
| /api/auth/profile  | GET    | User profile  |

### 23.2 Match APIs

| API                            | Method | Use                 |
| ------------------------------ | ------ | ------------------- |
| /api/matches                   | GET    | Get all matches     |
| /api/matches/live              | GET    | Get live match      |
| /api/matches/{id}              | GET    | Get match details   |
| /api/admin/matches             | POST   | Create match        |
| /api/admin/matches/{id}        | PUT    | Update match        |
| /api/admin/matches/{id}/status | PUT    | Update match status |

### 23.3 Stream APIs

| API                            | Method | Use            |
| ------------------------------ | ------ | -------------- |
| /api/matches/{id}/stream       | GET    | Get stream URL |
| /api/admin/matches/{id}/stream | POST   | Add stream URL |

### 23.4 Score APIs

| API                                | Method | Use                   |
| ---------------------------------- | ------ | --------------------- |
| /api/matches/{id}/score            | GET    | Get live score        |
| /api/admin/matches/{id}/score      | PUT    | Update score          |
| /api/admin/matches/{id}/ball-event | POST   | Add ball event        |
| /api/matches/{id}/ball-events      | GET    | Get commentary/events |

### 23.5 Highlight APIs

| API                          | Method | Use                  |
| ---------------------------- | ------ | -------------------- |
| /api/highlights              | GET    | Get highlights       |
| /api/matches/{id}/highlights | GET    | Get match highlights |
| /api/admin/highlights        | POST   | Add highlight        |

### 23.6 Poll APIs

| API                     | Method | Use             |
| ----------------------- | ------ | --------------- |
| /api/matches/{id}/polls | GET    | Get poll        |
| /api/polls/{id}/vote    | POST   | Submit vote     |
| /api/polls/{id}/result  | GET    | Get poll result |

---

## 24. WebSocket Topics

| Topic                               | Use               |
| ----------------------------------- | ----------------- |
| /topic/matches/{matchId}/score      | Live score update |
| /topic/matches/{matchId}/events     | Ball event update |
| /topic/matches/{matchId}/commentary | Commentary update |

---

## 25. Project Folder Structure

```text
gamepulse-live/
│
├── docs/                 # Project documentation (this report, frontend prompt, index)
│
├── frontend/             # React.js + Vite frontend (mock + localStorage first)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/     # Backend-ready service layer
│   │   ├── data/         # Mock data seed
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
│
├── backend/              # Java Spring Boot backend (planned, not implemented yet)
│   ├── src/main/java/com/gamepulse/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── security/
│   │   └── config/
│   ├── src/main/resources/
│   └── README.md
│
├── database/             # Database schema & seed planning (not implemented yet)
│   ├── README.md
│   ├── schema-plan.md
│   └── seed-data-plan.md
│
├── scripts/              # Helper/dev scripts
│
└── README.md
```

---

## 26. Frontend Components

| Component        | Use                  |
| ---------------- | -------------------- |
| Navbar           | Navigation           |
| LiveVideoPlayer  | YouTube video embed  |
| ScoreboardCard   | Live score display   |
| LastSixBalls     | Recent ball badges   |
| CommentaryList   | Ball-by-ball events  |
| MatchCard        | Match preview        |
| TeamCard         | Team details         |
| PlayerCard       | Player details       |
| HighlightCard    | Highlight video      |
| PollCard         | Fan voting           |
| AdminSidebar     | Admin navigation     |
| ScoreButtonPanel | Score update buttons |

---

## 27. Backend Modules

| Module           | Use                       |
| ---------------- | ------------------------- |
| Auth Module      | Login/register            |
| Match Module     | Match management          |
| Team Module      | Team management           |
| Player Module    | Player management         |
| Stream Module    | YouTube stream management |
| Score Module     | Live score update         |
| Event Module     | Ball-by-ball commentary   |
| Highlight Module | Highlight management      |
| Poll Module      | Fan poll                  |
| WebSocket Module | Real-time updates         |

---

## 28. Authentication

| Role   | Access                   |
| ------ | ------------------------ |
| USER   | View match, vote in poll |
| SCORER | Update score             |
| ADMIN  | Full control             |

Authentication uses **JWT** tokens. The frontend stores the logged-in user in
`localStorage` during the mock phase, and will switch to JWT-based auth headers when the
backend is connected.

---

## 29. UI Theme

| Element       | Design                    |
| ------------- | ------------------------- |
| Main Theme    | Clean sports theme        |
| Background    | Dark + clean sections     |
| Live Badge    | Red pulsing LIVE badge    |
| Accent Color  | Green cricket accent      |
| Cards         | Simple rounded cards      |
| Score Overlay | Transparent video overlay |
| Buttons       | Clear action buttons      |

---

## 30. Deployment Plan

### 30.1 Frontend Deployment

| Step             | Detail            |
| ---------------- | ----------------- |
| Platform         | Vercel            |
| Root Directory   | frontend          |
| Build Command    | npm run build     |
| Output Directory | dist              |
| Env Variable     | VITE_API_BASE_URL |

### 30.2 Backend Deployment

| Step           | Detail                                       |
| -------------- | -------------------------------------------- |
| Platform       | Render / Railway                             |
| Root Directory | backend                                      |
| Build Command  | ./mvnw clean package -DskipTests             |
| Start Command  | java -jar target/*.jar                       |
| Env Variables  | DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET |

### 30.3 Database Deployment

| Step     | Detail                                         |
| -------- | ---------------------------------------------- |
| Platform | Aiven MySQL / Railway MySQL                    |
| Database | gamepulse_live                                 |
| Tables   | users, teams, matches, scoreboards, highlights |

---

## 31. Free Tools Used

| Tool                | Use                  |
| ------------------- | -------------------- |
| YouTube Live        | Live match streaming |
| YouTube Unlisted    | Highlights           |
| React               | Frontend             |
| Spring Boot         | Backend              |
| MySQL               | Database             |
| Vercel              | Frontend deployment  |
| Render/Railway      | Backend deployment   |
| Aiven/Railway MySQL | Database hosting     |
| GitHub              | Code repository      |

---

## 32. Development Roadmap

| Day    | Work                                 |
| ------ | ------------------------------------ |
| Day 1  | Project setup + UI layout            |
| Day 2  | Home page + live match page          |
| Day 3  | Spring Boot setup + MySQL connection |
| Day 4  | Auth APIs                            |
| Day 5  | Match and team APIs                  |
| Day 6  | YouTube stream URL integration       |
| Day 7  | Scoreboard API                       |
| Day 8  | Admin score update panel             |
| Day 9  | Commentary and ball events           |
| Day 10 | Highlights page                      |
| Day 11 | Poll feature                         |
| Day 12 | WebSocket integration                |
| Day 13 | Testing                              |
| Day 14 | Deployment + documentation           |

---

## 33. MVP Features Checklist

| Feature                 | Status   |
| ----------------------- | -------- |
| React frontend          | Required |
| Spring Boot backend     | Required |
| MySQL database          | Required |
| User login              | Required |
| Admin login             | Required |
| Scorer role             | Required |
| Live match page         | Required |
| YouTube video embed     | Required |
| Live scoreboard         | Required |
| Score update panel      | Required |
| Ball-by-ball commentary | Required |
| Teams page              | Required |
| Players page            | Required |
| Highlights page         | Required |
| Fan poll                | Required |
| Result summary          | Required |
| Deployment              | Required |

---

## 34. Future Scope

* Multi-sport support
* Multiple matches
* Tournament points table
* AI match summary
* AI highlight detection
* Push notifications
* Mobile app
* Cloudflare/Mux live streaming
* Payment for premium match passes
* Advanced analytics dashboard
* Chat moderation
* Sponsor/ads module

---

## 35. Final Conclusion

GamePulse Live is a practical college-level cricket streaming project that connects a real
college/local match with a digital web platform.

The project uses YouTube Live for free video streaming, Spring Boot for backend APIs, MySQL
for data storage, and React for frontend UI.

The main strength of this project is the combination of live video, live scoreboard,
ball-by-ball commentary, highlights, admin control, and simple deployment.

---

## 36. Final Project Summary

```text
Project Name: GamePulse Live
Project Type: Sports Streaming Web App
Sport: Cricket
Target: College/local cricket match
Frontend: React.js
Backend: Java Spring Boot
Database: MySQL
Live Video: YouTube Live Embed
Scoreboard: Manual scorer/admin update
Real-Time: API polling + WebSocket
Highlights: YouTube Unlisted / Cloudinary
Deployment: Vercel + Render/Railway + Aiven MySQL
```

---

### Related Documents

* [Frontend Master Prompt](FRONTEND_MASTER_PROMPT.md)
* [Documentation Index](README.md)
* [Database Schema Plan](../database/schema-plan.md)
* [Database Seed Data Plan](../database/seed-data-plan.md)
