/* ==========================================================================
   AquaSaver Pro: Main MediaPipe Orchestrator & Snapping Cursor Module
   ========================================================================== */

// Global variables for camera stream management
window.activeWebcamStream = null;
window.activeCameraInstance = null;

const videoElement = document.getElementById("webcam");
const canvasElement = document.getElementById("camera-overlay");
const canvasCtx = canvasElement ? canvasElement.getContext("2d") : null;
const virtualCursor = document.getElementById("virtual-cursor");

// 1. Initialize MediaPipe Hands Core
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

hands.onResults(onHandTrackingResults);

function onHandTrackingResults(results) {
  if (!canvasElement || !canvasCtx || !videoElement) return;
  
  // Synchronize canvas proportions to matching video frame
  if (canvasElement.width !== videoElement.videoWidth) {
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
  }
  
  // Clear canvas overlay
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  
  const statusBadge = document.getElementById("camera-badge");
  const hudStatus = document.getElementById("hud-status");
  const hudGesture = document.getElementById("hud-gesture");
  
  // Handle hand detection outputs
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    if (statusBadge) {
      statusBadge.innerText = "Hand Connected";
      statusBadge.className = "badge badge-connected";
    }
    if (hudStatus) {
      hudStatus.innerText = "Hand Tracked";
      hudStatus.className = "hud-value status-detected";
    }
    
    const landmarks = results.multiHandLandmarks[0];
    
    // Draw Skeletal Connections on screen
    if (typeof drawConnectors === "function") {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: 'rgba(56, 189, 248, 0.45)', lineWidth: 3});
      drawLandmarks(canvasCtx, landmarks, {color: 'var(--primary-sky)', radius: (data) => data.from ? 4 : 2, lineWidth: 1});
    }
    
    // Scale-invariant hand calculations using Wrist (0) and Middle MCP (9)
    const wrist = landmarks[0];
    const middleMCP = landmarks[9];
    const handSize = Math.sqrt(
      Math.pow(wrist.x - middleMCP.x, 2) +
      Math.pow(wrist.y - middleMCP.y, 2) +
      Math.pow(wrist.z - middleMCP.z, 2)
    );
    
    // Distance calculator helper
    function dist(p1Idx, p2Idx) {
      const p1 = landmarks[p1Idx];
      const p2 = landmarks[p2Idx];
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
    }
    
    // Finger extension states (tip higher than PIP joint)
    const indexExtended = landmarks[8].y < landmarks[6].y;
    const middleExtended = landmarks[12].y < landmarks[10].y;
    const ringExtended = landmarks[16].y < landmarks[14].y;
    const pinkyExtended = landmarks[20].y < landmarks[18].y;
    const thumbExtended = dist(4, 5) > 0.45 * handSize;
    
    const indexFolded = !indexExtended;
    const middleFolded = !middleExtended;
    const ringFolded = !ringExtended;
    const pinkyFolded = !pinkyExtended;
    const thumbFolded = !thumbExtended;
    
    let detectedGesture = "None";
    
    // Pinch check (ratio between index tip 8 and thumb tip 4)
    const thumbIndexDist = dist(4, 8) / handSize;
    const isPinch = thumbIndexDist < 0.22;
    
    if (isPinch) {
      detectedGesture = "Pinch";
    } else if (indexExtended && middleFolded && ringFolded && pinkyFolded) {
      detectedGesture = "One Finger";
    } else if (indexExtended && middleExtended && ringFolded && pinkyFolded) {
      detectedGesture = "Two Fingers";
    } else if (indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended) {
      detectedGesture = "Open Palm";
    } else if (indexFolded && middleFolded && ringFolded && pinkyFolded && thumbFolded) {
      detectedGesture = "Fist";
    } else if (thumbExtended && indexFolded && middleFolded && ringFolded && pinkyFolded) {
      const isThumbPointingUp = landmarks[4].y < landmarks[3].y && landmarks[3].y < landmarks[2].y;
      if (isThumbPointingUp) {
        detectedGesture = "Thumbs Up";
      }
    }
    
    // Track cursor coordinates for standard moving cursor
    if (detectedGesture === "One Finger" || detectedGesture === "Pinch") {
      const indexTip = landmarks[8];
      window.targetCursorX = (1 - indexTip.x) * window.innerWidth;
      window.targetCursorY = indexTip.y * window.innerHeight;
    }
    
    // Split "One Finger" cursor position into top scroll / bottom scroll / move controls
    if (detectedGesture === "One Finger") {
      const topBoundary = window.innerHeight * 0.15;
      const bottomBoundary = window.innerHeight * 0.85;
      
      if (window.targetCursorY < topBoundary) {
        detectedGesture = "Page Up";
        window.scrollBy({ top: -14, behavior: 'auto' });
      } else if (window.targetCursorY > bottomBoundary) {
        detectedGesture = "Page Down";
        window.scrollBy({ top: 14, behavior: 'auto' });
      } else {
        detectedGesture = "Cursor Move";
      }
    }
    
    if (hudGesture) {
      hudGesture.innerText = detectedGesture;
      hudGesture.className = "hud-value gesture-active";
    }
    
    // Highlight active instruction rows
    if (typeof highlightGestureInstructionRow === "function") {
      highlightGestureInstructionRow(detectedGesture);
    }
    
    // Stability & Cooldown triggers
    const now = Date.now();
    if (now - window.lastActionTime < window.COOLDOWN_DURATION) {
      const pctLeft = ((now - window.lastActionTime) / window.COOLDOWN_DURATION) * 100;
      const cooldownBar = document.getElementById("cooldown-bar");
      if (cooldownBar) cooldownBar.style.width = `${100 - pctLeft}%`;
      return;
    }
    const cooldownBar = document.getElementById("cooldown-bar");
    if (cooldownBar) cooldownBar.style.width = "0%";
    
    if (detectedGesture !== "None") {
      if (window.currentHeldGesture === detectedGesture) {
        const elapsed = now - window.gestureHoldTimer;
        if (elapsed >= window.gestureHoldDuration) {
          if (typeof triggerGestureAction === "function") {
            triggerGestureAction(detectedGesture);
          }
          window.lastActionTime = now;
          window.currentHeldGesture = "None";
          window.gestureHoldTimer = null;
        }
      } else {
        window.currentHeldGesture = detectedGesture;
        window.gestureHoldTimer = now;
      }
    } else {
      window.currentHeldGesture = "None";
      window.gestureHoldTimer = null;
    }
    
  } else {
    // No hand tracked
    if (statusBadge) {
      statusBadge.innerText = "Camera Active";
      statusBadge.className = "badge badge-disconnected";
    }
    if (hudStatus) {
      hudStatus.innerText = "Searching Hand...";
      hudStatus.className = "hud-value status-searching";
    }
    if (hudGesture) {
      hudGesture.innerText = "None";
      hudGesture.className = "hud-value gesture-none";
    }
    if (typeof highlightGestureInstructionRow === "function") {
      highlightGestureInstructionRow("None");
    }
    
    window.currentHeldGesture = "None";
    window.gestureHoldTimer = null;
    const cooldownBar = document.getElementById("cooldown-bar");
    if (cooldownBar) cooldownBar.style.width = "0%";
  }
}

// 2. Custom Pointer Smoothing & Magnetic Snapping Loop
function animateCursorSmoothing() {
  if (!virtualCursor) return;
  
  let isSticky = false;
  let stickyX = window.targetCursorX;
  let stickyY = window.targetCursorY;
  
  // Detect elements under target coordinates
  const elementBelow = document.elementFromPoint(window.targetCursorX, window.targetCursorY);
  if (elementBelow) {
    const interactive = elementBelow.closest('button, a, input, select, textarea, .modal-close, .gesture-row, .clickable');
    
    if (interactive) {
      virtualCursor.classList.add("hovered");
      
      // Magnetic snap directly to absolute center of element
      const rect = interactive.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      stickyX = elementCenterX;
      stickyY = elementCenterY;
      isSticky = true;
    } else {
      virtualCursor.classList.remove("hovered");
    }
  } else {
    virtualCursor.classList.remove("hovered");
  }
  
  // Interpolation smoothing
  if (isSticky) {
    window.cursorX += (stickyX - window.cursorX) * 0.35; // Snappier attraction snap
    window.cursorY += (stickyY - window.cursorY) * 0.35;
  } else {
    window.cursorX += (window.targetCursorX - window.cursorX) * window.CURSOR_SMOOTHING;
    window.cursorY += (window.targetCursorY - window.cursorY) * window.CURSOR_SMOOTHING;
  }
  
  virtualCursor.style.left = `${window.cursorX}px`;
  virtualCursor.style.top = `${window.cursorY}px`;
  
  requestAnimationFrame(animateCursorSmoothing);
}
requestAnimationFrame(animateCursorSmoothing);

// 3. Programmatic Touchless Click Dispatcher
function performVirtualClick() {
  if (!virtualCursor) return;
  virtualCursor.classList.add("clicking");
  setTimeout(() => virtualCursor.classList.remove("clicking"), 150);
  
  const elementBelow = document.elementFromPoint(window.cursorX, window.cursorY);
  if (elementBelow) {
    const interactive = elementBelow.closest('button, a, input, select, textarea, .modal-close, .clickable');
    
    if (interactive) {
      interactive.click();
      interactive.focus(); // Securely focus text inputs
      AudioSynth.playClick();
    }
  }
}

// 4. Start / Stop / Toggle Live Webcam Streams Safely
function startCamera() {
  const statusBadge = document.getElementById("camera-badge");
  const toggleBtn = document.getElementById("camera-toggle-btn");
  
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480,
        facingMode: "user"
      }
    })
    .then((stream) => {
      window.activeWebcamStream = stream;
      videoElement.srcObject = stream;
      
      if (statusBadge) {
        statusBadge.innerText = "Camera Active";
        statusBadge.className = "badge badge-connected";
      }
      if (toggleBtn) {
        toggleBtn.innerHTML = '<span class="icon">📷</span> Camera On';
        toggleBtn.className = "btn btn-success glass btn-sm";
      }
      
      const camera = new Camera(videoElement, {
        onFrame: async () => {
          if (window.activeWebcamStream) {
            await hands.send({ image: videoElement });
          }
        },
        width: 640,
        height: 480
      });
      window.activeCameraInstance = camera;
      camera.start();
    })
    .catch((err) => {
      console.error("Camera access failed", err);
      if (statusBadge) {
        statusBadge.innerText = "Camera Failed";
        statusBadge.className = "badge badge-disconnected";
      }
      alert("Could not access your webcam. The simulation will continue with keyboard shortcuts enabled!");
      if (typeof enableKeyboardFallback === "function") {
        enableKeyboardFallback();
      }
    });
  } else {
    alert("Webcam API not supported in this browser. Keyboard shortcuts enabled as a fallback.");
    if (typeof enableKeyboardFallback === "function") {
      enableKeyboardFallback();
    }
  }
}

function stopCamera() {
  const statusBadge = document.getElementById("camera-badge");
  const toggleBtn = document.getElementById("camera-toggle-btn");
  const hudStatus = document.getElementById("hud-status");
  const hudGesture = document.getElementById("hud-gesture");
  
  console.log("Shutting down active webcam tracks...");
  
  if (window.activeWebcamStream) {
    window.activeWebcamStream.getTracks().forEach(track => track.stop());
    window.activeWebcamStream = null;
  }
  
  if (videoElement) {
    videoElement.srcObject = null;
  }
  
  if (canvasCtx && canvasElement) {
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }
  
  window.activeCameraInstance = null;
  
  if (statusBadge) {
    statusBadge.innerText = "Camera Off";
    statusBadge.className = "badge badge-disconnected";
  }
  if (toggleBtn) {
    toggleBtn.innerHTML = '<span class="icon">📷</span> Camera Off';
    toggleBtn.className = "btn btn-secondary glass btn-sm";
  }
  if (hudStatus) {
    hudStatus.innerText = "Camera Muted";
    hudStatus.className = "hud-value status-searching";
  }
  if (hudGesture) {
    hudGesture.innerText = "None";
    hudGesture.className = "hud-value gesture-none";
  }
  
  if (typeof updateFeedbackPanel === "function") {
    updateFeedbackPanel("info", "📷 Webcam Disabled! Hand tracking is paused. Switch the camera back ON or use keyboard simulation keys [O, P, R, T, F] to control!");
  }
}

function toggleCamera() {
  if (window.activeWebcamStream) {
    stopCamera();
  } else {
    startCamera();
  }
}

// Trigger initial webcam load on document loaded
window.addEventListener("DOMContentLoaded", () => {
  startCamera();
});
