# auto-run.ps1 - safely run the Vite frontend dev server for GamePulse Live.
#
# Usage:
#   .\scripts\auto-run.ps1
#   .\scripts\auto-run.ps1 -NoOpen
#
# -NoOpen suppresses opening the browser; otherwise Vite opens it once ready.
#
# Safety: never runs git, never installs npm packages, and will ONLY stop a
# process that BOTH owns TCP port 5173 (on the configured bind host) AND is
# named "node".

param([switch]$NoOpen)

# --- Resolve project paths -------------------------------------------------
$root = Split-Path -Parent $PSScriptRoot
$frontend = Join-Path $root "frontend"

$Port = 5173
$BindHost = "127.0.0.1"

# Local addresses that count as "serving the configured host:port". A listener
# on 127.0.0.1, the wildcard addresses, or ::1 will actually answer requests to
# 127.0.0.1:5173, so those are the only ones we treat as reclaimable.
$LocalListenAddresses = @("127.0.0.1", "0.0.0.0", "::", "::1", "[::]", "[::1]")

# --- Helper: parse netstat -ano for PIDs that LISTEN on our local port ------
# Anchored to the LOCAL-address column so we never match a foreign/remote
# address that merely contains :5173, and constrained to the bind host set.
function Get-NetstatListenerPidsOnPort {
    param([int]$PortNumber)

    $found = @()
    try {
        $netstatLines = netstat -ano | Select-String -Pattern "LISTENING"
        foreach ($line in $netstatLines) {
            $text = $line.ToString()
            $fields = ($text -split "\s+") | Where-Object { $_ -ne "" }
            # Expected layout: Proto LocalAddr ForeignAddr State PID
            if ($fields.Count -lt 5) { continue }
            if ($fields[0] -ne "TCP") { continue }

            $localAddr = $fields[1]
            $state = $fields[$fields.Count - 2]
            $pidField = $fields[$fields.Count - 1]

            if ($state -ne "LISTENING") { continue }

            # The LOCAL address column must end with :<port> (exact match).
            if ($localAddr -notmatch ([regex]::Escape(":" + $PortNumber) + "$")) { continue }

            # Constrain to the configured bind host / wildcard addresses.
            $hostPart = $localAddr.Substring(0, $localAddr.Length - (":" + $PortNumber).Length)
            if ($LocalListenAddresses -notcontains $hostPart) { continue }

            $parsedPid = 0
            if ([int]::TryParse($pidField, [ref]$parsedPid)) {
                $found += $parsedPid
            }
        }
    }
    catch {
        $found = @()
    }

    return @($found | Select-Object -Unique)
}

# --- Helper: get PIDs that LISTEN on our local port (cmdlet, then netstat) ---
function Get-ListenerPidsOnPort {
    param([int]$PortNumber)

    $owningPids = @()
    $cmdletWorked = $false

    try {
        $conns = Get-NetTCPConnection -LocalPort $PortNumber -State Listen -ErrorAction SilentlyContinue
        # If the cmdlet exists it returns (possibly empty) without throwing.
        $cmdletWorked = $true
        if ($conns) {
            $matchingConns = $conns | Where-Object { $LocalListenAddresses -contains $_.LocalAddress }
            if ($matchingConns) {
                $owningPids = $matchingConns | Select-Object -ExpandProperty OwningProcess -Unique
            }
        }
    }
    catch {
        $cmdletWorked = $false
        $owningPids = @()
    }

    # Fall back to netstat only when the cmdlet was unavailable / failed.
    if (-not $cmdletWorked) {
        $owningPids = Get-NetstatListenerPidsOnPort -PortNumber $PortNumber
    }

    return @($owningPids | Select-Object -Unique)
}

# --- Helper: of the listener PIDs, which are node? Warn about non-node owners.
function Get-NodePidsOnPort {
    param([int]$PortNumber)

    $nodePids = @()
    $owningPids = Get-ListenerPidsOnPort -PortNumber $PortNumber

    foreach ($ownerPid in $owningPids) {
        if (-not $ownerPid) { continue }
        $proc = Get-Process -Id $ownerPid -ErrorAction SilentlyContinue
        if ($null -eq $proc) { continue }
        if ($proc.ProcessName -eq "node") {
            $nodePids += $ownerPid
        }
        else {
            Write-Host ("[auto-run] WARNING: port {0} is held by '{1}' (PID {2}), which is not node. Leaving it untouched." -f $PortNumber, $proc.ProcessName, $ownerPid)
        }
    }

    return @($nodePids | Select-Object -Unique)
}

# --- Helper: is the port held by anything at all (any process)? -------------
function Test-PortBusy {
    param([int]$PortNumber)

    $listenerPids = Get-ListenerPidsOnPort -PortNumber $PortNumber
    return (@($listenerPids).Count -gt 0)
}

# --- Helper: best-effort stop node PIDs (only ones we already vetted) -------
function Stop-NodePids {
    param([int[]]$NodePids, [string]$Tag)

    if (-not $NodePids -or @($NodePids).Count -eq 0) { return }

    foreach ($nodePid in $NodePids) {
        # Re-verify it is still node before killing, to stay safe against PID reuse.
        $proc = Get-Process -Id $nodePid -ErrorAction SilentlyContinue
        if ($null -ne $proc -and $proc.ProcessName -eq "node") {
            try {
                Stop-Process -Id $nodePid -Force -ErrorAction Stop
                Write-Host ("{0} Stopped node process (PID {1}) holding port {2}." -f $Tag, $nodePid, $Port)
            }
            catch {
                Write-Host ("{0} Could not stop node process (PID {1}): {2}" -f $Tag, $nodePid, $_.Exception.Message)
            }
        }
    }
}

# --- 3. Frontend scaffolded? -----------------------------------------------
$packageJson = Join-Path $frontend "package.json"
if ((-not (Test-Path -LiteralPath $frontend)) -or (-not (Test-Path -LiteralPath $packageJson))) {
    Write-Host "[auto-run] The frontend is not scaffolded yet (no package.json found in the frontend folder)."
    Write-Host ("[auto-run] Expected file: {0}" -f $packageJson)
    Write-Host "[auto-run] Nothing to run. Exiting cleanly."
    exit 0
}

# --- 4. Dependencies installed? --------------------------------------------
$nodeModules = Join-Path $frontend "node_modules"
if (-not (Test-Path -LiteralPath $nodeModules)) {
    Write-Host "[auto-run] Dependencies are not installed (no node_modules in the frontend folder)."
    Write-Host ("[auto-run] Please run 'npm install' inside: {0}" -f $frontend)
    Write-Host "[auto-run] This script will not auto-install. Exiting cleanly."
    exit 0
}

# --- 5. Is port 5173 already in use? ---------------------------------------
Write-Host ("[auto-run] Checking whether port {0} is already in use..." -f $Port)
$existingNodePids = Get-NodePidsOnPort -PortNumber $Port

if (@($existingNodePids).Count -gt 0) {
    Write-Host ("[auto-run] Port {0} is held by a node process. Assuming a stale dev server; stopping it to reclaim the port." -f $Port)
    Stop-NodePids -NodePids $existingNodePids -Tag "[auto-run]"
}
else {
    # No reclaimable node listener. If the port is still busy, an unrelated
    # owner holds it (Get-NodePidsOnPort already warned about a non-node owner),
    # so just bail out without killing anything.
    if (Test-PortBusy -PortNumber $Port) {
        Write-Host ("[auto-run] Port {0} is busy with an unrelated (non-node) process. Not killing anything. Exiting." -f $Port)
        exit 0
    }
    else {
        Write-Host ("[auto-run] Port {0} is free." -f $Port)
    }
}

# --- 6. Enter the frontend folder ------------------------------------------
$pushed = $false
try {
    Push-Location -LiteralPath $frontend -ErrorAction Stop
    $pushed = $true

    # --- 7. Build the dev command arguments --------------------------------
    $devArgs = @("run", "dev", "--", "--host", $BindHost, "--port", "$Port")
    if (-not $NoOpen) {
        $devArgs += "--open"
        Write-Host "[auto-run] Browser will open automatically once the server is ready."
    }
    else {
        Write-Host "[auto-run] -NoOpen supplied: the browser will NOT be opened."
    }

    Write-Host ("[auto-run] Starting Vite dev server on http://{0}:{1} ..." -f $BindHost, $Port)
    Write-Host "[auto-run] Press Ctrl+C to stop."

    # --- 8. Run in the foreground so Ctrl+C stops it -----------------------
    & npm @devArgs
}
finally {
    # --- 9. Cleanup --------------------------------------------------------
    # Only pop if we actually pushed, so the location stack stays balanced
    # even if Push-Location failed (e.g. the folder vanished in a race).
    if ($pushed) {
        Pop-Location
    }

    Write-Host ("[auto-run] Cleaning up. Checking for any lingering node process on port {0}..." -f $Port)
    $lingeringNodePids = Get-NodePidsOnPort -PortNumber $Port
    if (@($lingeringNodePids).Count -gt 0) {
        Stop-NodePids -NodePids $lingeringNodePids -Tag "[auto-run]"
    }
    else {
        Write-Host ("[auto-run] No lingering node process on port {0}. Clean exit." -f $Port)
    }
}
