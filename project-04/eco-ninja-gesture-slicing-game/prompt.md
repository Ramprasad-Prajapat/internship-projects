# Eco Ninja - Project Prompt & Synthesis Guide

This document serves as the high-fidelity development prompt to regenerate, explain, or showcase the core characteristics of **Eco Ninja**. It can be utilized directly with LLMs, code generation engines, or in project presentation portfolios.

---

## 📋 Project Objective

Build a fully client-side, zero-install interactive canvas game called **Eco Ninja**. The application must merge real-time computer vision (using webcam feeds via MediaPipe Hands) with custom high-speed 2D physics animation to create a fruit-ninja-like slicing mechanics focused on environmental cleaning and garbage collection.

---

## 🎨 Theme & Aesthetic System

* **Vibe:** Clean, modern, ecological, cheerful, and visually stunning.
* **Palette:**
  * **Primary Teal Sky:** `linear-gradient(180deg, #dff9fb 0%, #e8fff1 60%, #a8eba9 100%)`
  * **Interactive Accents:** Glowing primary green (`#2ecc71`) slash trails with a white high-contrast core.
  * **Decorations:** Floating leaves animated across the background viewport.
* **Layout Structure:** Full-screen glassmorphism panel overlay (`#app-container`) featuring absolute-positioned status overlays on top of the interactive game canvas.
* **Footer Credits:** Modern glassmorphic bottom footer credit panels on start and game over screens featuring the development brand signature: **Digital Hammerr**.

---

## 🛠️ Key Technical Specifications

### 1. Client-Side Landmark Mapping (MediaPipe)
* **Libraries:** Load `@mediapipe/camera_utils` and `@mediapipe/hands` directly from jsDelivr CDN.
* **Landmark Target:** Index finger tip coordinate (landmark index `8`).
* **Model Optimization:** Set `modelComplexity: 0` for extremely fast CPU/GPU landmark processing, avoiding lagging or browser hangs.
* **Mirroring & Adaptive Velocity Smoothing:** Mirror the X coordinate. Smooth coordinates using an adaptive velocity-based exponential filter:
  * Computes distance `dist` between target tip and current smoothed position.
  * Adjusts alpha: `alpha = 0.20 + Math.min(0.80, dist / 100)`.
  * Allows slow movements to be perfectly steady/tremor-free, and rapid movements to have zero latency.
* **Gesture Mapping:**
  * **Speed Check:** Compute distance between current and previous frame finger position. If distance is greater than 16px, trigger high-speed slash and play WHOOSH synthesizer sounds.
  * **Palm Gesture (Pause):** Calculate average finger tip distance relative to wrist landmark `0`. If distance exceeds `0.42` for more than 2 seconds, toggle game pause state.
  * **Two Fingers Gesture (Resume):** Detect when index and middle fingers are extended (`landmarks[8].y < landmarks[6].y` and `landmarks[12].y < landmarks[10].y`) while ring and pinky fingers are curled down, toggling game resume.

### 2. Math-based Audio Engine (Web Audio API Synth)
To prevent network request latencies or local missing asset issues, all game audio feedback must be dynamically synthesized in real-time using oscillator nodes:
* **Slash Whoosh:** Rapid frequency downward sweep (`800Hz` to `120Hz` exponentially) over a duration of 150ms.
* **Clean Garbage Cut:** Sharp triangle wave frequency downsweep (`1200Hz` to `300Hz`) over a duration of 100ms.
* **Earth Collision Boom:** Resonant sawtooth wave frequency downsweep (`150Hz` to `40Hz`) over 600ms duration.
* **Level Up Arpeggio:** Uplifting major arpeggio sequence (C4 -> E4 -> G4 -> C5) with staggered time delays.
* **Defeat Chime:** Descending minor pentatonic progression (A4 -> F4 -> E4 -> D4) with long decays.

### 3. Gameplay Entity Physics & Animation
* **Framerate-independent Physics (Delta-Time):** Scale all updates (movement, gravity, particle rotation, text fades) by a normalized delta time multiplier `dt` (normalized to 60 FPS) to maintain constant game speed and buttery smooth movements during framerate drops.
* **High-Contrast Bubble Framing:** Emojis are drawn centered over a high-visibility white backing bubble (`rgba(255, 255, 255, 0.95)`) bordered in forest green (for garbage) or ocean blue (for Earth) to guarantee visibility on light backgrounds.
* **Dynamic Slicing Split:** When sliced, both the white backing bubble and the emoji split dynamically into left and right half arcs and glide apart before fading.
* **Gravity Factor:** `0.12` pixels per frame squared for a smooth, high-performance, and perfectly-balanced floating effect.
* **Spawn Intervals:** Starts at `1300ms`, scaling down to `650ms` based on levels (escalating every 100 points).
* **Launch Velocity:** Balanced horizontal components and responsive upward launch velocities to keep play action engaging yet reachable.
* **Collision Check:** Calculate intersection between index blade movement vector (interpolated into 5 subsegments) and the circle boundaries of active garbage nodes.
* **The Earth Danger (🌍):** Has a 10-25% spawn chance. Slicing the Earth results in immediate environmental gameover with custom committed alerts.
