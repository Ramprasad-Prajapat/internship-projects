# GamePulse Live — Seed Data Plan

> **Status: Planning only.** No SQL `INSERT` scripts have been written. This document lists
> the initial/demo data planned for the first match, so the future database seed matches the
> frontend mock data exactly.

---

## 1. Users (3 demo accounts)

| id | name        | email                 | password  | role   |
| -- | ----------- | --------------------- | --------- | ------ |
| 1  | Admin User  | admin@gamepulse.com   | admin123  | ADMIN  |
| 2  | Scorer User | scorer@gamepulse.com  | scorer123 | SCORER |
| 3  | Normal User | user@gamepulse.com    | user123   | USER   |

> Passwords shown are the demo/plain values. In the real database they will be **BCrypt
> hashed**.

---

## 2. Teams (2)

| id | team_name      | captain_name | description          |
| -- | -------------- | ------------ | -------------------- |
| 1  | JIET Warriors  | Rahul Sharma | College cricket team |
| 2  | Jodhpur Titans | Aman Singh   | Local cricket team   |

---

## 3. Players (at least 6 per team)

### Team 1 — JIET Warriors (`team_id = 1`)

| name          | role        | jersey_number |
| ------------- | ----------- | ------------- |
| Rahul Sharma  | Batsman     | 7             |
| Vikram Singh  | Bowler      | 11            |
| Arjun Mehta   | All-rounder | 18            |
| Karan Joshi   | Batsman     | 5             |
| Sahil Verma   | Wicketkeeper| 1             |
| Deepak Yadav  | Bowler      | 9             |

### Team 2 — Jodhpur Titans (`team_id = 2`)

| name          | role        | jersey_number |
| ------------- | ----------- | ------------- |
| Aman Singh    | Batsman     | 10            |
| Rohit Khanna  | Bowler      | 21            |
| Naveen Rao    | All-rounder | 8             |
| Suresh Patel  | Batsman     | 3             |
| Manish Gupta  | Wicketkeeper| 2             |
| Imran Khan    | Bowler      | 14            |

> The exact player roster can be adjusted; minimum 6 players per team.

---

## 4. Match (1 demo match)

| Field         | Value                              |
| ------------- | ---------------------------------- |
| id            | 1                                  |
| title         | JIET Warriors vs Jodhpur Titans    |
| team_a_id     | 1                                  |
| team_b_id     | 2                                  |
| venue         | JIET College Ground                |
| match_date    | 2026-06-23                         |
| time          | 04:00 PM                           |
| status        | Live                               |
| toss_winner   | JIET Warriors                      |
| toss_decision | Bat                                |

---

## 5. Stream (1)

| Field            | Value           |
| ---------------- | --------------- |
| match_id         | 1               |
| youtube_video_id | dQw4w9WgXcQ     |
| embed_url        | https://www.youtube.com/embed/dQw4w9WgXcQ |
| is_live          | true            |

> `dQw4w9WgXcQ` is a placeholder video ID. Admin can change it at any time.

---

## 6. Scoreboard (1 — first innings, fresh start)

| Field           | Value         |
| --------------- | ------------- |
| match_id        | 1             |
| innings         | 1             |
| batting_team_id | 1             |
| bowling_team_id | 2             |
| runs            | 0             |
| wickets         | 0             |
| overs           | 0             |
| balls           | 0             |
| target          | null          |
| current_batsman | Rahul Sharma  |
| current_bowler  | Aman Singh    |

---

## 7. Ball Events

Start with an **empty** set. Events are added live by the scorer as the match progresses.

---

## 8. Highlights (2 sample cards)

| match_id | title                | category      | video_url (placeholder)                     |
| -------- | -------------------- | ------------- | ------------------------------------------- |
| 1        | Massive Six by Rahul | Six           | https://www.youtube.com/watch?v=dQw4w9WgXcQ |
| 1        | Match Winning Wicket | Winning Moment| https://www.youtube.com/watch?v=dQw4w9WgXcQ |

---

## 9. Poll (1)

| Field    | Value                  |
| -------- | ---------------------- |
| id       | 1                      |
| match_id | 1                      |
| question | Who will win today?    |
| option_a | JIET Warriors          |
| option_b | Jodhpur Titans         |

---

## 10. Votes

Start with an **empty** set. Votes are inserted as users vote (one vote per user per poll).

---

## Notes

* This seed mirrors the frontend mock data (`frontend/src/data/mockData.js`) so the two stay
  in sync until the backend replaces the mock layer.
* Real `INSERT` scripts will be authored only when the backend/database phase begins and is
  explicitly requested.
