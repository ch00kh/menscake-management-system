# SubagentStop hook: when a subagent's task ends (e.g. after it opens its PR),
# kill any dev-server process it left running in its own git worktree so a
# stray bootRun/vite process doesn't keep holding this project's pinned ports
# (5173/8080) and confuse the next person/agent who tries to start one.
#
# Safety: only kills a listener whose command line path contains
# ".claude\worktrees" (or the forward-slash form) — i.e. only processes started
# from an agent worktree. Never touches a server run from the main checkout,
# so it can't kill a human's own manual test server.
$ports = 5173, 8080
$killed = @()

foreach ($port in $ports) {
  $lines = netstat -ano | Select-String ":$port\s+.*LISTENING"
  foreach ($line in $lines) {
    $procId = (($line -split '\s+') | Where-Object { $_ -ne "" })[-1]
    if ($procId -notmatch '^\d+$') { continue }

    try {
      $proc = Get-CimInstance Win32_Process -Filter "ProcessId=$procId" -ErrorAction Stop
    } catch {
      continue
    }

    if ($proc.CommandLine -match '\.claude[\\/]worktrees[\\/]') {
      Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
      $killed += "port $port (pid $procId)"
    }
  }
}

if ($killed.Count -gt 0) {
  $msg = "Cleaned up subagent-started dev server(s): " + ($killed -join ', ')
  @{ systemMessage = $msg } | ConvertTo-Json -Compress
}
exit 0
