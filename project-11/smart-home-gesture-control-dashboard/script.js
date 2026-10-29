/* ============================================================
   Smart Home Control Using Hand Signs — script.js
   HTML + CSS + JS only. MediaPipe Tasks Vision via CDN (ESM).
   Manual controls work fully even without the camera.
   ============================================================ */

import {
  GestureRecognizer,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";

/* ---------------- Default data ---------------- */
const DEFAULT_DEVICES = [
  { id:1, name:"Living Room Light", room:"Living Room", type:"Light",    icon:"💡", status:false, value:80,  unit:"%",      lastUpdated:"Not used yet" },
  { id:2, name:"Bedroom Fan",       room:"Bedroom",     type:"Fan",      icon:"🌀", status:false, value:2,   unit:"Speed",  lastUpdated:"Not used yet" },
  { id:3, name:"Kitchen Light",     room:"Kitchen",     type:"Light",    icon:"💡", status:false, value:70,  unit:"%",      lastUpdated:"Not used yet" },
  { id:4, name:"Study Lamp",        room:"Study Room",  type:"Light",    icon:"📚", status:false, value:90,  unit:"%",      lastUpdated:"Not used yet" },
  { id:5, name:"Hall AC",           room:"Hall",        type:"AC",       icon:"❄️", status:false, value:24,  unit:"°C",     lastUpdated:"Not used yet" },
  { id:6, name:"Smart TV",          room:"Living Room", type:"TV",       icon:"📺", status:false, value:30,  unit:"Volume", lastUpdated:"Not used yet" },
  { id:7, name:"Bedroom Curtain",   room:"Bedroom",     type:"Curtain",  icon:"🪟", status:false, value:0,   unit:"%",      lastUpdated:"Not used yet" },
  { id:8, name:"Main Door Lock",    room:"Main Door",   type:"Security", icon:"🔒", status:true,  value:100, unit:"Locked", lastUpdated:"Not used yet" },
];

const ROOMS = [
  { name:"Living Room", icon:"🛋️" },
  { name:"Bedroom",     icon:"🛏️" },
  { name:"Kitchen",     icon:"🍳" },
  { name:"Study Room",  icon:"📚" },
  { name:"Hall",        icon:"❄️" },
  { name:"Main Door",   icon:"🚪" },
];

const allowedGestures = [
  { name:"Open Palm",  action:"Turn ON selected device",  icon:"🖐️" },
  { name:"Fist",       action:"Turn OFF selected device", icon:"✊" },
  { name:"Thumb Up",   action:"Increase device value",    icon:"👍" },
  { name:"Thumb Down", action:"Decrease device value",    icon:"👎" },
  { name:"OK Sign",    action:"Confirm setting",          icon:"👌" },
];
const allowedGestureNames = allowedGestures.map(g => g.name);

/* Scenes (bonus feature) */
const SCENES = [
  { id:"all_on",  name:"All On",     icon:"🌟", desc:"Turn every device ON" },
  { id:"all_off", name:"All Off",    icon:"🌙", desc:"Turn every device OFF" },
  { id:"movie",   name:"Movie Mode", icon:"🎬", desc:"TV on, lights dim, curtains close" },
  { id:"night",   name:"Good Night", icon:"😴", desc:"Everything off, door locked" },
  { id:"away",    name:"Away Mode",  icon:"🚶", desc:"All off & secure the home" },
  { id:"morning", name:"Good Morning",icon:"☀️", desc:"Lights on, curtains open" },
];

/* Energy cost per device type (watts when ON, simulated) */
const ENERGY = { Light:40, Fan:55, AC:1200, TV:90, Curtain:15, Security:5 };

/* ---------------- State ---------------- */
const LS_KEY = "smartHomeGesture_v1";
let state = {
  devices: structuredClone(DEFAULT_DEVICES),
  selectedDeviceId: null,
  selectedRoom: null,
  logs: [],
  settings: {
    gestureEnabled: true,
    voiceEnabled: true,
    theme: "dark",
    confidenceThreshold: 75,
    stableTime: 1500,
    cooldownTime: 2000,
  },
};

/* Gesture detection runtime */
let lastGesture = "";
let stableStartTime = null;
let cooldownActive = false;
let cameraOn = false;

/* ---------------- LocalStorage ---------------- */
function save() { localStorage.setItem(LS_KEY, JSON.stringify(state)); }
function load() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return;
  try {
    const s = JSON.parse(raw);
    if (s.devices) state.devices = s.devices;
    if (s.selectedDeviceId !== undefined) state.selectedDeviceId = s.selectedDeviceId;
    if (s.selectedRoom !== undefined) state.selectedRoom = s.selectedRoom;
    if (s.logs) state.logs = s.logs;
    if (s.settings) state.settings = { ...state.settings, ...s.settings };
  } catch (e) { console.warn("Bad saved data", e); }
}

/* ---------------- Helpers ---------------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const getDevice = id => state.devices.find(d => d.id === id);
const selectedDevice = () => getDevice(state.selectedDeviceId);
function nowTime() {
  const d = new Date();
  let h = d.getHours(), m = String(d.getMinutes()).padStart(2,"0");
  const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

/* ---------------- Toast + Voice + status ---------------- */
function toast(msg, type = "", title = "") {
  const wrap = $("#toastWrap");
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = (title ? `<b>${title}</b>` : "") + `<small>${msg}</small>`;
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 3200);
}
function speak(text) {
  if (!state.settings.voiceEnabled || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1; u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch (e) { /* ignore */ }
}
function setCommandStatus(text, cls = "muted") {
  const el = $("#stCommand");
  el.textContent = text;
  el.className = cls;
}

/* ---------------- Logs ---------------- */
function addLog({ source, gesture, room, device, action, status = "Success" }) {
  state.logs.unshift({ time: nowTime(), source, gesture, room, device, action, status });
  if (state.logs.length > 200) state.logs.pop();
  save();
  renderLogs();
}
function renderLogs() {
  const body = $("#logBody");
  $("#logCount").textContent = `${state.logs.length} entries`;
  if (!state.logs.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="7">No activity yet. Control a device to see logs here.</td></tr>`;
    return;
  }
  body.innerHTML = state.logs.map(l => {
    const srcTag = l.source === "Gesture" ? "tag-gesture" : l.source === "Scene" ? "tag-scene" : "tag-manual";
    const stTag = l.status === "Success" ? "tag-success" : "tag-blocked";
    return `<tr>
      <td>${l.time}</td>
      <td><span class="tag ${srcTag}">${l.source}</span></td>
      <td>${l.gesture || "—"}</td>
      <td>${l.room}</td>
      <td>${l.device}</td>
      <td>${l.action}</td>
      <td><span class="tag ${stTag}">${l.status}</span></td>
    </tr>`;
  }).join("");
}

/* ============================================================
   DEVICE ACTIONS
   ============================================================ */
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function deviceRange(type) {
  switch (type) {
    case "Light":   return { min:0,  max:100, step:10 };
    case "Curtain": return { min:0,  max:100, step:10 };
    case "Fan":     return { min:1,  max:5,   step:1  };
    case "AC":      return { min:16, max:30,  step:1  };
    case "TV":      return { min:0,  max:100, step:5  };
    default:        return { min:0,  max:100, step:5  };
  }
}

function turnOn(dev, source, gesture) {
  if (dev.type === "Security") return securityBlock(source);
  dev.status = true;
  dev.lastUpdated = nowTime();
  finalizeAction(dev, source, gesture, `Turned ON`);
  speak(`${dev.name} turned on.`);
}
function turnOff(dev, source, gesture) {
  if (dev.type === "Security") return securityBlock(source);
  dev.status = false;
  dev.lastUpdated = nowTime();
  finalizeAction(dev, source, gesture, `Turned OFF`);
  speak(`${dev.name} turned off.`);
}
function changeValue(dev, dir, source, gesture) {
  if (dev.type === "Security") return securityBlock(source);
  const r = deviceRange(dev.type);
  const before = dev.value;
  dev.value = clamp(dev.value + dir * r.step, r.min, r.max);
  if (dev.value === before) { toast(`${dev.name} already at ${dir>0?"max":"min"}.`, "warn"); return; }
  if (!dev.status && dir > 0) dev.status = true; // increasing turns it on
  dev.lastUpdated = nowTime();
  const label = valueLabel(dev.type, dir);
  finalizeAction(dev, source, gesture, `${label} (${dev.value}${unitShort(dev)})`);
  speak(`${dev.name} ${label.toLowerCase()}.`);
}
function valueLabel(type, dir) {
  const up = dir > 0;
  switch (type) {
    case "Light":   return up ? "Brightness Increased" : "Brightness Decreased";
    case "Fan":     return up ? "Speed Increased" : "Speed Decreased";
    case "AC":      return up ? "Temperature Increased" : "Temperature Decreased";
    case "TV":      return up ? "Volume Increased" : "Volume Decreased";
    case "Curtain": return up ? "Opened More" : "Closed More";
    default:        return up ? "Increased" : "Decreased";
  }
}
function unitShort(dev) {
  if (dev.unit === "%") return "%";
  if (dev.unit === "°C") return "°C";
  return " " + dev.unit;
}
function securityBlock(source) {
  const msg = "For safety, door lock can only be controlled manually.";
  toast(msg, "error", "Blocked");
  speak(msg);
  setCommandStatus("Door lock is manual-only", "bad");
  addLog({ source, gesture: source === "Gesture" ? lastGesture : "Button", room:"Main Door", device:"Main Door Lock", action:"Gesture blocked", status:"Blocked" });
}

/* Manual-only door toggle */
function toggleDoor(source = "Manual") {
  const dev = state.devices.find(d => d.type === "Security");
  dev.status = !dev.status;
  dev.value = dev.status ? 100 : 0;
  dev.unit = dev.status ? "Locked" : "Unlocked";
  dev.lastUpdated = nowTime();
  finalizeAction(dev, source, null, dev.status ? "Door Locked" : "Door Unlocked");
  speak(dev.status ? "Main door locked." : "Main door unlocked.");
}

function finalizeAction(dev, source, gesture, actionText) {
  save();
  renderDevices(); renderRooms(); renderHomeStats(); renderQuickPanel();
  addLog({ source, gesture: gesture || (source === "Gesture" ? lastGesture : "Button"), room: dev.room, device: dev.name, action: actionText });
  toast(`${dev.name}: ${actionText}`, "success", source === "Gesture" ? "Gesture Action" : "Device Updated");
  // refresh open modal if it belongs to this room
  if ($("#roomModal").classList.contains("show") && openRoomName === dev.room) openRoomDetail(dev.room, true);
}

/* Apply a gesture to the selected device */
function applyGestureToDevice(gestureName, source = "Gesture") {
  const dev = selectedDevice();
  if (!dev) { toast("Please select a device first.", "warn"); setCommandStatus("Select a device first", "warn"); return; }

  if (dev.type === "Security") { securityBlock(source); return; }

  switch (gestureName) {
    case "Open Palm":  turnOn(dev, source, gestureName); break;
    case "Fist":       turnOff(dev, source, gestureName); break;
    case "Thumb Up":   changeValue(dev, +1, source, gestureName); break;
    case "Thumb Down": changeValue(dev, -1, source, gestureName); break;
    case "OK Sign":    toast(`Setting confirmed for ${dev.name}.`, "success", "Confirmed"); speak("Setting confirmed."); addLog({source, gesture:gestureName, room:dev.room, device:dev.name, action:"Setting Confirmed"}); break;
    default: toast("Unknown gesture ignored.", "warn");
  }
}

/* ---------------- Select device ---------------- */
function selectDevice(id) {
  state.selectedDeviceId = id;
  const dev = getDevice(id);
  state.selectedRoom = dev.room;
  save();
  renderDevices(); renderState(); renderQuickPanel(); renderHomeStats();
  toast(`${dev.name} selected.`, "success", "Device Selected");
  speak(`${dev.name} selected.`);
}

/* ============================================================
   RENDERING
   ============================================================ */
function renderDevices() {
  const grid = $("#deviceGrid");
  const q = ($("#deviceSearch")?.value || "").toLowerCase();
  const list = state.devices.filter(d =>
    d.name.toLowerCase().includes(q) || d.room.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)
  );
  grid.innerHTML = list.map(d => {
    const sel = d.id === state.selectedDeviceId;
    const isSec = d.type === "Security";
    const onTxt = isSec ? (d.status ? "LOCKED" : "UNLOCKED") : (d.status ? "ON" : "OFF");
    const badgeCls = isSec ? (d.status ? "badge-on" : "badge-off") : (d.status ? "badge-on" : "badge-off");
    return `
    <div class="device-card ${sel ? "selected":""} ${d.status?"on":""}" data-id="${d.id}">
      ${sel ? `<span class="badge badge-sel">✔ Selected</span>` : ""}
      <div class="dc-top">
        <span class="dc-ico">${d.icon}</span>
        <div><div class="dc-name">${d.name}</div><div class="dc-room">📍 ${d.room} · ${d.type}</div></div>
      </div>
      <div class="dc-meta">
        <div><div class="label">Status</div><span class="badge ${badgeCls}">${onTxt}</span></div>
        <div style="text-align:right"><div class="label">${valUnitLabel(d)}</div><div class="dc-value">${valDisplay(d)}</div></div>
      </div>
      <div class="dc-updated">🕒 Last updated: ${d.lastUpdated}</div>
      <div class="dc-actions">
        <button class="btn btn-primary dc-select" data-act="select" data-id="${d.id}">${sel?"✔ Selected":"Select Device"}</button>
        ${isSec ? `
          <button class="btn ${d.status?"btn-danger":"btn-ghost"}" data-act="door" data-id="${d.id}" style="grid-column:1/-1">${d.status?"🔓 Unlock Door":"🔒 Lock Door"}</button>
        ` : `
          <button class="btn ${d.status?"btn-danger":"btn-ghost"}" data-act="toggle" data-id="${d.id}">${d.status?"Turn OFF":"Turn ON"}</button>
          <button class="btn btn-ghost" data-act="confirmsel" data-id="${d.id}">Set Selected</button>
          <button class="btn btn-ghost" data-act="dec" data-id="${d.id}">➖ Decrease</button>
          <button class="btn btn-ghost" data-act="inc" data-id="${d.id}">➕ Increase</button>
        `}
      </div>
    </div>`;
  }).join("") || `<p class="muted">No devices match your search.</p>`;
}
function valUnitLabel(d) {
  if (d.type === "Security") return "Lock";
  return d.unit === "%" ? "Level" : d.unit;
}
function valDisplay(d) {
  if (d.type === "Security") return d.status ? "🔒" : "🔓";
  if (d.unit === "%") return d.value + "%";
  if (d.unit === "°C") return d.value + "°";
  return d.value;
}

function roomInfo(roomName) {
  const devs = state.devices.filter(d => d.room === roomName);
  const active = devs.filter(d => d.type !== "Security" && d.status).length;
  const inactive = devs.filter(d => d.type !== "Security" && !d.status).length;
  const sec = devs.find(d => d.type === "Security");
  let status = active > 0 ? "Active" : "Idle";
  let badge = active > 0 ? "badge-active" : "badge-idle";
  if (sec) {
    status = sec.status ? "Secured" : "Unsecured";
    badge = sec.status ? "badge-secured" : "badge-unsecured";
  }
  const energy = devs.reduce((sum,d) => sum + (d.status && d.type!=="Security" ? (ENERGY[d.type]||0) : 0), 0);
  return { devs, active, inactive, total: devs.length, status, badge, energy, sec };
}

function renderRooms() {
  const grid = $("#roomGrid");
  grid.innerHTML = ROOMS.map(r => {
    const info = roomInfo(r.name);
    const maxEnergy = 1400;
    const pct = Math.min(100, (info.energy / maxEnergy) * 100);
    return `
    <div class="room-card ${info.active>0?"active":""} ${info.sec&&info.sec.status?"secured":""}" data-room="${r.name}">
      <div class="rc-top">
        <div class="rc-title"><span class="rc-ico">${r.icon}</span> ${r.name}</div>
        <span class="badge ${info.badge}">${info.status}</span>
      </div>
      <div class="rc-stats">
        <div class="rc-stat"><b>${info.total}</b><small>Total</small></div>
        <div class="rc-stat"><b style="color:var(--secondary)">${info.active}</b><small>Active</small></div>
        <div class="rc-stat"><b style="color:var(--muted)">${info.inactive}</b><small>Idle</small></div>
      </div>
      <div class="rc-energy">⚡ Energy usage: <b>${info.energy} W</b>
        <div class="rc-bar"><div style="width:${pct}%"></div></div>
      </div>
      <button class="btn btn-ghost full" data-room-view="${r.name}">👁 View Room</button>
    </div>`;
  }).join("");
}

let openRoomName = null;
function openRoomDetail(roomName, keepScroll = false) {
  openRoomName = roomName;
  const r = ROOMS.find(x => x.name === roomName);
  const info = roomInfo(roomName);
  const lastForRoom = state.logs.find(l => l.room === roomName);
  const body = $("#roomModalBody");
  body.innerHTML = `
    <div class="modal-head">
      <div>
        <h2>${r.icon} ${roomName}</h2>
        <span class="badge ${info.badge}">${info.status}</span>
      </div>
      <button class="modal-close" id="modalClose">✕</button>
    </div>
    <div class="rc-stats" style="margin-bottom:16px">
      <div class="rc-stat"><b>${info.total}</b><small>Total Devices</small></div>
      <div class="rc-stat"><b style="color:var(--secondary)">${info.active}</b><small>Active</small></div>
      <div class="rc-stat"><b>${info.energy} W</b><small>Energy</small></div>
    </div>
    <h3 style="margin-bottom:10px">Devices Inside Room</h3>
    ${info.devs.map(d => {
      const isSec = d.type === "Security";
      const stat = isSec ? (d.status?"🔒 Locked":"🔓 Unlocked") : (d.status?"ON":"OFF");
      return `
      <div class="modal-dev">
        <div class="modal-dev-left">
          <span style="font-size:1.5rem">${d.icon}</span>
          <div><b>${d.name}</b><br><small class="muted">${stat} · ${valDisplay(d)} ${isSec?"":""}</small></div>
        </div>
        <div class="modal-dev-ctrls">
          ${isSec ? `<button class="btn ${d.status?"btn-danger":"btn-ghost"}" data-act="door" data-id="${d.id}">${d.status?"Unlock":"Lock"}</button>`
          : `<button class="btn ${d.status?"btn-danger":"btn-primary"}" data-act="toggle" data-id="${d.id}">${d.status?"OFF":"ON"}</button>
             <button class="btn btn-ghost" data-act="dec" data-id="${d.id}">➖</button>
             <button class="btn btn-ghost" data-act="inc" data-id="${d.id}">➕</button>`}
        </div>
      </div>`;
    }).join("")}
    <div class="last-action">📌 <b>Last Action:</b> ${lastForRoom ? `${lastForRoom.source} ${lastForRoom.gesture && lastForRoom.gesture!=="Button" ? "("+lastForRoom.gesture+") ":""}${lastForRoom.action} on ${lastForRoom.device} at ${lastForRoom.time}` : "No actions in this room yet."}</div>
  `;
  $("#roomModal").classList.add("show");
  $("#modalClose").onclick = () => $("#roomModal").classList.remove("show");
}

function renderState() {
  const dev = selectedDevice();
  $("#stCamera").textContent = cameraOn ? "Active" : "Inactive";
  $("#stCamera").className = cameraOn ? "ok" : "muted";
  $("#stDevice").textContent = dev ? dev.name : "None";
  $("#stDevice").className = dev ? "accent" : "muted";
  $("#stRoom").textContent = state.selectedRoom || "None";
  $("#stRoom").className = state.selectedRoom ? "" : "muted";
}

function renderQuickPanel() {
  const dev = selectedDevice();
  $("#quickDeviceName").textContent = dev ? dev.name : "No device selected";
  const body = $("#quickBody");
  if (!dev) { body.innerHTML = `<p class="muted">Select a device from the Devices section to control it here.</p>`; return; }
  if (dev.type === "Security") {
    body.innerHTML = `
      <div class="quick-value">${dev.status?"🔒":"🔓"}</div>
      <div><b>${dev.status?"Locked":"Unlocked"}</b><br><small class="muted">Door lock is manual-only for safety.</small></div>
      <div class="quick-btns"><button class="btn ${dev.status?"btn-danger":"btn-primary"}" data-act="door" data-id="${dev.id}">${dev.status?"🔓 Unlock":"🔒 Lock"}</button></div>`;
    return;
  }
  body.innerHTML = `
    <div class="quick-value">${valDisplay(dev)}</div>
    <div style="min-width:120px"><b>${dev.status?"ON":"OFF"}</b><br><small class="muted">${dev.type} · ${dev.room}</small></div>
    <div class="quick-btns">
      <button class="btn ${dev.status?"btn-danger":"btn-primary"}" data-act="toggle" data-id="${dev.id}">${dev.status?"Turn OFF":"Turn ON"}</button>
      <button class="btn btn-ghost" data-act="dec" data-id="${dev.id}">➖ Decrease</button>
      <button class="btn btn-ghost" data-act="inc" data-id="${dev.id}">➕ Increase</button>
    </div>`;
}

function renderHomeStats() {
  const active = state.devices.filter(d => d.type !== "Security" && d.status).length;
  const totalEnergy = state.devices.reduce((s,d)=> s + (d.status && d.type!=="Security" ? (ENERGY[d.type]||0):0), 0);
  const door = state.devices.find(d => d.type==="Security");
  $("#homeTotalDevices").textContent = state.devices.length;
  $("#homeActiveDevices").textContent = active;
  $("#homeSelectedRoom").textContent = state.selectedRoom || "—";
  $("#homeCamStatus").textContent = cameraOn ? "On" : "Off";
  $("#pvTotal").textContent = state.devices.length;
  $("#pvActive").textContent = active;
  $("#pvRoom").textContent = state.selectedRoom || "—";
  $("#pvCam").textContent = cameraOn ? "On" : "Off";
  $("#pvEnergy").textContent = totalEnergy + " W";
  $("#pvDoor").textContent = door.status ? "Locked" : "Unlocked";
}

function renderScenes() {
  $("#sceneGrid").innerHTML = SCENES.map(s => `
    <div class="scene-card" data-scene="${s.id}">
      <div class="scene-ico">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
    </div>`).join("");
}

/* ---------------- Scenes logic ---------------- */
function runScene(id) {
  const setAll = (fn) => state.devices.forEach(d => { if (d.type !== "Security") fn(d); });
  const door = state.devices.find(d => d.type === "Security");
  const lockDoor = (lock) => { door.status = lock; door.value = lock?100:0; door.unit = lock?"Locked":"Unlocked"; door.lastUpdated = nowTime(); };
  let label = "";
  switch (id) {
    case "all_on":  setAll(d => d.status = true); label="All devices ON"; break;
    case "all_off": setAll(d => d.status = false); label="All devices OFF"; break;
    case "movie":   setAll(d => d.status = false);
                    setVal("Smart TV", true); setVal("Living Room Light", true, 20); setVal("Bedroom Curtain", false, 0);
                    label="Movie mode activated"; break;
    case "night":   setAll(d => d.status = false); lockDoor(true); label="Good night — all off, door locked"; break;
    case "away":    setAll(d => d.status = false); lockDoor(true); label="Away mode — home secured"; break;
    case "morning": setAll(d => d.status = false);
                    setVal("Living Room Light", true, 90); setVal("Kitchen Light", true, 80); setVal("Bedroom Curtain", true, 100);
                    label="Good morning scene"; break;
  }
  state.devices.forEach(d => d.lastUpdated = nowTime());
  save();
  renderDevices(); renderRooms(); renderHomeStats(); renderQuickPanel();
  addLog({ source:"Scene", gesture:"—", room:"All", device:"Multiple", action:label });
  toast(label, "success", "Scene Activated");
  speak(label);
}
function setVal(name, status, value) {
  const d = state.devices.find(x => x.name === name);
  if (!d) return;
  d.status = status;
  if (value !== undefined) d.value = value;
}

/* ============================================================
   GESTURE PROCESSING (stable detection)
   ============================================================ */
function resetStableGesture() {
  lastGesture = "";
  stableStartTime = null;
  updateStabilityProgress(0, 0);
}
function updateStabilityProgress(holdTime, required) {
  const pct = required ? clamp((holdTime / required) * 100, 0, 100) : 0;
  $("#stabBar").style.width = pct + "%";
  $("#stStabText").textContent = Math.round(pct) + "%";
}
function updateConfidence(conf) {
  $("#confBar").style.width = conf + "%";
  $("#stConfText").textContent = conf + "%";
}
function setDetectedGesture(name) {
  $("#stGesture").textContent = name;
}

function processGesture(currentGesture, confidence) {
  setDetectedGesture(currentGesture);
  updateConfidence(confidence);

  if (cooldownActive) { setCommandStatus("Cooldown active. Please wait.", "warn"); return; }
  if (!state.settings.gestureEnabled) { setCommandStatus("Gesture control disabled.", "muted"); return; }
  if (!selectedDevice()) { setCommandStatus("Please select a device first.", "warn"); return; }

  if (currentGesture === "No Hand") { resetStableGesture(); setCommandStatus("No hand detected.", "muted"); return; }

  if (confidence < state.settings.confidenceThreshold) {
    resetStableGesture();
    setCommandStatus("Low confidence. Gesture ignored.", "warn");
    return;
  }
  if (!allowedGestureNames.includes(currentGesture)) {
    resetStableGesture();
    setCommandStatus("Unknown gesture ignored.", "warn");
    return;
  }

  // Security guard for door
  if (selectedDevice().type === "Security") {
    setCommandStatus("Door lock is manual-only", "bad");
    return;
  }

  if (currentGesture !== lastGesture) {
    lastGesture = currentGesture;
    stableStartTime = Date.now();
    setCommandStatus("Hold gesture to confirm…", "accent");
    return;
  }

  const holdTime = Date.now() - stableStartTime;
  updateStabilityProgress(holdTime, state.settings.stableTime);

  if (holdTime >= state.settings.stableTime) {
    executeGesture(currentGesture);
    startCooldown();
    resetStableGesture();
  }
}

function executeGesture(gestureName) {
  const dev = selectedDevice();
  applyGestureToDevice(gestureName, "Gesture");
  setCommandStatus(`Gesture Confirmed: ${gestureName}`, "ok");
  flashConfirm(`✅ ${gestureName} → ${dev ? dev.name : ""}`);
}
function flashConfirm(text) {
  const el = $("#confirmFlash");
  el.textContent = text;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2500);
}

function startCooldown() {
  cooldownActive = true;
  const el = $("#stCooldown");
  el.textContent = "Active"; el.className = "warn";
  let remain = state.settings.cooldownTime;
  const iv = setInterval(() => {
    remain -= 200;
    if (remain <= 0) {
      clearInterval(iv);
      cooldownActive = false;
      el.textContent = "Ready"; el.className = "ok";
      setCommandStatus("Ready for next gesture.", "ok");
    }
  }, 200);
}

/* Simulator (works without camera) */
function simulateGesture(name) {
  if (!cameraOn) { // feed several frames so stability builds quickly
    setDetectedGesture(name);
    updateConfidence(95);
    let ticks = 0;
    const need = Math.ceil(state.settings.stableTime / 200) + 1;
    const iv = setInterval(() => {
      processGesture(name, 95);
      if (++ticks >= need || cooldownActive) clearInterval(iv);
    }, 200);
  } else {
    processGesture(name, 95);
  }
}

/* ============================================================
   CAMERA + MEDIAPIPE
   ============================================================ */
let gestureRecognizer = null;
let mpReady = false;
let rafId = null;
let lastVideoTime = -1;
let videoStream = null;

async function initMediaPipe() {
  if (mpReady) return true;
  try {
    setCommandStatus("Loading gesture model…", "accent");
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 1
    });
    mpReady = true;
    return true;
  } catch (e) {
    console.warn("MediaPipe failed to load:", e);
    toast("Gesture model could not load. Use the Gesture Simulator / manual buttons.", "warn", "Heads up");
    return false;
  }
}

/* Map MediaPipe categories -> our gesture names */
function mapMpGesture(name) {
  switch (name) {
    case "Open_Palm":   return "Open Palm";
    case "Closed_Fist": return "Fist";
    case "Thumb_Up":    return "Thumb Up";
    case "Thumb_Down":  return "Thumb Down";
    default:            return null; // Victory, Pointing_Up, ILoveYou, None -> ignored
  }
}

/* Detect OK sign from landmarks: thumb tip close to index tip, other fingers extended */
function isOkSign(landmarks) {
  if (!landmarks) return false;
  const dist = (a,b) => Math.hypot(a.x-b.x, a.y-b.y, (a.z||0)-(b.z||0));
  const thumbTip = landmarks[4], indexTip = landmarks[8];
  const palm = dist(landmarks[0], landmarks[9]) || 0.0001;
  const ringTip = landmarks[16], wrist = landmarks[0];
  const pinch = dist(thumbTip, indexTip) / palm;
  const ringExtended = dist(ringTip, wrist) / palm > 1.2;
  return pinch < 0.35 && ringExtended;
}

async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    toast("Camera not supported in this browser. Manual controls are available.", "error", "Camera not available");
    return;
  }
  setCommandStatus("Requesting camera permission…", "accent");
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
  } catch (err) {
    if (err.name === "NotAllowedError" || err.name === "SecurityError") {
      toast("Camera permission denied. Please allow camera access. Manual control is still available.", "error", "Permission denied");
      $("#camHint").textContent = "Camera permission denied. Manual control is still available.";
    } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
      toast("Camera not found. Use manual controls.", "error", "Camera not available");
    } else {
      toast("Could not start camera. Manual controls are available.", "error", "Camera error");
    }
    setCommandStatus("Camera unavailable — manual control active.", "warn");
    return;
  }

  const video = $("#webcam");
  video.srcObject = videoStream;
  await video.play().catch(()=>{});
  cameraOn = true;
  $("#camPlaceholder").style.display = "none";
  $("#startCam").disabled = true;
  $("#stopCam").disabled = false;
  $("#camStatusChip").classList.add("active");
  $("#camStatusChip").innerHTML = `<span class="dot"></span> Active`;
  $("#navCamPill").classList.add("on");
  $("#navCamPill").innerHTML = `<span class="dot"></span> Camera On`;
  renderState(); renderHomeStats();
  toast("Camera started successfully.", "success", "Camera Active");
  speak("Camera started successfully.");

  const ok = await initMediaPipe();
  if (ok) {
    setCommandStatus("Ready — show a gesture.", "ok");
    predictLoop();
  } else {
    setCommandStatus("Camera on (no AI model). Use simulator/manual.", "warn");
  }
}

function predictLoop() {
  const video = $("#webcam");
  const canvas = $("#overlay");
  const ctx = canvas.getContext("2d");

  function frame() {
    if (!cameraOn) return;
    if (video.readyState >= 2 && gestureRecognizer) {
      if (canvas.width !== video.videoWidth) { canvas.width = video.videoWidth; canvas.height = video.videoHeight; }
      const ts = performance.now();
      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        let results = null;
        try { results = gestureRecognizer.recognizeForVideo(video, ts); } catch (e) {}
        handleResults(results, ctx, canvas);
      }
    }
    rafId = requestAnimationFrame(frame);
  }
  frame();
}

function handleResults(results, ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!results || !results.landmarks || results.landmarks.length === 0) {
    processGesture("No Hand", 0);
    return;
  }

  // draw simple landmarks
  const lm = results.landmarks[0];
  ctx.fillStyle = "#00ff88";
  ctx.strokeStyle = "rgba(0,212,255,.7)";
  ctx.lineWidth = 2;
  for (const p of lm) {
    ctx.beginPath();
    ctx.arc(p.x * canvas.width, p.y * canvas.height, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  let gName = "Unknown", conf = 0;
  if (results.gestures && results.gestures.length && results.gestures[0].length) {
    const g = results.gestures[0][0];
    conf = Math.round(g.score * 100);
    const mapped = mapMpGesture(g.categoryName);
    if (mapped) gName = mapped;
  }

  // Landmark-based OK sign overrides (model has no OK category)
  if (isOkSign(lm)) { gName = "OK Sign"; conf = Math.max(conf, 80); }

  processGesture(gName, conf);
}

function stopCamera() {
  cameraOn = false;
  if (rafId) cancelAnimationFrame(rafId);
  if (videoStream) videoStream.getTracks().forEach(t => t.stop());
  videoStream = null;
  const video = $("#webcam");
  video.srcObject = null;
  $("#camPlaceholder").style.display = "flex";
  $("#startCam").disabled = false;
  $("#stopCam").disabled = true;
  $("#camStatusChip").classList.remove("active");
  $("#camStatusChip").innerHTML = `<span class="dot"></span> Inactive`;
  $("#navCamPill").classList.remove("on");
  $("#navCamPill").innerHTML = `<span class="dot"></span> Camera Off`;
  const c = $("#overlay").getContext("2d"); c && c.clearRect(0,0,$("#overlay").width,$("#overlay").height);
  resetStableGesture(); updateConfidence(0); setDetectedGesture("No Hand");
  renderState(); renderHomeStats();
  toast("Camera stopped.", "", "Camera Off");
  speak("Camera stopped.");
  setCommandStatus("Idle", "muted");
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function showSection(id) {
  $$(".section").forEach(s => s.classList.toggle("active-section", s.id === id));
  $$(".nav-link").forEach(a => a.classList.toggle("active", a.dataset.link === id));
  $("#navLinks").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============================================================
   SETTINGS
   ============================================================ */
function applySettingsToUI() {
  const s = state.settings;
  $("#setGesture").checked = s.gestureEnabled;
  $("#setVoice").checked = s.voiceEnabled;
  $("#setTheme").checked = s.theme === "light";
  $("#setConfidence").value = s.confidenceThreshold;
  $("#confVal").textContent = s.confidenceThreshold + "%";
  $("#setStable").value = (s.stableTime/1000).toFixed(1);
  $("#stableVal").textContent = (s.stableTime/1000).toFixed(1) + "s";
  $("#setCooldown").value = (s.cooldownTime/1000).toFixed(1);
  $("#cooldownVal").textContent = (s.cooldownTime/1000).toFixed(1) + "s";
  applyTheme();
}
function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.settings.theme);
  $("#themeToggle").textContent = state.settings.theme === "dark" ? "🌙" : "☀️";
}

/* ============================================================
   EVENT WIRING
   ============================================================ */
function wireEvents() {
  // nav links (and data-link buttons)
  document.addEventListener("click", e => {
    const link = e.target.closest("[data-link]");
    if (link) { e.preventDefault(); showSection(link.dataset.link); }
  });
  $("#menuBtn").onclick = () => $("#navLinks").classList.toggle("open");
  $("#themeToggle").onclick = () => {
    state.settings.theme = state.settings.theme === "dark" ? "light" : "dark";
    applyTheme(); $("#setTheme").checked = state.settings.theme === "light"; save();
  };

  // camera
  $("#startCam").onclick = startCamera;
  $("#stopCam").onclick = stopCamera;

  // simulator buttons
  $$(".sim-btn").forEach(b => b.onclick = () => {
    b.classList.add("firing"); setTimeout(()=>b.classList.remove("firing"), 400);
    simulateGesture(b.dataset.gesture);
  });
  // keyboard 1-5
  document.addEventListener("keydown", e => {
    const map = { "1":"Open Palm","2":"Fist","3":"Thumb Up","4":"Thumb Down","5":"OK Sign" };
    if (map[e.key] && document.activeElement.tagName !== "INPUT") simulateGesture(map[e.key]);
  });

  // device grid actions (event delegation)
  $("#deviceGrid").addEventListener("click", handleDeviceAction);
  $("#quickBody").addEventListener("click", handleDeviceAction);
  $("#roomModalBody").addEventListener("click", handleDeviceAction);
  $("#deviceSearch").addEventListener("input", renderDevices);

  // room grid
  $("#roomGrid").addEventListener("click", e => {
    const view = e.target.closest("[data-room-view]");
    const card = e.target.closest("[data-room]");
    if (view) { openRoomDetail(view.dataset.room); return; }
    if (card) openRoomDetail(card.dataset.room);
  });
  $("#roomModal").addEventListener("click", e => { if (e.target.id === "roomModal") e.target.classList.remove("show"); });

  // scenes
  $("#sceneGrid").addEventListener("click", e => {
    const s = e.target.closest("[data-scene]");
    if (s) runScene(s.dataset.scene);
  });

  // logs
  $("#clearLogs").onclick = $("#clearLogs2").onclick = () => {
    state.logs = []; save(); renderLogs(); toast("Logs cleared successfully.", "success");
  };

  // settings toggles
  $("#setGesture").onchange = e => { state.settings.gestureEnabled = e.target.checked; save(); toast("Settings saved successfully.","success"); };
  $("#setVoice").onchange   = e => { state.settings.voiceEnabled = e.target.checked; save(); if(e.target.checked) speak("Voice feedback on."); toast("Settings saved successfully.","success"); };
  $("#setTheme").onchange   = e => { state.settings.theme = e.target.checked ? "light":"dark"; applyTheme(); save(); };
  $("#setConfidence").oninput = e => { state.settings.confidenceThreshold = +e.target.value; $("#confVal").textContent = e.target.value+"%"; save(); };
  $("#setStable").oninput     = e => { state.settings.stableTime = Math.round(+e.target.value*1000); $("#stableVal").textContent = facetSec(e.target.value); save(); };
  $("#setCooldown").oninput   = e => { state.settings.cooldownTime = Math.round(+e.target.value*1000); $("#cooldownVal").textContent = facetSec(e.target.value); save(); };

  // resets
  $("#resetDevices").onclick = () => {
    state.devices = structuredClone(DEFAULT_DEVICES); state.selectedDeviceId = null; state.selectedRoom = null;
    save(); renderAll(); toast("Device data reset successfully.","success");
  };
  $("#clearAll").onclick = () => {
    localStorage.removeItem(LS_KEY);
    state.devices = structuredClone(DEFAULT_DEVICES);
    state.selectedDeviceId = null; state.selectedRoom = null; state.logs = [];
    state.settings = { gestureEnabled:true, voiceEnabled:true, theme:"dark", confidenceThreshold:75, stableTime:1500, cooldownTime:2000 };
    applySettingsToUI(); renderAll(); toast("All saved data cleared.","success");
  };
}
function facetSec(v){ return (+v).toFixed(1)+"s"; }

function handleDeviceAction(e) {
  const btn = e.target.closest("[data-act]");
  const card = e.target.closest(".device-card");
  if (!btn) { if (card && !e.target.closest("[data-act]")) selectDevice(+card.dataset.id); return; }
  const id = +btn.dataset.id;
  const dev = getDevice(id);
  const act = btn.dataset.act;
  switch (act) {
    case "select":     selectDevice(id); break;
    case "confirmsel": selectDevice(id); break;
    case "toggle":     dev.status ? turnOff(dev,"Manual") : turnOn(dev,"Manual"); break;
    case "inc":        changeValue(dev, +1, "Manual"); break;
    case "dec":        changeValue(dev, -1, "Manual"); break;
    case "door":       toggleDoor("Manual"); break;
  }
}

/* ============================================================
   INIT
   ============================================================ */
function renderAll() {
  renderDevices(); renderRooms(); renderScenes(); renderLogs();
  renderState(); renderQuickPanel(); renderHomeStats();
}
function init() {
  load();
  applySettingsToUI();
  renderAll();
  wireEvents();
  setDetectedGesture("No Hand");
  console.log("Smart Home Gesture Control ready ✔");
}
document.addEventListener("DOMContentLoaded", init);
