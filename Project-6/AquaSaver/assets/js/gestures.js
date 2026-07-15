/* ==========================================================================
   AquaSaver Pro: Gesture Classifiers & Keyboard Shortcuts Module
   ========================================================================== */

// 1. Highlight Matching Row in the Left Column Directory
function highlightGestureInstructionRow(gesture) {
  const rows = ["cursor", "scroll-up", "scroll-down", "pinch", "palm", "report", "reset", "thumbsup"];
  rows.forEach(r => {
    const el = document.getElementById(`gesture-row-${r}`);
    if (el) el.classList.remove("active-matching");
  });
  
  if (gesture === "Cursor Move" || gesture === "One Finger") {
    const row = document.getElementById("gesture-row-cursor");
    if (row) row.classList.add("active-matching");
  } else if (gesture === "Page Up") {
    const row = document.getElementById("gesture-row-scroll-up");
    if (row) row.classList.add("active-matching");
  } else if (gesture === "Page Down") {
    const row = document.getElementById("gesture-row-scroll-down");
    if (row) row.classList.add("active-matching");
  } else if (gesture === "Pinch") {
    const row = document.getElementById("gesture-row-pinch");
    if (row) row.classList.add("active-matching");
  } else if (gesture === "Open Palm") {
    const row = document.getElementById("gesture-row-palm");
    if (row) row.classList.add("active-matching");
  } else if (gesture === "Two Fingers") {
    const row = document.getElementById("gesture-row-report");
    if (row) row.classList.add("active-matching");
  } else if (gesture === "Fist") {
    const row = document.getElementById("gesture-row-reset");
    if (row) row.classList.add("active-matching");
  } else if (gesture === "Thumbs Up") {
    const row = document.getElementById("gesture-row-thumbsup");
    if (row) row.classList.add("active-matching");
  }
}

// 2. Route Gesture triggers to simulator actions
function triggerGestureAction(gesture) {
  console.log(`Action triggered for gesture: ${gesture}`);
  
  if (gesture === "Pinch") {
    if (typeof performVirtualClick === "function") {
      performVirtualClick();
    }
    if (window.tapStatus === "open") {
      closeTap();
    }
  } else if (gesture === "Open Palm") {
    openTap();
  } else if (gesture === "Two Fingers") {
    const reportModal = document.getElementById("report-modal");
    if (reportModal) {
      if (reportModal.classList.contains("modal-open")) {
        closeReport();
      } else {
        showReport();
      }
    }
  } else if (gesture === "Thumbs Up") {
    const challengeModal = document.getElementById("challenge-modal");
    if (challengeModal) {
      if (challengeModal.classList.contains("modal-open")) {
        closeChallenge();
      } else {
        completeChallenge();
      }
    }
  } else if (gesture === "Fist") {
    resetSimulator();
  }
}

// 3. Fallback Keyboard Bindings Loop
function enableKeyboardFallback() {
  console.log("Keyboard fallback controls active: [O] Open Palm, [P] Pinch/Close, [R] Two Fingers/Report, [T] Thumbs Up, [F] Fist/Reset, [U]/[D] Scroll Up/Down");
  
  if (typeof updateFeedbackPanel === "function") {
    updateFeedbackPanel("info", "⌨️ Keyboard Fallback active! [O]=Open Palm, [P]=Pinch, [R]=Report, [T]=Thumbs Up, [F]=Fist (Reset), [U]/[D]=Scroll Up/Down.");
  }
  
  // Mouse coordinates track virtual cursor position
  window.addEventListener("mousemove", (e) => {
    window.targetCursorX = e.clientX;
    window.targetCursorY = e.clientY;
  });
  
  window.addEventListener("click", () => {
    if (typeof performVirtualClick === "function") {
      performVirtualClick();
    }
  });
  
  window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    
    if (key === "o") {
      highlightGestureInstructionRow("Open Palm");
      triggerGestureAction("Open Palm");
    } else if (key === "p") {
      highlightGestureInstructionRow("Pinch");
      triggerGestureAction("Pinch");
    } else if (key === "r") {
      highlightGestureInstructionRow("Two Fingers");
      triggerGestureAction("Two Fingers");
    } else if (key === "t") {
      highlightGestureInstructionRow("Thumbs Up");
      triggerGestureAction("Thumbs Up");
    } else if (key === "f") {
      highlightGestureInstructionRow("Fist");
      triggerGestureAction("Fist");
    } else if (key === "u") {
      highlightGestureInstructionRow("Page Up");
      window.scrollBy({ top: -220, behavior: 'smooth' });
    } else if (key === "d") {
      highlightGestureInstructionRow("Page Down");
      window.scrollBy({ top: 220, behavior: 'smooth' });
    }
  });
}
