# GamePulse Live — Tournament Management Specification

## 1. Supported Formats

1. **`ROUND_ROBIN`**: Every team plays every other team once (or twice for double round robin).
2. **`KNOCKOUT`**: Single-elimination tree bracket. Winners advance to subsequent rounds.
3. **`GROUPS_KNOCKOUT`**: Teams divided into Pool A and Pool B. Top 2 from each group advance to Semi-Finals and Finals.

---

## 2. Points Table & Standings Rules

Standard League Point Distribution:
- **Win**: 2 Points
- **Tie / No Result**: 1 Point
- **Loss**: 0 Points

---

## 3. Net Run Rate (NRR) Formula

Net Run Rate is calculated for each team across all completed matches in a tournament:

$$\text{NRR} = \left( \frac{\text{Total Runs Scored}}{\text{Total Overs Faced}} \right) - \left( \frac{\text{Total Runs Conceded}}{\text{Total Overs Bowled}} \right)$$

### All-Out Rule Adjustment
If a team is dismissed (all 10 wickets lost) before completing their allocated overs limit, their **overs faced** for NRR calculation is rounded up to the full innings limit (e.g. 20.0 overs for a T20 match).
