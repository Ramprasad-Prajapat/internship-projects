# FaceTrack-AI - read-only Git diff helper.
# Shows status + a diff summary + the full diff. Never stages/commits/pushes.
# Usage: powershell -ExecutionPolicy RemoteSigned -File scripts/git-diff.ps1
#
# NOTE: ASCII-only (Windows PowerShell 5.1 reads BOM-less files as ANSI).

$projectRoot = Split-Path -Parent $PSScriptRoot   # ...\FaceTrack-AI
Push-Location -LiteralPath $projectRoot
try {
    Write-Host "=== git status ===" -ForegroundColor Cyan
    git status

    Write-Host ""
    Write-Host "=== git diff --stat ===" -ForegroundColor Cyan
    git diff --stat

    Write-Host ""
    Write-Host "=== git diff (full, unstaged) ===" -ForegroundColor Cyan
    git diff
}
finally {
    Pop-Location
}
