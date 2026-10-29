/* ==========================================================================
   AquaSaver Pro: Canvas High-Resolution Certificate Exporter
   ========================================================================== */

function generateAndDownloadCertificate() {
  const nameInput = document.getElementById("cert-user-name").value.trim() || "Eco Champion";
  const canvas = document.getElementById("cert-canvas");
  const ctx = canvas.getContext("2d");
  
  // 1. Establish high resolution bounds (1200 x 800)
  canvas.width = 1200;
  canvas.height = 800;
  
  // 2. Draw outer gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
  bgGrad.addColorStop(0, "#0b0f19");
  bgGrad.addColorStop(0.5, "#07172f");
  bgGrad.addColorStop(1, "#030a16");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 800);
  
  // 3. Draw dual gold/cyan geometric border
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#fbbf24"; // Gold Outer
  ctx.strokeRect(30, 30, 1140, 740);
  
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#38bdf8"; // Cyan Inner border
  ctx.strokeRect(48, 48, 1104, 704);
  
  // 4. Draw ornamental corner anchors
  ctx.fillStyle = "#fbbf24";
  const corners = [
    {x: 48, y: 48}, {x: 1152, y: 48}, 
    {x: 48, y: 752}, {x: 1152, y: 752}
  ];
  corners.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 16, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // 5. Draw Header Graphics & Title Texts
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Glowing AquaSaver text logo
  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = 15;
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 50px 'Outfit', sans-serif";
  ctx.fillText("AQUASAVER HERO CERTIFICATE", 600, 140);
  ctx.shadowBlur = 0; // Disable shadows for main text
  
  ctx.fillStyle = "#94a3b8";
  ctx.font = "500 20px 'Inter', sans-serif";
  ctx.fillText("HONORARY GREEN CONSERVATOR AWARD", 600, 205);
  
  // 6. Presentation Statement
  ctx.fillStyle = "#f8fafc";
  ctx.font = "italic 22px 'Inter', sans-serif";
  ctx.fillText("This official eco credential is proudly presented to:", 600, 290);
  
  // User name prominently in gold
  ctx.shadowColor = "#fbbf24";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#fbbf24";
  ctx.font = "800 62px 'Outfit', sans-serif";
  ctx.fillText(nameInput.toUpperCase(), 600, 370);
  ctx.shadowBlur = 0;
  
  // Core narrative
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "400 18px 'Inter', sans-serif";
  ctx.fillText("for completing the touchless gesture-controlled save water simulation challenge,", 600, 450);
  ctx.fillText("demonstrating fast hand responses to securely plug leaks, conserve fresh resources,", 600, 480);
  ctx.fillText("and spreading positive environmental consciousness to build a sustainable planet.", 600, 510);
  
  // 7. Display Stats accomplishments
  ctx.fillStyle = "#0f172a";
  const statBoxX = 350;
  const statBoxY = 560;
  const statBoxW = 500;
  const statBoxH = 75;
  ctx.fillStyle = "rgba(56, 189, 248, 0.12)";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
  ctx.lineWidth = 2;
  ctx.fillRect(statBoxX, statBoxY, statBoxW, statBoxH);
  ctx.strokeRect(statBoxX, statBoxY, statBoxW, statBoxH);
  
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 16px 'Outfit', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`VOLUME SAVED: ${window.waterSaved.toFixed(1)} LITERS`, statBoxX + 30, statBoxY + 38);
  ctx.textAlign = "right";
  ctx.fillText(`ECO RATING: ${Math.round(window.ecoScore)}/100 (WATER HERO)`, statBoxX + statBoxW - 30, statBoxY + 38);
  
  // 8. Signatures & Seals
  ctx.textAlign = "center";
  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 14px 'Inter', sans-serif";
  
  // Digital signature scribbles
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2.5;
  
  // Left signature (Eco Lab director)
  ctx.beginPath();
  ctx.moveTo(250, 680);
  ctx.bezierCurveTo(270, 660, 290, 690, 310, 665);
  ctx.bezierCurveTo(330, 640, 320, 685, 350, 670);
  ctx.stroke();
  
  ctx.fillText("DR. MARINA BLUE", 300, 715);
  ctx.font = "500 11px 'Inter', sans-serif";
  ctx.fillText("DIRECTOR, AQUASAVER ECO LAB", 300, 735);
  
  // Right signature (Alliance Board)
  ctx.strokeStyle = "#fbbf24";
  ctx.beginPath();
  ctx.moveTo(850, 680);
  ctx.bezierCurveTo(870, 650, 890, 695, 910, 660);
  ctx.bezierCurveTo(930, 630, 920, 680, 950, 668);
  ctx.stroke();
  
  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 14px 'Inter', sans-serif";
  ctx.fillText("FOREST GREEN", 900, 715);
  ctx.font = "500 11px 'Inter', sans-serif";
  ctx.fillText("CHAIRMAN, WATER SAVER ALLIANCE", 900, 735);
  
  // 9. Central Decorative seal star
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(600, 680, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0b0f19";
  ctx.beginPath();
  ctx.arc(600, 680, 21, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(600, 680, 18, 0, Math.PI * 2);
  ctx.fill();
  
  // Save / Export trigger
  const link = document.createElement("a");
  link.download = `${nameInput.replace(/\s+/g, '_')}_AquaSaver_Certificate.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  
  AudioSynth.playSuccessChime();
}
