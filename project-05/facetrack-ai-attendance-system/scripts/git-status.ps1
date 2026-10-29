# FaceTrack-AI - read-only Git status helper.
# Shows working-tree status + recent local history. Never stages/commits/pushes.
# Usage: powershell -ExecutionPolicy RemoteSigned -File scripts/git-status.ps1
#
# NOTE: ASCII-only (Windows PowerShell 5.1 reads BOM-less files as ANSI).

$projectRoot = Split-Path -Parent $PSScriptRoot   # ...\FaceTrack-AI
Push-Location -LiteralPath $projectRoot
try {
    Write-Host "=== git status ===" -ForegroundColor Cyan
    git status

    Write-Host ""
    Write-Host "=== recent history (last 10) ===" -ForegroundColor Cyan
    git log --oneline --decorate --graph -10
}
finally {
    Pop-Location
}
