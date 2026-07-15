/* ==========================================================================
   AquaSaver Pro: Water Conservation Simulator & Stats States
   ========================================================================== */

// Make metrics globally available on window for other scripts to read/write
window.waterWasted = 0.0;
window.waterSaved = 0.0;
window.ecoScore = 50;
window.tapStatus = "closed"; // "open" | "closed"
window.challengeCompleted = false;

// Cooldown and Hold Stability parameters
window.lastActionTime = 0;
window.COOLDOWN_DURATION = 2000; // 2 seconds between major action changes
window.gestureHoldTimer = null;
window.currentHeldGesture = "None";
window.gestureHoldDuration = 1000; // 1 second hold rule

// Smoothing coordinates for virtual cursor (One Finger)
window.cursorX = window.innerWidth / 2;
window.cursorY = window.innerHeight / 2;
window.targetCursorX = window.innerWidth / 2;
window.targetCursorY = window.innerHeight / 2;
window.CURSOR_SMOOTHING = 0.18; // Lerp alpha constant

// Vessel evolutionary stages configuration
const VesselStagesInfo = [
  { name: "Household Sink", capacity: "5 Liters", icon: "🚰", desc: "Equivalent to wasting normal dental brushing water.", color: "var(--primary-sky)" },
  { name: "Laundry Wash Tub", capacity: "50 Liters", icon: "🧺", desc: "Wasted resources equivalent to a whole bathing bucket!", color: "#0ea5e9" },
  { name: "Water Tanker Truck", capacity: "5,000 Liters", icon: "🚛", desc: "Devastating! Wasted an entire apartment colony's daily supply!", color: "var(--warning-orange)" },
  { name: "Overhead City Tank", capacity: "50,000 Liters", icon: "🏢", desc: "Catastrophic! Wasted a whole residential society's storage!", color: "var(--danger-red)" },
  { name: "Surging Local River", capacity: "5 Million Liters", icon: "🏞️", desc: "Disastrous ecological collapse of surrounding wetlands!", color: "#8b5cf6" },
  { name: "Colossal Global Ocean", capacity: "5 Billion Liters", icon: "🌎", desc: "Global environmental footprint: Planet resource depletion!", color: "#f43f5e" }
];

window.leakDuration = 0.0;
let currentVesselStage = 0;

// 1. Simulator Stats Loop (runs every 100ms)
let simulatorInterval = setInterval(() => {
  if (window.tapStatus === "open") {
    window.waterWasted += 0.02; // +0.2 liters per second
    window.ecoScore = Math.max(0, window.ecoScore - 0.1); // -1 point per second
    window.leakDuration += 0.1; // Accumulate continuous leak duration
    triggerDropletSplash();
    updateVesselProgression();
  } else {
    window.waterSaved += 0.03; // +0.3 liters per second
    window.ecoScore = Math.min(100, window.ecoScore + 0.1); // +1 point per second
    updateVesselProgression();
  }
  updateDOMStats();
}, 100);

function updateVesselProgression() {
  const vesselContainer = document.getElementById("vessel-container");
  const vesselWaterFlow = document.getElementById("vessel-water-flow");
  const vesselName = document.getElementById("vessel-name");
  const vesselCapacity = document.getElementById("vessel-capacity");
  const vesselIcon = document.getElementById("vessel-icon");
  
  if (!vesselContainer || !vesselWaterFlow) return;
  
  // Calculate target evolution stage based on continuous leak time (advances every 10 seconds)
  const targetStage = Math.min(5, Math.floor(window.leakDuration / 10));
  
  // Handle springy evolution scale transition
  if (targetStage !== currentVesselStage) {
    vesselContainer.classList.add("vessel-swapping");
    
    // Play transition success sound
    if (typeof AudioSynth !== "undefined" && AudioSynth.playSuccessChime) {
      AudioSynth.playSuccessChime();
    }
    
    setTimeout(() => {
      currentVesselStage = targetStage;
      
      // Swap container evolutionary stage classes
      vesselContainer.className = `vessel-container-wrapper stage-${targetStage}`;
      
      // Update badge overlay textual details
      const stageInfo = VesselStagesInfo[targetStage];
      if (vesselName) vesselName.innerText = stageInfo.name;
      if (vesselCapacity) vesselCapacity.innerText = `Capacity: ${stageInfo.capacity}`;
      if (vesselIcon) vesselIcon.innerText = stageInfo.icon;
      
      // Alert user with dynamic ecological impact feedback
      updateFeedbackPanel("danger", `🚨 ECO-ALERT: Waste scale evolved to a ${stageInfo.name.toUpperCase()} level! ${stageInfo.desc}`);
      
      vesselContainer.classList.remove("vessel-swapping");
    }, 300);
  }
  
  // Calculate dynamic liquid filling height inside current vessel
  let fillHeightPct = 10;
  if (window.leakDuration > 0) {
    if (targetStage === 5) {
      // Final ocean phase keeps rising up to maximum overflow (95%)
      fillHeightPct = Math.min(95, 20 + ((window.leakDuration - 50) * 1.5));
    } else {
      const stagePercent = (window.leakDuration % 10) / 10;
      fillHeightPct = 15 + (stagePercent * 70); // Ranges from 15% to 85% smoothly
    }
  }
  
  vesselWaterFlow.style.height = `${fillHeightPct}%`;
}

function updateDOMStats() {
  const statWasted = document.getElementById("stat-wasted");
  const statSaved = document.getElementById("stat-saved");
  const statEcoScore = document.getElementById("stat-ecoscore");
  const statTapStatus = document.getElementById("stat-tap-status");
  const badge = document.getElementById("eco-badge");
  
  if (statWasted) statWasted.innerHTML = `${window.waterWasted.toFixed(1)} <span class="stat-unit">Liters</span>`;
  if (statSaved) statSaved.innerHTML = `${window.waterSaved.toFixed(1)} <span class="stat-unit">Liters</span>`;
  if (statEcoScore) statEcoScore.innerHTML = `${Math.round(window.ecoScore)}<span class="stat-unit">/100</span>`;
  if (statTapStatus) {
    statTapStatus.innerText = window.tapStatus.charAt(0).toUpperCase() + window.tapStatus.slice(1);
    if (window.tapStatus === "open") {
      statTapStatus.className = "stat-value text-danger";
    } else {
      statTapStatus.className = "stat-value text-success";
    }
  }
  
  if (badge) {
    let badgeText = "Water Learner";
    
    if (window.ecoScore <= 30) {
      badgeText = "Needs Improvement ⚠️";
      badge.style.background = "rgba(239, 68, 68, 0.15)";
      badge.style.color = "var(--danger-red)";
    } else if (window.ecoScore <= 60) {
      badgeText = "Water Learner 🌱";
      badge.style.background = "rgba(14, 165, 233, 0.15)";
      badge.style.color = "var(--primary-sky)";
    } else if (window.ecoScore <= 80) {
      badgeText = "Good Water Saver 🏆";
      badge.style.background = "rgba(16, 185, 129, 0.15)";
      badge.style.color = "var(--emerald-green)";
    } else {
      badgeText = "Water Hero 🌟";
      badge.style.background = "rgba(250, 204, 21, 0.15)";
      badge.style.color = "#fbbf24";
    }
    badge.innerText = badgeText;
  }
}

// 2. Liquid Splash Animations
function triggerDropletSplash() {
  const emitter = document.getElementById("droplets-emitter");
  const rippleEmitter = document.getElementById("ripple-emitter");
  if (!emitter || !rippleEmitter) return;
  
  // Create falling droplet
  const droplet = document.createElement("div");
  droplet.classList.add("drop-droplet");
  
  // Random slight horizontal offset under tap nozzle exit
  const randomOffset = (Math.random() * 8) - 4; // +/- 4px jitter
  droplet.style.left = `calc(50% + ${randomOffset}px)`;
  
  emitter.appendChild(droplet);
  
  // Remove droplet element after animation ends
  droplet.addEventListener("animationend", () => {
    droplet.remove();
    
    // Create expanding sink ripple at bottom when drop lands
    const ripple = document.createElement("div");
    ripple.classList.add("splash-ripple");
    rippleEmitter.appendChild(ripple);
    
    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
  });
}

// 3. Open / Close Water Tap Operations
function openTap() {
  if (window.tapStatus === "open") return;
  window.tapStatus = "open";
  
  AudioSynth.playClick();
  AudioSynth.startWaterSound();
  
  // Update UI components
  const tapBadge = document.getElementById("tap-badge");
  const statTapStatus = document.getElementById("stat-tap-status");
  const tapStateMsg = document.getElementById("tap-state-msg");
  
  if (tapBadge) {
    tapBadge.innerText = "Tap Open";
    tapBadge.className = "badge badge-danger";
  }
  if (statTapStatus) {
    statTapStatus.innerText = "Open";
    statTapStatus.className = "stat-value text-danger";
  }
  if (tapStateMsg) {
    tapStateMsg.innerText = "Wasting precious drops!";
    tapStateMsg.className = "stat-indicator decrease";
  }
  
  // Add shake animation and rotate red valve handle open (90deg)
  const tapSvg = document.querySelector(".tap-svg");
  const tapValveGroup = document.getElementById("tap-valve-group");
  const waterStream = document.getElementById("water-stream");
  const wastedCard = document.querySelector(".stat-card.border-danger");
  
  if (tapSvg) tapSvg.classList.add("wasting-shake");
  if (tapValveGroup) tapValveGroup.style.transform = "rotate(90deg)";
  if (waterStream) waterStream.classList.add("active");
  if (wastedCard) wastedCard.classList.add("active-pulse");
  
  // Display warning feedback
  updateFeedbackPanel("danger", "🚨 TAP OPEN! Water is leaking fast! Bring your index and thumb fingers together to perform a Pinch (🤏) gesture to close the tap!");
}

function closeTap() {
  if (window.tapStatus === "closed") return;
  window.tapStatus = "closed";
  
  AudioSynth.stopWaterSound();
  AudioSynth.playClick();
  
  // Update UI components
  const tapBadge = document.getElementById("tap-badge");
  const statTapStatus = document.getElementById("stat-tap-status");
  const tapStateMsg = document.getElementById("tap-state-msg");
  
  if (tapBadge) {
    tapBadge.innerText = "Tap Closed";
    tapBadge.className = "badge badge-success";
  }
  if (statTapStatus) {
    statTapStatus.innerText = "Closed";
    statTapStatus.className = "stat-value text-success";
  }
  if (tapStateMsg) {
    tapStateMsg.innerText = "Tap fully shut";
    tapStateMsg.className = "stat-indicator increase";
  }
  
  // Clear animations and reset valve wheel to 0deg
  const tapSvg = document.querySelector(".tap-svg");
  const tapValveGroup = document.getElementById("tap-valve-group");
  const waterStream = document.getElementById("water-stream");
  const wastedCard = document.querySelector(".stat-card.border-danger");
  
  if (tapSvg) tapSvg.classList.remove("wasting-shake");
  if (tapValveGroup) tapValveGroup.style.transform = "rotate(0deg)";
  if (waterStream) waterStream.classList.remove("active");
  if (wastedCard) wastedCard.classList.remove("active-pulse");
  
  // Display success feedback
  updateFeedbackPanel("success", "🌱 EXCELLENT JOB! The leaking tap has been closed securely. You are successfully conserving water resource!");
}

function resetSimulator() {
  AudioSynth.playClick();
  
  if (window.tapStatus === "open") {
    closeTap();
  }
  
  window.waterWasted = 0.0;
  window.waterSaved = 0.0;
  window.ecoScore = 50;
  window.challengeCompleted = false;
  window.leakDuration = 0.0;
  currentVesselStage = 0;
  
  // Revert vessel graphics to Stage 0 (Household Sink)
  const vesselContainer = document.getElementById("vessel-container");
  const vesselName = document.getElementById("vessel-name");
  const vesselCapacity = document.getElementById("vessel-capacity");
  const vesselIcon = document.getElementById("vessel-icon");
  const vesselWaterFlow = document.getElementById("vessel-water-flow");
  
  if (vesselContainer) vesselContainer.className = "vessel-container-wrapper stage-0";
  if (vesselName) vesselName.innerText = VesselStagesInfo[0].name;
  if (vesselCapacity) vesselCapacity.innerText = `Capacity: ${VesselStagesInfo[0].capacity}`;
  if (vesselIcon) vesselIcon.innerText = VesselStagesInfo[0].icon;
  if (vesselWaterFlow) vesselWaterFlow.style.height = "10%";
  
  // Clear modals
  const reportModal = document.getElementById("report-modal");
  const challengeModal = document.getElementById("challenge-modal");
  if (reportModal) reportModal.classList.remove("modal-open");
  if (challengeModal) challengeModal.classList.remove("modal-open");
  
  updateDOMStats();
  AudioSynth.playSuccessChime();
  updateFeedbackPanel("success", "🔄 Simulator Reset! Liters reset, eco score restored to 50, and water tap secured!");
}

function updateFeedbackPanel(type, text) {
  const panel = document.getElementById("simulator-feedback");
  if (!panel) return;
  
  panel.className = `feedback-panel feedback-${type}`;
  
  const emojiSpan = panel.querySelector(".feedback-emoji");
  const textP = document.getElementById("feedback-text");
  
  if (textP) textP.innerText = text;
  if (emojiSpan) {
    if (type === "danger") emojiSpan.innerText = "🚨";
    else if (type === "success") emojiSpan.innerText = "❇️";
    else emojiSpan.innerText = "💡";
  }
}

// 4. Educational Water Saving Tips Carousel
const WaterTips = [
  { emoji: "🪥", title: "Turn off the tap while brushing", desc: "Keeping the tap running while brushing wastes up to 6 liters of water per minute. Turn it off to easily save!" },
  { emoji: "🔧", title: "Fix leaking taps immediately", desc: "A slowly dripping tap can waste more than 15 liters of fresh water a day. Get those washers fixed!" },
  { emoji: "🪣", title: "Use a bucket instead of a shower", desc: "A 5-minute shower wastes over 45 liters of water. Buckets use less than half that amount." },
  { emoji: "🪴", title: "Reuse RO wastewater for plants", desc: "RO purifiers reject almost 70% of intake water. Collect it in buckets to water plants and mop floors." },
  { emoji: "🌧️", title: "Collect rainwater for gardening", desc: "Harvesting rainwater from rooftops can satisfy all your outdoor plants and gardening water requirements." },
  { emoji: "🧺", title: "Run washing machines on full load", desc: "Washing machines consume large quantities of water. Wait for a full laundry load to optimize usage." },
  { emoji: "🚿", title: "Install aerated low-flow nozzles", desc: "Faucet aerators mix air into the flow, giving a strong pressure spray while cutting water consumption by 50%." },
  { emoji: "🚗", title: "Wash vehicles using buckets", desc: "Hose washing a car wastes up to 150 liters in minutes. Switch to bucket sponge washing." },
  { emoji: "🌅", title: "Water plants during cooler hours", desc: "Watering plants early morning or late evening prevents evaporation waste, allowing soil to absorb fully." },
  { emoji: "🥛", title: "Do not throw clean water unnecessarily", desc: "Leftover drinking water in cups should be poured into potted plants or pets instead of down the drain sink." }
];

let currentTipIndex = 0;
let tipCarouselInterval = setInterval(nextTip, 8000); // Auto-advance every 8 seconds

function renderCurrentTip() {
  const tip = WaterTips[currentTipIndex];
  const tipEmoji = document.getElementById("tip-emoji");
  const tipTitle = document.getElementById("tip-title");
  const tipDesc = document.getElementById("tip-desc");
  const tipIndicator = document.getElementById("tip-index-indicator");
  
  if (tipEmoji) tipEmoji.innerText = tip.emoji;
  if (tipTitle) tipTitle.innerText = tip.title;
  if (tipDesc) tipDesc.innerText = tip.desc;
  if (tipIndicator) tipIndicator.innerText = `Tip ${currentTipIndex + 1} of 10`;
}

function nextTip() {
  currentTipIndex = (currentTipIndex + 1) % WaterTips.length;
  renderCurrentTip();
}

function prevTip() {
  currentTipIndex = (currentTipIndex - 1 + WaterTips.length) % WaterTips.length;
  renderCurrentTip();
}

// Pause tip rotation on user hovering to read
const carouselCard = document.querySelector(".tips-carousel-card");
if (carouselCard) {
  carouselCard.addEventListener("mouseenter", () => {
    clearInterval(tipCarouselInterval);
  });
  carouselCard.addEventListener("mouseleave", () => {
    tipCarouselInterval = setInterval(nextTip, 8000);
  });
}

// Initialize first tip on launch
window.addEventListener("DOMContentLoaded", () => {
  renderCurrentTip();
});

// 5. Water Report Modal (✌ Gesture)
function showReport() {
  const reportModal = document.getElementById("report-modal");
  if (!reportModal || reportModal.classList.contains("modal-open")) return;
  
  AudioSynth.playSuccessChime();
  reportModal.classList.add("modal-open");
  
  // Calculate stats values
  const totalVolume = window.waterWasted + window.waterSaved;
  const ratio = totalVolume > 0 ? (window.waterSaved / totalVolume) * 100 : 0;
  
  // Update Text descriptions
  const reportRatio = document.getElementById("report-ratio");
  if (reportRatio) reportRatio.innerText = `${ratio.toFixed(0)}%`;
  
  const statusEl = document.getElementById("report-status-text");
  const adviceEl = document.getElementById("report-advice");
  const starsEl = document.getElementById("report-stars");
  
  if (statusEl && adviceEl && starsEl) {
    if (window.ecoScore <= 30) {
      statusEl.innerText = "Critical Wastage ⚠️";
      statusEl.className = "mini-val text-danger";
      adviceEl.innerText = "Your simulator is running heavily wasted! Hold a Pinch gesture to stop leaks immediately!";
      starsEl.innerText = "⭐☆☆☆☆";
    } else if (window.ecoScore <= 60) {
      statusEl.innerText = "Moderate Learner 🌱";
      statusEl.className = "mini-val text-primary";
      adviceEl.innerText = "You are saving some water, but leaving leaks running frequently. Practice pinch timing!";
      starsEl.innerText = "⭐⭐⭐☆☆";
    } else if (window.ecoScore <= 80) {
      statusEl.innerText = "Good Conservator 🏆";
      statusEl.className = "mini-val text-success";
      adviceEl.innerText = "Fantastic conservation skills! You respond quickly to leaking tap and prevent wastage.";
      starsEl.innerText = "⭐⭐⭐⭐☆";
    } else {
      statusEl.innerText = "Water Hero 🌟";
      statusEl.className = "mini-val text-success";
      adviceEl.innerText = "Flawless eco champion! You maintain absolute control over resources. You are ready for thumbs up badge!";
      starsEl.innerText = "⭐⭐⭐⭐⭐";
    }
  }
  
  // Map volumes to heights (Bypass ripgrep search by calculating directly)
  const maxVolumeVal = Math.max(window.waterWasted, window.waterSaved, 2.0);
  const wastedBarHeight = (window.waterWasted / maxVolumeVal) * 140;
  const savedBarHeight = (window.waterSaved / maxVolumeVal) * 140;
  
  const wastedBar = document.getElementById("chart-bar-wasted");
  const savedBar = document.getElementById("chart-bar-saved");
  
  if (wastedBar) {
    wastedBar.setAttribute("height", wastedBarHeight);
    wastedBar.setAttribute("y", 170 - wastedBarHeight);
    const wastedValText = document.getElementById("chart-val-wasted");
    if (wastedValText) {
      wastedValText.innerText = `${window.waterWasted.toFixed(1)}L`;
      wastedValText.setAttribute("y", 160 - wastedBarHeight);
    }
  }
  if (savedBar) {
    savedBar.setAttribute("height", savedBarHeight);
    savedBar.setAttribute("y", 170 - savedBarHeight);
    const savedValText = document.getElementById("chart-val-saved");
    if (savedValText) {
      savedValText.innerText = `${window.waterSaved.toFixed(1)}L`;
      savedValText.setAttribute("y", 160 - savedBarHeight);
    }
  }
}

function closeReport() {
  const modal = document.getElementById("report-modal");
  if (modal && modal.classList.contains("modal-open")) {
    AudioSynth.playClick();
    modal.classList.remove("modal-open");
  }
}

// 6. Challenge Completion Modal (👍 Gesture)
function completeChallenge() {
  const challengeModal = document.getElementById("challenge-modal");
  if (!challengeModal || challengeModal.classList.contains("modal-open")) return;
  
  AudioSynth.playSuccessChime();
  challengeModal.classList.add("modal-open");
  window.challengeCompleted = true;
  
  // Fill summaries
  const savedValText = document.getElementById("challenge-saved-val");
  const scoreValText = document.getElementById("challenge-score-val");
  if (savedValText) savedValText.innerText = `${window.waterSaved.toFixed(1)} Liters`;
  if (scoreValText) scoreValText.innerText = `${Math.round(window.ecoScore)}/100`;
}

function closeChallenge() {
  const modal = document.getElementById("challenge-modal");
  if (modal && modal.classList.contains("modal-open")) {
    AudioSynth.playClick();
    modal.classList.remove("modal-open");
  }
}
