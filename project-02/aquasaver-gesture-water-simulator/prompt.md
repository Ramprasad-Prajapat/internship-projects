# Project Spec: AquaSaver (Gesture-Controlled Save Water Simulator)

This document is a comprehensive, self-contained prompt specification blueprint for **AquaSaver**, an environment awareness web application controlled entirely through computer vision touchless hand tracking.

---

## 1. Project Overview & Core Intent

**AquaSaver** is an interactive, premium single-page web app designed for public LED displays, exhibitions, and educational platforms. Users control a virtual leaking water tap and navigate the interface using natural hand gestures captured by a mirrored webcam feed.

### Core Objectives:
* **Interactive Water Simulation**: An animated central SVG water faucet that drips/pours based on tap status.
* **Real-Time Dashboards**: Metrics showing Wasted Liters (increasing while open), Saved Liters (increasing while closed), and a dynamic Eco Score (`0` to `100`).
* **Zero-Asset Sound Design**: Organic water flow and mechanical click sounds generated on the fly via the browser's native **Web Audio API**.
* **Pristine Glassmorphism UI**: High-contrast, glowing, fluid, modern dark-themed web environment.
* **Touchless Certificate Generation**: An exportable, custom-drawn high-res canvas credential recognizing the user's achievements.

---

## 2. Technical Stack & Libraries

* **Structure**: Semantic HTML5 (Single Page Application layout).
* **Styling**: Vanilla CSS3 (Custom properties, Flexbox/Grid, Glassmorphic variables, Neon drop shadows, Backdrop filters).
* **Logic**: Vanilla ES6+ Javascript (Strict local scope, Web Audio API, Canvas rendering context 2D).
* **Computer Vision**: CDNs for Google MediaPipe:
  * Camera Utilities: `https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js`
  * Hands Core: `https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js`
  * Drawing Utilities: `https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js`

---

## 3. Gesture Controls Matrix & Mathematical Mappings

The gesture tracking system interprets a mirrored webcam stream and translates 21 multi-dimensional landmark coordinates into exact commands:

| Command / Control | Hand Gesture Method | Mathematical Hand Classification Rule | Action / System Response |
| :--- | :--- | :--- | :--- |
| **Cursor Move** | `☝ One Finger` | Index extended; Middle, Ring, Pinky folded; Cursor in **middle 70%** of screen. | Moves a custom neon-ring virtual pointer across the viewport. |
| **Page Up** | `☝ Cursor top zone hold` | Index extended, others folded; Cursor held in the **top 15%** of screen. | Continuously scrolls viewport up (`-14px` per frame). Highlights Row. |
| **Page Down** | `☝ Cursor bottom zone hold` | Index extended, others folded; Cursor held in the **bottom 15%** of screen. | Continuously scrolls viewport down (`+14px` per frame). Highlights Row. |
| **Select / click** | `🤏 Pinch` | Index tip (landmark 8) and Thumb tip (landmark 4) distance ratio `< 0.22`. | Performs virtual click on elements under cursor; shuts off faucet if open. |
| **Start tap** | `✋ Open Palm` | All five fingers (Thumb, Index, Middle, Ring, Pinky) fully extended upward. | Opens the water tap valve; starts leakage sound and wastes liters. |
| **Show report** | `✌ Two Fingers` | Index and Middle extended; Ring, Pinky, and Thumb folded. | Toggles the dynamic SVG resource comparison bar graph modal. |
| **Reset** | `✊ Fist` | All five fingers folded inward (landmark tips closer to wrist than knuckles). | Resets statistics, closes modals, seals faucet valve (dialog-free). |
| **Finish** | `👍 Thumbs Up` | Thumb extended pointing up; Index, Middle, Ring, Pinky folded inward. | Complete Challenge, activates the Badge page, and opens Certificate inputs. |

### Classification Variables:
* **Finger Extension**: Tips are higher than the corresponding PIP joints (smaller Y-coordinate values in MediaPipe coordinate space):
  $$\text{fingerExtended} = \text{Landmark}_{\text{Tip}}.y < \text{Landmark}_{\text{PIP}}.y$$
* **Pinch Distance**: Ratio of distance between landmark 4 and landmark 8 relative to hand bounding box sizes:
  $$\text{PinchRatio} = \frac{\sqrt{(x_8 - x_4)^2 + (y_8 - y_4)^2 + (z_8 - z_4)^2}}{\text{HandSize}} < 0.22$$

---

## 4. Advanced System Features

### A. Magnetic Snapping Virtual Cursor (Secure Click)
To prevent hand shake and cursor drift during a Pinch activation, the cursor uses a sticky snapping algorithm:
1. **Interactive Detection**: Detects if the virtual pointer's target coordinates lie close to or hover over interactive elements: `button, a, input, select, textarea, .modal-close, .gesture-row, .clickable`.
2. **Snapping Coordinate Snap**: If detected, the target coordinates smoothly interpolate to the absolute center of the bounding rectangle of the target element:
   $$\text{stickyX} = \text{rect.left} + \frac{\text{rect.width}}{2}$$
   $$\text{stickyY} = \text{rect.top} + \frac{\text{rect.height}}{2}$$
3. **Pinch Focus Lock**: Clicking focuses the interactive text field (`cert-user-name`) touchlessly, permitting clean virtual input typing.

### B. High-Fidelity Audio Synthesizer (Web Audio API)
* **Organic Water Leakage Trickle**:
  * Generated on the fly using a **White Noise Buffer Source Node**.
  * Fed through a **BiquadFilterNode** set to `bandpass`.
  * Frequency modulated dynamically using a low-frequency oscillator (**OscillatorNode** running a sine wave) to synthesize organic splashing ripples.
* **Tap Mechanical Click**:
  * Low-frequency triangle wave oscillator combined with an exponential gain decay curve to emulate valve closure clicks.
* **Chime Arpeggios**:
  * Multi-frequency arpeggiator triggering a 5-tone pentatonic success scale on game completions.

### C. Luxury Dark-Mode Glassmorphism Visual Tokens
* **Background Atmosphere**: Deepspace gradients (`#090d16` to `#05070c`) accented with floating background glowing radial spotlight orbs.
* **Component Styling**: `.glass-card` blocks constructed using:
  * `background: rgba(13, 20, 38, 0.45)`
  * `backdrop-filter: blur(20px)`
  * `border: 1px solid rgba(56, 189, 248, 0.15)`
* **Hover Dynamics**: Hovering floats components upward (`translateY(-4px)`) and projects broad, responsive cyan glowing shadows (`box-shadow: 0 8px 30px rgba(56, 189, 248, 0.25)`).
* **Active Neon Rows**: The matching rows in the gesture directory pulse in real-time, translating slightly right (`translateX(6px)`) with bright neon outlines and emerald glowing borders.

### D. High-Resolution Certificate Exporter
* Draws an off-screen HTML5 **Canvas rendering context 2D** at $1200 \times 800$ pixels.
* Incorporates a luxury gold border (`#fbbf24`), ornamental cyan corner badges, a glowing digital logo header, custom director and alliance signature scribbles, and dynamically overlays the user's typed name, wasted liters, and final Eco Rating before initiating an automatic local `.png` download.

---

## 5. Developer Testing & Keyboard Fallback Map

If a webcam is unavailable or testing is done in low-light exhibition rooms, direct keyboard simulation hooks trigger all gesture state-machine actions:
* `O` ➔ Simulates **Open Palm** (Opens faucet / Starts wasting)
* `P` ➔ Simulates **Pinch** (Clicks hovered button / Closes faucet)
* `R` ➔ Simulates **Two Fingers** (Toggles Resource Report modal)
* `T` ➔ Simulates **Thumbs Up** (Triggers Gold Badge modal)
* `F` ➔ Simulates **Fist** (Instant statistics reset)
* `U` ➔ Simulates **Page Up Zone Hold** (Viewport scrolls upward)
* `D` ➔ Simulates **Page Down Zone Hold** (Viewport scrolls downward)
* **Mouse movement** smoothly acts as the virtual cursor target pointer coordinate.
