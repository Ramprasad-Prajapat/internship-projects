# GamePulse Live — Cricket Scoring Engine Specification

The `ScoringService` implements accurate cricket scoring rules adhering to standard ICC laws.

---

## 1. Delivery Processing Rules

Each ball delivery payload contains:
- `runsScored`: Integer (0–6 runs off bat).
- `extraType`: `NONE`, `WIDE`, `NO_BALL`, `BYE`, `LEG_BYE`, `PENALTY`.
- `extraRuns`: Additional runs associated with the extra.
- `isWicket`: Boolean flag.
- `dismissalType`: `BOWLED`, `CAUGHT`, `LBW`, `RUN_OUT`, `STUMPED`, `HIT_WICKET`, `HANDLED_BALL`, `OBSTRUCTING_FIELD`.

### Extras Rules Matrix
| Extra Type | Valid Ball for Over Count? | Batter Credit Runs? | Bowler Conceded Runs? |
|---|---|---|---|
| `NONE` | Yes | Yes | Yes |
| `WIDE` | **No** (Re-bowl) | No | Yes (1 + extras) |
| `NO_BALL` | **No** (Re-bowl) | Yes (off bat) | Yes (1 + runs) |
| `BYE` | Yes | No | No (Team runs only) |
| `LEG_BYE` | Yes | No | No (Team runs only) |

---

## 2. Inning State & Over Progression
- Standard over consists of **6 legal deliveries**.
- Upon completion of 6 legal balls:
  - Over number increments (`over.ball` -> `1.0`, `1.1`, ..., `1.5`, `2.0`).
  - Strike changes automatically between batsmen.
  - Bowler changes (same bowler cannot bowl consecutive overs).

---

## 3. Score Correction & Audit Logging

When an admin issues a score correction via `POST /api/matches/{id}/corrections`:
1. The original delivery payload and target state are archived in `score_correction_audit`.
2. Target delivery is replaced or updated in `deliveries`.
3. Inning totals, player statistics, and fall-of-wicket tables are recalculated deterministically.
4. Audit log entry is registered containing admin user ID, timestamp, original value, and corrected value.
