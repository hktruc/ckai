param(
  [ValidateSet('install','start','status','stop','uninstall')]
  [string]$Action = 'status'
)

$ErrorActionPreference = 'Stop'
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
$Runner = Join-Path $RepoRoot 'runtime\production-bridge\src\runner.mjs'
$Jobs = Join-Path $RepoRoot 'runtime\jobs'
$PidFile = Join-Path $Jobs 'runner.pid'
$StartupDir = [Environment]::GetFolderPath('Startup')
$StartupFile = Join-Path $StartupDir 'CKAI Local Runner.cmd'

function Get-CkaiProcess {
  if (-not (Test-Path -LiteralPath $PidFile)) { return $null }
  $RunnerPid = [int](Get-Content -LiteralPath $PidFile -Raw)
  $ProcessInfo = Get-CimInstance Win32_Process -Filter "ProcessId = $RunnerPid" -ErrorAction SilentlyContinue
  if ($null -eq $ProcessInfo -or $ProcessInfo.CommandLine -notlike "*$Runner*") { return $null }
  return $ProcessInfo
}

switch ($Action) {
  'install' {
    $Command = "@echo off`r`npowershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$PSCommandPath`" start`r`n"
    Set-Content -LiteralPath $StartupFile -Value $Command -Encoding Ascii
    & $PSCommandPath start
    Write-Output "CKAI Local Runner auto-start installed for the current Windows user."
  }
  'start' {
    New-Item -ItemType Directory -Force -Path $Jobs | Out-Null
    if ($null -ne (Get-CkaiProcess)) { Write-Output 'CKAI Local Runner is already running.'; break }
    if (Test-Path -LiteralPath $PidFile) { Remove-Item -LiteralPath $PidFile -Force }
    $NodeArguments = @("`"$Runner`"", '--watch', '--repo-root', "`"$RepoRoot`"", '--poll-ms', '5000')
    Start-Process -FilePath 'node.exe' -ArgumentList $NodeArguments -WorkingDirectory $RepoRoot -WindowStyle Hidden
    Start-Sleep -Milliseconds 500
    if ($null -eq (Get-CkaiProcess)) { throw 'CKAI Local Runner did not start; inspect runtime/jobs/logs/runner.jsonl.' }
    Write-Output 'CKAI Local Runner started.'
  }
  'status' {
    $ProcessInfo = Get-CkaiProcess
    if ($null -eq $ProcessInfo) { Write-Output 'CKAI Local Runner: STOPPED'; exit 1 }
    Write-Output "CKAI Local Runner: RUNNING (PID $($ProcessInfo.ProcessId))"
  }
  'stop' {
    $ProcessInfo = Get-CkaiProcess
    if ($null -eq $ProcessInfo) { if (Test-Path -LiteralPath $PidFile) { Remove-Item -LiteralPath $PidFile -Force }; Write-Output 'CKAI Local Runner is already stopped.'; break }
    Stop-Process -Id $ProcessInfo.ProcessId
    if (Test-Path -LiteralPath $PidFile) { Remove-Item -LiteralPath $PidFile -Force }
    Write-Output 'CKAI Local Runner stopped.'
  }
  'uninstall' {
    & $PSCommandPath stop
    if (Test-Path -LiteralPath $StartupFile) { Remove-Item -LiteralPath $StartupFile -Force }
    Write-Output 'CKAI Local Runner auto-start removed for the current Windows user.'
  }
}
