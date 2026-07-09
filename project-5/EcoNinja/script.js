/* ==========================================
   1. SYNTHESIZED SOUND MODULE (Web Audio API)
   ========================================== */
class EcoAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSlash() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playCut() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  playEarthBoom() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.6);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  playLevelUp() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.18, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.3);
    });
  }

  playGameOver() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const notes = [440.00, 349.23, 329.63, 293.66];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(0.2, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.45);

      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.5);
    });
  }
}

const soundModule = new EcoAudio();


/* ==========================================
   2. REUSABLE CONFIG & GAME CONSTANTS
   ========================================== */
const GARBAGE_TYPES = [
  { emoji: '🧴', name: 'Plastic Bottle', points: 10, category: 'plastic' },
  { emoji: '🛍️', name: 'Plastic Bag', points: 15, category: 'plastic' },
  { emoji: '🥫', name: 'Tin Can', points: 10, category: 'metal' },
  { emoji: '🔋', name: 'Toxic Battery', points: 20, category: 'hazardous' },
  { emoji: '📦', name: 'Waste Box', points: 10, category: 'paper' },
  { emoji: '🧃', name: 'Juice Carton', points: 15, category: 'paper' },
  { emoji: '🧻', name: 'Paper Waste', points: 10, category: 'paper' },
  { emoji: '🗑️', name: 'Trash Wrapper', points: 10, category: 'general' }
];

const ECO_MESSAGES = [
  "🌱 Recycle plastic to protect our vulnerable oceans!",
  "🚮 Do not litter roads; utilize separate wet/dry dustbins.",
  "🌍 Protect our shared Earth to preserve a sustainable future.",
  "🚫 Say NO to single-use plastic bags & water bottles.",
  "🏡 Clean surroundings foster a healthy and happy society.",
  "♻️ Reduce, Reuse, Recycle - the ultimate green trio!",
  "⚡ Unplug devices when idle to save electrical energy.",
  "🌳 Plant trees to absorb carbon and release clean oxygen!"
];

const EARTH_OBJECT = { emoji: '🌍', name: 'Planet Earth', radius: 45 };
const GRAVITY = 0.12;


/* ==========================================
   3. SYSTEM CORE STATE & CONFIG
   ========================================== */
const state = {
  currentScreen: 'start',
  highScore: parseInt(localStorage.getItem('ecoNinjaHighScore') || '0'),
  score: 0,
  timeLeft: 180000, // 3 minutes in milliseconds
  level: 1,
  isPlaying: false,
  isPaused: false,
  comboCount: 0,
  lastCutTime: 0,
  comboTimeout: 450,
  objects: [],
  particles: [],
  popups: [],
  spawnTimer: 0,
  spawnInterval: 1200,
  lastSpawnTime: 0,
  slashPoints: [],
  maxTrailAge: 300,
  currentFingerX: 0,
  currentFingerY: 0,
  prevFingerX: 0,
  prevFingerY: 0,
  smoothedFingerX: 0,
  smoothedFingerY: 0,
  isSlashing: false,
  ecoTimer: 0,
  ecoInterval: 8000,
  lastEcoTime: 0
};


/* ==========================================
   4. GAME PHYSICS & OBJECT ENGINE
   ========================================== */
class LaunchableObject {
  constructor(canvasWidth, canvasHeight, isEarth = false) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.isEarth = isEarth;

    this.x = 80 + Math.random() * (canvasWidth - 160);
    this.y = canvasHeight + 60;
    this.isCut = false;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    this.scale = 1.0;

    if (this.isEarth) {
      this.emoji = EARTH_OBJECT.emoji;
      this.name = EARTH_OBJECT.name;
      this.points = 0;
      this.radius = EARTH_OBJECT.radius;
      this.vx = (Math.random() - 0.5) * 2.5;
      this.vy = -(9.5 + Math.random() * 2.0);
    } else {
      const base = GARBAGE_TYPES[Math.floor(Math.random() * GARBAGE_TYPES.length)];
      this.emoji = base.emoji;
      this.name = base.name;
      this.points = base.points;
      this.category = base.category;
      this.radius = 35;

      // Gradual speed increase: starts normal, increases with score, capped at maxSpeed
      // Items must reach high enough on screen to be visible and cuttable
      const baseSpeed = 0.85;
      const maxSpeed = 1.5;
      const speedMultiplier = Math.min(baseSpeed + state.score * 0.0012, maxSpeed);
      this.vx = (Math.random() - 0.5) * (3.2 * speedMultiplier);
      this.vy = -(10 + Math.random() * 3) * speedMultiplier;
    }
  }

  update(dt = 1) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += GRAVITY * dt;
    this.rotation += this.rotationSpeed * dt;

    if (this.isCut) {
      this.scale = Math.max(0, this.scale - 0.04 * dt);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Configure strong high-contrast drop shadow for physical items
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 5;

    // Font specifications
    ctx.font = `bold ${this.radius * 1.6}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (this.isCut) {
      // Side A: Left Splitting half
      ctx.save();
      ctx.translate(-25 * (1 - this.scale), 0);
      ctx.globalAlpha = this.scale;

      // Draw left half of the high-contrast backing bubble
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, Math.PI / 2, (3 * Math.PI) / 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fill();

      ctx.lineWidth = 3.5;
      ctx.strokeStyle = this.isEarth ? '#3498db' : '#27ae60';
      ctx.stroke();

      // Clip and draw left side of emoji text
      ctx.beginPath();
      ctx.rect(-(this.radius + 20), -(this.radius + 20), this.radius + 20, (this.radius + 20) * 2);
      ctx.clip();
      ctx.fillText(this.emoji, 0, 0);

      ctx.restore();

      // Side B: Right Splitting half
      ctx.save();
      ctx.translate(25 * (1 - this.scale), 0);
      ctx.globalAlpha = this.scale;

      // Draw right half of the high-contrast backing bubble
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, -Math.PI / 2, Math.PI / 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fill();

      ctx.lineWidth = 3.5;
      ctx.strokeStyle = this.isEarth ? '#3498db' : '#27ae60';
      ctx.stroke();

      // Clip and draw right side of emoji text
      ctx.beginPath();
      ctx.rect(0, -(this.radius + 20), this.radius + 20, (this.radius + 20) * 2);
      ctx.clip();
      ctx.fillText(this.emoji, 0, 0);

      ctx.restore();
    } else {
      // Uncut high-contrast bubble backing
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fill();

      ctx.lineWidth = 3.5;
      ctx.strokeStyle = this.isEarth ? '#3498db' : '#27ae60';
      ctx.stroke();

      // Extra glowing border indicator for the Earth danger item
      if (this.isEarth) {
        ctx.save();
        ctx.shadowColor = 'rgba(52, 152, 219, 0.8)';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Draw the centered Emoji on top of backing
      ctx.fillText(this.emoji, 0, 0);
    }

    ctx.restore();
  }

  isOutOfBounds() {
    return this.y > this.canvasHeight + 100 && this.vy > 0;
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() - 0.5) * 8 - 3;
    this.color = color || '#2ecc71';
    this.radius = 3 + Math.random() * 5;
    this.alpha = 1.0;
    this.decay = 0.02 + Math.random() * 0.02;
  }

  update(dt = 1) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 0.1 * dt;
    this.alpha -= this.decay * dt;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class FloatingPopup {
  constructor(x, y, text, color) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color || '#2ecc71';
    this.alpha = 1.0;
    this.vy = -1.2;
  }

  update(dt = 1) {
    this.y += this.vy * dt;
    this.alpha -= 0.025 * dt;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.font = 'bold 20px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}


/* ==========================================
   5. WEB INTERFACE SCREEN CONTROLLER
   ========================================== */
function formatTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const padZero = (num) => num.toString().padStart(2, '0');
  return `${padZero(minutes)}:${padZero(seconds)}`;
}

const UI = {
  startScreen: document.getElementById('start-screen'),
  gameScreen: document.getElementById('game-screen'),
  gameoverScreen: document.getElementById('gameover-screen'),
  pauseOverlay: document.getElementById('pause-overlay'),
  howToPlayModal: document.getElementById('how-to-play-modal'),
  hudScore: document.getElementById('hud-score'),
  hudLives: document.getElementById('hud-lives'),
  hudLevel: document.getElementById('hud-level'),
  startHighscoreVal: document.getElementById('start-highscore-val'),
  gameoverScore: document.getElementById('gameover-score'),
  gameoverHighscore: document.getElementById('gameover-highscore'),
  gameoverReasonText: document.getElementById('gameover-reason-text'),
  gameoverTitleText: document.getElementById('gameover-title-text'),
  ecoAlert: document.getElementById('eco-alert'),
  comboOverlay: document.getElementById('combo-overlay'),
  cameraCard: document.getElementById('camera-card'),
  webcamStatus: document.getElementById('webcam-status'),
  ecoCommitTitle: document.getElementById('eco-commitment-title'),
  ecoCommitMsg: document.getElementById('eco-commitment-msg'),
  btnStartGame: document.getElementById('btn-start-game'),
  btnHowToPlay: document.getElementById('btn-how-to-play'),
  btnModalClose: document.getElementById('btn-modal-close'),
  btnModalStart: document.getElementById('btn-modal-start'),
  btnHudPause: document.getElementById('btn-hud-pause'),
  btnHudSound: document.getElementById('btn-hud-sound'),
  btnHudRestart: document.getElementById('btn-hud-restart'),
  btnPauseResume: document.getElementById('btn-pause-resume'),
  btnGameoverRestart: document.getElementById('btn-gameover-restart'),
  btnGameoverHome: document.getElementById('btn-gameover-home'),

  init() {
    this.startHighscoreVal.textContent = state.highScore;

    this.btnStartGame.onclick = () => this.startGameplay();
    this.btnHowToPlay.onclick = () => this.toggleModal(true);
    this.btnModalClose.onclick = () => this.toggleModal(false);
    this.btnModalStart.onclick = () => {
      this.toggleModal(false);
      this.startGameplay();
    };

    this.btnHudPause.onclick = () => this.togglePause();
    this.btnPauseResume.onclick = () => this.togglePause();
    this.btnHudRestart.onclick = () => this.restartGame();
    this.btnGameoverRestart.onclick = () => this.restartGame();
    this.btnGameoverHome.onclick = () => this.exitToHome();

    this.btnHudSound.onclick = () => {
      soundModule.isMuted = !soundModule.isMuted;
      this.btnHudSound.textContent = soundModule.isMuted ? '🔇' : '🔊';
    };

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // ESC only closes the How-To-Play modal, does NOT close/exit the game
        if (this.howToPlayModal.classList.contains('active')) {
          this.toggleModal(false);
        }
      }
      if (e.key === ' ' || e.code === 'Space') {
        if (state.isPlaying) {
          e.preventDefault();
          this.togglePause();
        }
      }
      if (e.key === 'r' || e.key === 'R') {
        if (state.isPlaying) {
          this.restartGame();
        }
      }
    });
  },

  showScreen(screenId) {
    this.startScreen.classList.remove('active');
    this.gameScreen.classList.remove('active');
    this.gameoverScreen.classList.remove('active');
    this.pauseOverlay.classList.remove('active');

    if (screenId === 'start') {
      this.startScreen.classList.add('active');
      this.startHighscoreVal.textContent = state.highScore;
    } else if (screenId === 'game') {
      this.gameScreen.classList.add('active');
    } else if (screenId === 'gameover') {
      this.gameoverScreen.classList.add('active');
    }
    state.currentScreen = screenId;
  },

  toggleModal(show) {
    if (show) {
      this.howToPlayModal.classList.add('active');
    } else {
      this.howToPlayModal.classList.remove('active');
    }
  },

  startGameplay() {
    this.showScreen('game');
    soundModule.init();
    initGameEngine();
    initMediaPipeWebcam();
  },

  togglePause() {
    if (!state.isPlaying) return;
    state.isPaused = !state.isPaused;
    if (state.isPaused) {
      this.pauseOverlay.classList.add('active');
      this.btnHudPause.textContent = '▶️';
      this.cameraCard.classList.add('paused');
      this.webcamStatus.textContent = "GAME PAUSED";
    } else {
      this.pauseOverlay.classList.remove('active');
      this.btnHudPause.textContent = '⏸️';
      this.cameraCard.classList.remove('paused');
      this.webcamStatus.textContent = handTrackerActive ? "HAND ACTIVE" : "HAND DETECTING";
      soundModule.init();
    }
  },

  restartGame() {
    this.pauseOverlay.classList.remove('active');
    this.btnHudPause.textContent = '⏸️';
    this.cameraCard.classList.remove('paused');
    this.showScreen('game');
    initGameEngine();
  },

  exitToHome() {
    state.isPlaying = false;
    state.isPaused = false;
    this.pauseOverlay.classList.remove('active');
    this.btnHudPause.textContent = '⏸️';
    this.showScreen('start');
    stopMediaPipeWebcam();
  },

  triggerEcoAlert(msg) {
    this.ecoAlert.textContent = msg;
    this.ecoAlert.classList.add('active');
    setTimeout(() => {
      this.ecoAlert.classList.remove('active');
    }, 3200);
  },

  triggerComboPopup(combo) {
    let text = `Eco Combo x${combo}!`;
    if (combo >= 5) text = `♻️ Extreme Eco Combo x${combo}! ♻️`;

    this.comboOverlay.textContent = text;
    this.comboOverlay.classList.add('animate');
    setTimeout(() => {
      this.comboOverlay.classList.remove('animate');
    }, 600);
  },

  updateHUD() {
    this.hudScore.textContent = state.score;
    this.hudLevel.textContent = state.level;

    const formatted = formatTime(state.timeLeft);
    if (this.hudLives.textContent !== formatted) {
      this.hudLives.textContent = formatted;
    }
  },

  triggerGameOver(reason) {
    state.isPlaying = false;
    soundModule.playGameOver();

    if (state.score > state.highScore) {
      state.highScore = state.score;
      localStorage.setItem('ecoNinjaHighScore', state.highScore);
    }

    this.gameoverScore.textContent = state.score;
    this.gameoverHighscore.textContent = state.highScore;

    if (reason === 'earth') {
      this.gameoverTitleText.textContent = "Eco Devastation!";
      this.gameoverReasonText.innerHTML = "You slashed the <strong style='color:#3498db;'>Planet Earth (🌍)</strong>! Nature is hurt.";
      this.ecoCommitTitle.textContent = "🌍 The Earth is Our Core Home";
      this.ecoCommitMsg.textContent = "Slashed ecological markers represent immediate harm to biodiversity. The task of an Eco Ninja is strictly to eliminate pollution, never to damage the primary resources of life!";
    } else {
      this.gameoverTitleText.textContent = "Time's Up!";
      this.gameoverReasonText.innerHTML = "Your 3-minute cleaning shift has ended successfully.";
      this.ecoCommitTitle.textContent = "🚮 Clean Surroundings Matter";
      this.ecoCommitMsg.textContent = "Escaped garbage components sink into global oceans and soil. Continual daily clean-up schedules and structural recycling measures are required to defeat environmental waste.";
    }

    this.showScreen('gameover');
  }
};


/* ==========================================
   6. INTERACTIVE CANVAS & PHYSICS GAME ENGINE
   ========================================== */
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}
window.addEventListener('resize', resizeCanvas);

let lastTime = performance.now();

function initGameEngine() {
  resizeCanvas();

  state.score = 0;
  state.timeLeft = 180000;
  state.level = 1;
  state.isPlaying = true;
  state.isPaused = false;
  state.objects = [];
  state.particles = [];
  state.popups = [];
  state.slashPoints = [];
  state.comboCount = 0;
  state.lastCutTime = 0;
  state.spawnInterval = 1300;
  state.lastSpawnTime = Date.now();
  state.lastEcoTime = Date.now();
  lastTime = performance.now();

  UI.updateHUD();
  requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  if (!state.isPlaying) return;

  if (!timestamp) timestamp = performance.now();
  const elapsed = timestamp - lastTime;
  lastTime = timestamp;

  // Bound delta time multiplier
  const dt = Math.min(3.0, elapsed / 16.666);

  if (!state.isPaused) {
    updateGameObjects(dt);
    handleSpawning();
    handleEcoMessages();

    // Decrement timer
    state.timeLeft = Math.max(0, state.timeLeft - elapsed);
    UI.updateHUD();
    if (state.timeLeft <= 0) {
      UI.triggerGameOver('timeout');
    }
  }

  renderCanvas();
  requestAnimationFrame(gameLoop);
}

function updateGameObjects(dt) {
  state.objects.forEach((obj, idx) => {
    obj.update(dt);

    if (obj.isOutOfBounds()) {
      state.objects.splice(idx, 1);
    }
  });

  state.particles.forEach((part, idx) => {
    part.update(dt);
    if (part.alpha <= 0) {
      state.particles.splice(idx, 1);
    }
  });

  state.popups.forEach((pop, idx) => {
    pop.update(dt);
    if (pop.alpha <= 0) {
      state.popups.splice(idx, 1);
    }
  });

  const now = Date.now();
  state.slashPoints = state.slashPoints.filter(p => now - p.age < state.maxTrailAge);
}

function handleSpawning() {
  const now = Date.now();
  if (now - state.lastSpawnTime > state.spawnInterval) {
    state.lastSpawnTime = now;
    state.spawnInterval = Math.max(650, 1300 - (state.level - 1) * 200);

    const earthProb = Math.min(0.25, 0.08 + (state.level - 1) * 0.05);
    const isEarth = Math.random() < earthProb;

    state.objects.push(new LaunchableObject(canvas.width, canvas.height, isEarth));

    if (state.level >= 2 && Math.random() < 0.4) {
      setTimeout(() => {
        if (state.isPlaying && !state.isPaused) {
          state.objects.push(new LaunchableObject(canvas.width, canvas.height, false));
        }
      }, 250);
    }
  }
}

function handleEcoMessages() {
  const now = Date.now();
  if (now - state.lastEcoTime > state.ecoInterval) {
    state.lastEcoTime = now;
    const msg = ECO_MESSAGES[Math.floor(Math.random() * ECO_MESSAGES.length)];
    UI.triggerEcoAlert(msg);
  }
}

function renderCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGrad.addColorStop(0, '#e8f7ff');
  skyGrad.addColorStop(0.6, '#f1fff6');
  skyGrad.addColorStop(1, '#c0f7cd');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(46, 204, 113, 0.15)';
  ctx.beginPath();
  ctx.arc(canvas.width * 0.25, canvas.height + 200, canvas.width * 0.5, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = 'rgba(39, 174, 96, 0.12)';
  ctx.beginPath();
  ctx.arc(canvas.width * 0.75, canvas.height + 250, canvas.width * 0.6, Math.PI, 0);
  ctx.fill();

  state.objects.forEach(obj => obj.draw(ctx));
  state.particles.forEach(part => part.draw(ctx));
  state.popups.forEach(pop => pop.draw(ctx));

  if (state.slashPoints.length > 1) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#2ecc71';
    ctx.shadowBlur = 18;

    for (let i = 1; i < state.slashPoints.length; i++) {
      const p1 = state.slashPoints[i - 1];
      const p2 = state.slashPoints[i];
      const age = Date.now() - p1.age;
      const ratio = Math.max(0, 1 - age / state.maxTrailAge);

      ctx.strokeStyle = `rgba(46, 204, 113, ${ratio * 0.75})`;
      ctx.lineWidth = 10 * ratio;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      ctx.strokeStyle = `rgba(255, 255, 255, ${ratio * 0.95})`;
      ctx.lineWidth = 3.5 * ratio;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    ctx.restore();
  }
}


/* ==========================================
   7. COLLISION & SLICING INTERPOLATION
   ========================================== */
function registerSlashMovement(x, y) {
  if (!state.isPlaying || state.isPaused) return;

  state.prevFingerX = state.currentFingerX;
  state.prevFingerY = state.currentFingerY;
  state.currentFingerX = x;
  state.currentFingerY = y;

  const now = Date.now();
  state.slashPoints.push({ x, y, age: now });

  if (state.slashPoints.length > 18) {
    state.slashPoints.shift();
  }

  const dx = state.currentFingerX - state.prevFingerX;
  const dy = state.currentFingerY - state.prevFingerY;
  const speed = Math.sqrt(dx * dx + dy * dy);

  if (speed > 16) {
    if (!state.isSlashing) {
      state.isSlashing = true;
      soundModule.playSlash();
    }
    performCollisionCheck(state.prevFingerX, state.prevFingerY, state.currentFingerX, state.currentFingerY);
  } else {
    state.isSlashing = false;
  }
}

function performCollisionCheck(x1, y1, x2, y2) {
  state.objects.forEach(obj => {
    if (obj.isCut) return;

    const segments = 5;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;

      const dist = Math.sqrt((px - obj.x) * (px - obj.x) + (py - obj.y) * (py - obj.y));
      if (dist < obj.radius) {
        triggerCut(obj);
        break;
      }
    }
  });
}

function triggerCut(obj) {
  obj.isCut = true;

  if (obj.isEarth) {
    // Earth cut = IMMEDIATE Game Over! Environmental devastation!
    soundModule.playEarthBoom();
    createParticleBlast(obj.x, obj.y, '#e74c3c', 25);
    createParticleBlast(obj.x, obj.y, '#3498db', 25);
    state.popups.push(new FloatingPopup(obj.x, obj.y - 20, '🌍 Earth Destroyed!', '#e74c3c'));
    // Small delay for particle effect, then game over
    setTimeout(() => {
      if (state.isPlaying) { // Guard: prevent multiple game over calls
        UI.triggerGameOver('earth');
      }
    }, 400);
  } else {
    soundModule.playCut();

    const now = Date.now();
    if (now - state.lastCutTime < state.comboTimeout) {
      state.comboCount++;
    } else {
      state.comboCount = 1;
    }
    state.lastCutTime = now;

    const scoreBase = obj.points;
    const scoreAdded = scoreBase * state.comboCount;
    state.score += scoreAdded;

    let color = '#2ecc71';
    if (obj.category === 'plastic') color = '#3498db';
    if (obj.category === 'hazardous') color = '#f1c40f';
    if (obj.category === 'metal') color = '#bdc3c7';

    createParticleBlast(obj.x, obj.y, color, 14);

    let popText = `+${scoreAdded}`;
    if (state.comboCount > 1) {
      popText += ` (Combo x${state.comboCount})`;
      UI.triggerComboPopup(state.comboCount);
    }
    state.popups.push(new FloatingPopup(obj.x, obj.y - 20, popText, color));

    const targetLevel = Math.floor(state.score / 100) + 1;
    if (targetLevel > state.level) {
      state.level = targetLevel;
      soundModule.playLevelUp();
      state.popups.push(new FloatingPopup(canvas.width / 2, canvas.height / 3, `Level Up: Level ${state.level}! 🌱`, '#27ae60'));
    }

    UI.updateHUD();
  }
}

function createParticleBlast(x, y, color, qty) {
  for (let i = 0; i < qty; i++) {
    state.particles.push(new Particle(x, y, color));
  }
}

let isMouseDown = false;
canvas.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  state.currentFingerX = mx;
  state.currentFingerY = my;
});

canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
  state.isSlashing = false;
});

// Smooth cursor tracking variables for lag-free movement
let mouseTargetX = 0;
let mouseTargetY = 0;
let mouseSmoothX = 0;
let mouseSmoothY = 0;
let mouseOnCanvas = false;

// Independent lerp-based cursor smoothing loop (runs every frame)
function updateSmoothCursor() {
  if (mouseOnCanvas) {
    // Lerp factor 0.25: smooth cursor with minimal delay
    const lerpFactor = 0.25;
    mouseSmoothX += (mouseTargetX - mouseSmoothX) * lerpFactor;
    mouseSmoothY += (mouseTargetY - mouseSmoothY) * lerpFactor;
    state.currentFingerX = mouseSmoothX;
    state.currentFingerY = mouseSmoothY;
  }
  requestAnimationFrame(updateSmoothCursor);
}
updateSmoothCursor();

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseTargetX = e.clientX - rect.left;
  mouseTargetY = e.clientY - rect.top;
  mouseOnCanvas = true;

  if (isMouseDown) {
    registerSlashMovement(mouseTargetX, mouseTargetY);
  }
});

canvas.addEventListener('mouseleave', () => {
  isMouseDown = false;
  mouseOnCanvas = false;
  state.currentFingerX = 0;
  state.currentFingerY = 0;
});

canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length === 0) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  state.currentFingerX = touch.clientX - rect.left;
  state.currentFingerY = touch.clientY - rect.top;
});

canvas.addEventListener('touchmove', (e) => {
  if (e.touches.length === 0) return;
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const tx = touch.clientX - rect.left;
  const ty = touch.clientY - rect.top;
  registerSlashMovement(tx, ty);
});


/* ==========================================
   8. COMPUTER VISION SYSTEM (MediaPipe Hands)
   ========================================== */
const video = document.getElementById('webcam-feed');
let mediaStream = null;
let cameraInstance = null;
let handTrackerActive = false;
let lastHandLog = 0;

function initMediaPipeWebcam() {
  navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
    .then(stream => {
      mediaStream = stream;
      video.srcObject = stream;
      UI.webcamStatus.textContent = "CAMERA INITIALIZING";
      setupMediaPipeTracker();
    })
    .catch(err => {
      console.warn("Webcam access denied or unavailable. Fallback to mouse tracking active.", err);
      UI.webcamStatus.textContent = "MOUSE ONLY";
      UI.cameraCard.classList.add('no-hand');
    });
}

function setupMediaPipeTracker() {
  try {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6
    });

    hands.onResults(onMediaPipeResults);

    cameraInstance = new Camera(video, {
      onFrame: async () => {
        if (state.isPlaying && !state.isPaused) {
          await hands.send({ image: video });
        }
      },
      width: 320,
      height: 240
    });

    cameraInstance.start()
      .then(() => {
        handTrackerActive = true;
        UI.webcamStatus.textContent = "HAND ACTIVE";
        UI.cameraCard.classList.remove('no-hand');
      })
      .catch(err => {
        console.error("Camera tracker failure", err);
        UI.webcamStatus.textContent = "MOUSE ONLY";
        UI.cameraCard.classList.add('no-hand');
      });

  } catch (e) {
    console.error("MediaPipe initialization error", e);
    UI.webcamStatus.textContent = "MOUSE ONLY";
  }
}

function onMediaPipeResults(results) {
  if (!state.isPlaying || state.isPaused) return;

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    UI.cameraCard.classList.remove('no-hand');
    UI.webcamStatus.textContent = "HAND ACTIVE";

    const landmarks = results.multiHandLandmarks[0];

    // 2D distance calculation helper
    const getDistance = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

    const wrist = landmarks[0];

    // Distances from wrist to fingertips
    const dIndexTip = getDistance(wrist, landmarks[8]);
    const dMiddleTip = getDistance(wrist, landmarks[12]);
    const dRingTip = getDistance(wrist, landmarks[16]);
    const dPinkyTip = getDistance(wrist, landmarks[20]);

    // Distances from wrist to joints
    const dIndexPIP = getDistance(wrist, landmarks[6]);
    const dMiddlePIP = getDistance(wrist, landmarks[10]);
    const dRingPIP = getDistance(wrist, landmarks[14]);
    const dPinkyPIP = getDistance(wrist, landmarks[18]);

    // A finger is extended if its tip is further from the wrist than its PIP joint
    const indexUp = dIndexTip > dIndexPIP * 1.05;
    const middleDown = dMiddleTip < dMiddlePIP * 1.05 || dMiddleTip < dIndexTip * 0.85;
    const ringDown = dRingTip < dRingPIP * 1.05 || dRingTip < dIndexTip * 0.85;
    const pinkyDown = dPinkyTip < dPinkyPIP * 1.05 || dPinkyTip < dIndexTip * 0.85;

    // Index finger gesture is active if index is extended and middle, ring, pinky are folded/shorter
    const isSingleIndexFinger = indexUp && middleDown && ringDown && pinkyDown;

    if (isSingleIndexFinger) {
      // Use only index fingertip (landmark 8) as cursor position
      const indexTip = landmarks[8];

      // Map to canvas coordinates (mirrored X for camera)
      const targetX = canvas.width - (indexTip.x * canvas.width);
      const targetY = indexTip.y * canvas.height;

      // Initialize smoothed coordinates on first detection
      if (state.smoothedFingerX === 0 && state.smoothedFingerY === 0) {
        state.smoothedFingerX = targetX;
        state.smoothedFingerY = targetY;
      }

      // Smooth cursor using adaptive exponential filtering (reduces jitter/jumps)
      const dist = Math.sqrt((targetX - state.smoothedFingerX) ** 2 + (targetY - state.smoothedFingerY) ** 2);
      const alpha = 0.15 + Math.min(0.75, dist / 150);

      state.smoothedFingerX += (targetX - state.smoothedFingerX) * alpha;
      state.smoothedFingerY += (targetY - state.smoothedFingerY) * alpha;

      // Register smoothed position for slicing collision detection
      registerSlashMovement(state.smoothedFingerX, state.smoothedFingerY);
    } else {
      // Palm, fist, multiple fingers, or any non-single-index gesture = NO cutting
      state.isSlashing = false;
    }

  } else {
    UI.cameraCard.classList.add('no-hand');
    UI.webcamStatus.textContent = "HAND DETECTING";
    state.isSlashing = false;
  }
}

function stopMediaPipeWebcam() {
  try {
    if (cameraInstance) {
      cameraInstance.stop();
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
  } catch (e) {
    console.warn("Stopping camera failed, continuing.", e);
  }
  handTrackerActive = false;
  UI.webcamStatus.textContent = "WEBCAM OFF";
  UI.cameraCard.classList.add('no-hand');
}

UI.init();
