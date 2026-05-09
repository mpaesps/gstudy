$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Npm = Join-Path $Root "tools\node-v24.15.0-win-x64\npm.cmd"

Set-Location (Join-Path $Root "frontend")
& $Npm run dev
