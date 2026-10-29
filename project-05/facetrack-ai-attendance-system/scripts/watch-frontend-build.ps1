# FaceTrack-AI - Manual frontend build watcher (Windows PowerShell, no packages).
#
# WHY: Claude Code's PostToolUse hook auto-builds after *Claude* edits frontend
# files. It does NOT see edits you make by hand in VS Code. Run this watcher in a
# spare terminal and it will rebuild the frontend whenever YOU change a file under
# frontend/src, frontend/public, or a key frontend config file.
#
# USAGE (from the FaceTrack-AI project root):
#   powershell -ExecutionPolicy RemoteSigned -File scripts/watch-frontend-build.ps1
#   (or just:  .\scripts\watch-frontend-build.ps1  if your execution policy allows)
#   Press Ctrl+C to stop.
#
# Uses only the built-in .NET FileSystemWatcher - no npm packages installed.
# Never runs "npm install".
#
# NOTE: keep this file ASCII-only (Windows PowerShell 5.1 reads BOM-less files as
# ANSI; non-ASCII chars break parsing).

# --- Locate the frontend directory relative to this script -------------------
$projectRoot = Split-Path -Parent $PSScriptRoot   # ...\FaceTrack-AI
$frontendDir = Join-Path $projectRoot 'frontend'

if (-not (Test-Path -LiteralPath $frontendDir)) {
    Write-Host "ERROR: frontend directory not found at '$frontendDir'." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path -LiteralPath (Join-Path $frontendDir 'node_modules'))) {
    Write-Host "WARNING: '$frontendDir\node_modules' is missing." -ForegroundColor Yellow
    Write-Host "Run 'cd frontend; npm install' once before using this watcher." -ForegroundColor Yellow
}

Write-Host "FaceTrack-AI frontend build watcher" -ForegroundColor Cyan
Write-Host "Watching: $frontendDir (src, public, index.html, vite.config.js, package*.json)" -ForegroundColor DarkCyan
Write-Host "Press Ctrl+C to stop."
Write-Host ""

# --- Debounced rebuild --------------------------------------------------------
$script:lastRun = [DateTime]::MinValue
$script:building = $false

function Invoke-Build([string]$reason) {
    # Debounce: ignore events within 1.5s of the last build start.
    $now = Get-Date
    if ($script:building) { return }
    if (($now - $script:lastRun).TotalMilliseconds -lt 1500) { return }
    $script:lastRun = $now
    $script:building = $true
    try {
        Write-Host ""
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Change detected ($reason) -> building..." -ForegroundColor Cyan
        Push-Location -LiteralPath $frontendDir
        & cmd /c "npm run build"
        $code = $LASTEXITCODE
        Pop-Location
        if ($code -eq 0) {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] BUILD PASSED" -ForegroundColor Green
        } else {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] BUILD FAILED (exit $code) - fix the error above." -ForegroundColor Red
        }
    } finally {
        $script:building = $false
    }
}

# Only rebuild for build-relevant files; ignore docs + build artifacts.
function Test-Relevant([string]$path) {
    if ([string]::IsNullOrWhiteSpace($path)) { return $false }
    $n = $path -replace '\\', '/'
    if ($n -match '\.md$') { return $false }
    if ($n -imatch '/node_modules/') { return $false }
    if ($n -imatch '/dist/') { return $false }
    if ($n -imatch '/frontend/src/') { return $true }
    if ($n -imatch '/frontend/public/') { return $true }
    if ($n -imatch '/frontend/index\.html$') { return $true }
    if ($n -imatch '/frontend/package(-lock)?\.json$') { return $true }
    if ($n -imatch '/frontend/vite\.config\.js$') { return $true }
    if ($n -imatch '/frontend/tsconfig[^/]*\.json$') { return $true }
    return $false
}

# --- Set up the FileSystemWatcher over the whole frontend dir ----------------
$fsw = New-Object System.IO.FileSystemWatcher
$fsw.Path = $frontendDir
$fsw.IncludeSubdirectories = $true
$fsw.NotifyFilter = [System.IO.NotifyFilters]'LastWrite, FileName, DirectoryName'
$fsw.EnableRaisingEvents = $true

$action = {
    $p = $Event.SourceEventArgs.FullPath
    if (Test-Relevant $p) {
        Invoke-Build $Event.SourceEventArgs.ChangeType
    }
}

# Register on the common change events.
$subs = @()
foreach ($evt in 'Changed', 'Created', 'Renamed', 'Deleted') {
    $subs += Register-ObjectEvent -InputObject $fsw -EventName $evt -Action $action
}

# Build once on start so you have a known-good baseline.
Invoke-Build 'startup'

# --- Keep the script alive until Ctrl+C --------------------------------------
try {
    while ($true) { Start-Sleep -Seconds 1 }
} finally {
    $fsw.EnableRaisingEvents = $false
    foreach ($s in $subs) { Unregister-Event -SubscriptionId $s.Id -ErrorAction SilentlyContinue }
    $fsw.Dispose()
    Write-Host ""
    Write-Host "Watcher stopped." -ForegroundColor Yellow
}
