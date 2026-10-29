# Known Limitations

- **No Backend / Database** – All data is stored in an in‑memory mock data store (`MockDataStore`). Data is lost when the app is closed or the emulator restarts.
- **Manual QR / OTP Entry Only** – The app does not use the device camera for scanning QR codes, nor does it send OTPs via SMS or email. Users must type the generated token manually.
- **No Persistent Storage** – No Room, DataStore, or SharedPreferences are used for persisting visitor, parcel, or authentication data.
- **No Multi‑Device Sync** – Each installation runs independently; there is no server‑side synchronization of state between devices.
- **Security Considerations** – Tokens are mock strings (e.g., `QR-XXXXXX`, `123456`). They are not cryptographically secure and should not be used in production.
- **Limited Error Handling** – Only basic validation is performed (e.g., duplicate check‑in prevention, status checks). Edge‑case handling is minimal.
- **No Push Notifications** – Notification history is simulated locally; real push notifications are not implemented.
- **No Production Deployment** – The project is intended as a demo/educational app and is not configured for production signing or distribution.
- **Camera Scanner Skipped** – As per project constraints, the QR scanner feature was omitted.
- **No External API Integration** – All functionality is self‑contained; no Retrofit, Firebase, Ktor, Spring Boot, or MySQL.

These limitations are intentional to keep the project mobile‑only and focused on the proof‑of‑concept workflow.

---
*Prepared for final submission.*
