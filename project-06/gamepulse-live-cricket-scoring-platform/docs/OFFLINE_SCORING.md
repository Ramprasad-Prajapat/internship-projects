# GamePulse Live — Offline Scoring Architecture

## 1. Local Match Caching (IndexedDB)
When a scorer opens a match on the mobile Scorer Panel, the active match state and playing XI details are cached locally in browser IndexedDB via `matchCache.js`.

---

## 2. Offline Ball Recording Queue
If network connection drops during live scoring:
1. The Scorer Panel detects `navigator.onLine === false`.
2. Ball delivery payloads are saved into an offline IndexedDB queue (`offline_balls_queue`).
3. The Scorer Panel UI displays an offline status badge ("📡 Offline — 3 balls queued").

---

## 3. Background Synchronization
When internet connectivity is restored (`window.addEventListener('online')`):
1. The background sync worker processes queued delivery payloads sequentially in FIFO order.
2. Deliveries are transmitted to `POST /api/matches/{id}/score`.
3. Upon successful HTTP 200 response, the local item is purged from the IndexedDB queue and UI re-syncs with server state.
