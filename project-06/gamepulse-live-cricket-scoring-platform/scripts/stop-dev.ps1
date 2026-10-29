# stop-dev.ps1 - GamePulse Live
#
# Purpose: safely stop the Vite dev server and free port 5173.
#
# Usage:
#   .\scripts\stop-dev.ps1
#   .\scripts\stop-dev.ps1 -Port 5173
#
# Safety:
#   - Never runs git. Never installs packages.
#   - Only stops a process that BOTH owns the TCP port listener AND is named "node".
#   - Any non-node port owner is reported as a warning and left untouched.
#   - The kill is bound to CURRENT port ownership + CURRENT node identity to avoid
#     PID-reuse races.
#
# Target shell: Windows PowerShell 5.1 (powershell.exe)

param([int]$Port = 5173)

$BindHost = "127.0.0.1"

# Project root is the PARENT of the script directory (scripts/ lives under root).
$root = Split-Path -Parent $PSScriptRoot
$frontend = Join-Path $root "frontend"

Write-Host "[stop-dev] GamePulse Live - stopping Vite dev server on ${BindHost}:$Port"
Write-Host "[stop-dev] Project root: $root"
Write-Host "[stop-dev] Frontend dir: $frontend"

# Detect availability of Get-NetTCPConnection ONCE up front.
# This distinguishes "cmdlet unavailable" (use netstat fallback) from
# "no listener" (authoritative: port is free) so the broad netstat scan only
# runs as a genuine fallback, never as routine behavior on a free port.
$haveNetTcp = $null -ne (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue)

# ----------------------------------------------------------------------------
# Helper: collect unique listener PIDs for $Port via netstat -ano (fallback).
# Only TCP LISTENING lines with a valid PID column are harvested.
# ----------------------------------------------------------------------------
function Get-ListenerPidsFromNetstat {
    param([int]$ThePort)

    $result = @()
    try {
        $netstatLines = netstat -ano | Select-String -Pattern "LISTENING"
        foreach ($line in $netstatLines) {
            $text = $line.ToString().Trim()
            # Columns: Proto  LocalAddress  ForeignAddress  State  PID
            $cols = $text -split "\s+"
            if ($cols.Length -ge 5) {
                # Proto guard: only TCP listener lines may contribute a PID.
                if ($cols[0] -eq "TCP") {
                    $localAddr = $cols[1]
                    $statePid = $cols[4]
                    # Match listener on the target port (0.0.0.0:5173, 127.0.0.1:5173, [::]:5173).
                    if ($localAddr -match (":" + $ThePort + "$")) {
                        $parsedPid = 0
                        if ([int]::TryParse($statePid, [ref]$parsedPid)) {
                            if ($parsedPid -gt 0) {
                                $result += $parsedPid
                            }
                        }
                    }
                }
            }
        }
    } catch {
        Write-Host "[stop-dev] WARNING: netstat fallback failed: $($_.Exception.Message)"
    }
    return ($result | Select-Object -Unique)
}

# ----------------------------------------------------------------------------
# Helper: collect unique listener PIDs for $Port via Get-NetTCPConnection.
# A $null/empty result is authoritative: the port has no listener (free).
# ----------------------------------------------------------------------------
function Get-ListenerPidsFromCmdlet {
    param([int]$ThePort)

    $result = @()
    $conns = Get-NetTCPConnection -LocalPort $ThePort -State Listen -ErrorAction SilentlyContinue
    if ($null -ne $conns) {
        foreach ($c in $conns) {
            if ($null -ne $c.OwningProcess -and $c.OwningProcess -gt 0) {
                $result += [int]$c.OwningProcess
            }
        }
    }
    return ($result | Select-Object -Unique)
}

# ----------------------------------------------------------------------------
# Step 1: Find the PID(s) owning the TCP listener on $Port.
# ----------------------------------------------------------------------------
$ownerPids = @()
if ($haveNetTcp) {
    $ownerPids = @(Get-ListenerPidsFromCmdlet -ThePort $Port)
} else {
    Write-Host "[stop-dev] Get-NetTCPConnection unavailable; falling back to netstat."
    $ownerPids = @(Get-ListenerPidsFromNetstat -ThePort $Port)
}

# ----------------------------------------------------------------------------
# Step 2: For each owning PID, only stop it if its process name is "node".
# Immediately before killing, re-confirm that the PID STILL owns $Port and is
# STILL a node process, to close the PID-reuse / TOCTOU window.
# ----------------------------------------------------------------------------
if ($ownerPids.Count -eq 0) {
    Write-Host "[stop-dev] No process owns port $Port. Port is already free."
} else {
    Write-Host "[stop-dev] Found $($ownerPids.Count) process(es) listening on port $Port."
    foreach ($ownerPid in $ownerPids) {
        $proc = Get-Process -Id $ownerPid -ErrorAction SilentlyContinue
        if ($null -eq $proc) {
            Write-Host "[stop-dev] PID $ownerPid no longer exists; nothing to stop."
        } elseif ($proc.ProcessName -eq "node") {
            # Re-confirm current port ownership right before the kill.
            $stillOwns = $true
            if ($haveNetTcp) {
                $currentOwners = @(Get-ListenerPidsFromCmdlet -ThePort $Port)
                $stillOwns = $currentOwners -contains $ownerPid
            }
            if (-not $stillOwns) {
                Write-Host "[stop-dev] PID $ownerPid no longer owns port $Port; skipping (likely already gone)."
            } else {
                # Re-confirm identity is still node immediately before stopping.
                $recheckProc = Get-Process -Id $ownerPid -ErrorAction SilentlyContinue
                if ($null -ne $recheckProc -and $recheckProc.ProcessName -eq "node") {
                    try {
                        Stop-Process -Id $ownerPid -Force -ErrorAction Stop
                        Write-Host "[stop-dev] Stopped node process (PID $ownerPid) that was holding port $Port."
                    } catch {
                        Write-Host "[stop-dev] WARNING: failed to stop node PID $ownerPid : $($_.Exception.Message)"
                    }
                } else {
                    Write-Host "[stop-dev] WARNING: PID $ownerPid is no longer a node process; NOT killing it."
                }
            }
        } else {
            Write-Host "[stop-dev] WARNING: port $Port is owned by '$($proc.ProcessName)' (PID $ownerPid), not node. NOT killing it."
        }
    }
}

# ----------------------------------------------------------------------------
# Step 3: Re-check and report final status of the port.
# When the cmdlet is available, derive the verdict DIRECTLY from it (an empty
# result means free). Only use the netstat recheck when the cmdlet is absent.
# ----------------------------------------------------------------------------
$stillInUse = $false
$holderPids = @()

if ($haveNetTcp) {
    $holderPids = @(Get-ListenerPidsFromCmdlet -ThePort $Port)
    if ($holderPids.Count -gt 0) {
        $stillInUse = $true
    }
} else {
    $holderPids = @(Get-ListenerPidsFromNetstat -ThePort $Port)
    if ($holderPids.Count -gt 0) {
        $stillInUse = $true
    }
}

if ($stillInUse) {
    Write-Host "[stop-dev] RESULT: port $Port is still IN USE."
    foreach ($holderPid in $holderPids) {
        $holder = Get-Process -Id $holderPid -ErrorAction SilentlyContinue
        if ($null -ne $holder) {
            Write-Host "[stop-dev]   still held by '$($holder.ProcessName)' (PID $holderPid)."
        } else {
            Write-Host "[stop-dev]   still held by PID $holderPid (process info unavailable)."
        }
    }
} else {
    Write-Host "[stop-dev] RESULT: port $Port is now FREE."
}
