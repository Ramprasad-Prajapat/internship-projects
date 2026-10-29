# FaceTrack-AI - Auto-run (live dev server). Run this ONCE; then you never need
# to manually run/rebuild again - the Vite dev server live-reloads on EVERY
# change automatically (whether the edit comes from Claude or from you in VS Code).
#
# USAGE (from the FaceTrack-AI project root):
#   powershell -ExecutionPolicy RemoteSigned -File scripts/auto-run.ps1
#   (add -NoOpen to NOT auto-open the browser; add -Lan to expose on your LAN)
#   Press Ctrl+C to stop.
#
# What this does:
#   - REUSE-AWARE: if a dev server is already running (yours, started manually,
#     or one from a previous run), it prints that URL and exits - it never
#     starts a duplicate and never kills your server.
#   - Otherwise it starts `npm run dev` (Vite) and keeps it running.
#   - Vite HMR / Fast Refresh updates the open browser instantly on any save -
#     no rebuild, no re-run, no /run needed.
#   - Auto-opens the app in your default browser (unless -NoOpen).
#
# What it does NOT do:
#   - It never runs `npm install` and never commits/pushes anything.
#   - `package.json` / `vite.config.js` changes still need a restart
#     (Ctrl+C, then run this again) - HMR covers everything under src/.
#
# NOTE: keep this file ASCII-only (Windows PowerShell 5.1 reads BOM-less files
# as ANSI; non-ASCII chars break parsing).

param(
    [switch]$NoOpen,   # skip auto-opening the browser
    [switch]$Lan       # also expose the server on the local network (vite --host)
)

$projectRoot = Split-Path -Parent $PSScriptRoot   # ...\FaceTrack-AI
$frontendDir = Join-Path $projectRoot 'frontend'

if (-not (Test-Path -LiteralPath $frontendDir)) {
    Write-Host "ERROR: frontend directory not found at '$frontendDir'." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path -LiteralPath (Join-Path $frontendDir 'node_modules'))) {
    Write-Host "WARNING: '$frontendDir\node_modules' is missing." -ForegroundColor Yellow
    Write-Host "Run 'cd frontend; npm install' once before using auto-run." -ForegroundColor Yellow
    exit 1
}

# --- Reuse an already-running dev server (avoid duplicates; never touch a
#     server you started manually). Vite uses 5173, then auto-increments. ---
foreach ($port in 5173, 5174, 5175, 5176) {
    $listening = $false
    try { $null = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction Stop; $listening = $true } catch { $listening = $false }
    if (-not $listening) { continue }
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:$port/" -UseBasicParsing -TimeoutSec 4
        if ($resp.Content -match 'FaceTrack' -or $resp.Content -match '/@vite/client') {
            Write-Host ""
            Write-Host "  FaceTrack-AI dev server is ALREADY running - reusing it." -ForegroundColor Green
            Write-Host "  No duplicate started; your server was left untouched." -ForegroundColor DarkGray
            Write-Host "  Open: http://localhost:$port/" -ForegroundColor Cyan
            Write-Host ""
            exit 0
        }
    } catch {
        # Listening but not a recognizable Vite/FaceTrack HTTP server - skip it.
    }
}

# Build the vite flags.
$flags = @()
if (-not $NoOpen) { $flags += '--open' }
if ($Lan)         { $flags += '--host' }

Write-Host ""
Write-Host "  FaceTrack-AI - AUTO-RUN (live dev server)" -ForegroundColor Cyan
Write-Host "  ----------------------------------------" -ForegroundColor DarkCyan
Write-Host "  Starting Vite. Every change live-reloads automatically (HMR)." -ForegroundColor Gray
Write-Host "  You do NOT need to run or rebuild again while this is running." -ForegroundColor Gray
if (-not $NoOpen) { Write-Host "  The app will open in your default browser shortly." -ForegroundColor Gray }
Write-Host "  Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

Push-Location -LiteralPath $frontendDir
try {
    # Run Vite's node entry directly (no npm/cmd batch layer) so Ctrl+C cleanly
    # stops the single node process and never orphans one holding the port.
    $viteBin = Join-Path $frontendDir 'node_modules\vite\bin\vite.js'
    if (Test-Path -LiteralPath $viteBin) {
        & node $viteBin @flags
    } else {
        # Fallback if the vite binary isn't where we expect.
        & npm.cmd run dev -- @flags
    }
}
finally {
    Pop-Location
    Write-Host ""
    Write-Host "Auto-run stopped." -ForegroundColor Yellow
}
