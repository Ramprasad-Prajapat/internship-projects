# AquaSaver: Gesture-Controlled Save Water Simulator

AquaSaver is a highly interactive, environment-themed one-page web application that utilizes computer vision to promote water conservation. Users interact touchlessly with a leaking water tap simulator using bare hand gestures captured via their webcam.

---

## 🚀 Key Features

* **Touchless Hand Controls**: Complete interface control via MediaPipe Hands tracking (no mouse/keyboard required).
* **High-Fidelity UI**: Premium dark glassmorphism design with fluid drops and concentric ripple splash animations.
* **Realistic Sound Synthesizer**: Uses the native **Web Audio API** to generate synthesized flowing water sounds, clicking nodes, and success chimes dynamically (no external file dependencies).
* **Live Analytics**: Monitors Water Wasted, Water Saved, and calculates an Eco Score status in real-time.
* **Dynamic Resource Report**: A two-finger gesture triggers an overlay showing SVG impact charts, metrics, and ecological ratings.
* **Interactive Challenges & Credentials**: Earning the "Water Saver Hero" title lets you enter your name and export/download a high-resolution printable Canvas Certificate.

---

## 🤏 Hand Gestures Guide

| Gesture | Action | Meaning |
| :---: | :--- | :--- |
| **☝ One Finger** | Custom pointer tracking | Move virtual cursor around the screen. |
| **🤏 Pinch** | Virtual click / close tap | Press buttons, select modal items, and shut off leaking taps. |
| **✋ Open Palm** | Tap open | Start water leakage flow (increases wasted liters). |
| **✌ Two Fingers** | Resource report | Open or close the visual resource analytics modal. |
| **👍 Thumbs Up** | Complete challenge | Claim your Water Saver Hero badge and claim your certificate. |

---

## ⌨️ Keyboard & Mouse Fallback Controls
If a webcam is unavailable or in poorly lit environments, AquaSaver automatically loads keyboard fallbacks for exhibitions:

* **Mouse Movement**: Directs the virtual cursor.
* **Mouse Click**: Simulates a touchless pinch selector click.
* **`O` Key**: Simulates Open Palm gesture (Starts leakage flow).
* **`P` Key**: Simulates Pinch gesture (Closes tap / stops leakage).
* **`R` Key**: Simulates Two Fingers gesture (Toggles Resource Report modal).
* **`T` Key**: Simulates Thumbs Up gesture (Loads Challenge Accomplished modal).
* **`Esc` / Modal Close button**: Closes modal screens.

---

## 🛠️ Setup Instructions

1. Simply double-click `index.html` or run it via a local dev server (like Live Server or `python -m http.server 8000`).
2. Permit Webcam permissions when requested by the browser.
3. Position your hand **1–2 feet** away from the camera in a well-lit area.
4. Enjoy saving water touchlessly!
