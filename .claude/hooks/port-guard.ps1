# PreToolUse hook for Bash: keeps this project's dev servers pinned to fixed
# ports (frontend 5173, backend 8080) so CORS config and firewall rules stay
# valid. Denies only explicit overrides to a different port; the default
# (no override) case is untouched since it already uses the right port.
$stdin = [Console]::In.ReadToEnd()
try { $j = $stdin | ConvertFrom-Json } catch { exit 0 }
$cmd = $j.tool_input.command
if (-not $cmd) { exit 0 }

if ($cmd -match "(npm\s+run\s+dev|\bvite\b)") {
  if ($cmd -match "--port[= ]+(\d+)") {
    $port = $matches[1]
    if ($port -ne "5173") {
      $reason = "This project's frontend dev server is pinned to port 5173 (requested: $port). Re-run without overriding --port."
      @{ hookSpecificOutput = @{ hookEventName = "PreToolUse"; permissionDecision = "deny"; permissionDecisionReason = $reason } } | ConvertTo-Json -Compress
      exit 0
    }
  }
}

if ($cmd -match "(bootRun|spring-boot:run)") {
  if ($cmd -match "(server\.port|SERVER_PORT)=(\d+)") {
    $port = $matches[2]
    if ($port -ne "8080") {
      $reason = "This project's backend is pinned to port 8080 (requested: $port). Re-run without overriding server.port."
      @{ hookSpecificOutput = @{ hookEventName = "PreToolUse"; permissionDecision = "deny"; permissionDecisionReason = $reason } } | ConvertTo-Json -Compress
      exit 0
    }
  }
}

exit 0
