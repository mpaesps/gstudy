$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Npm = Join-Path $Root "tools\node-v24.15.0-win-x64\npm.cmd"
$Cache = Join-Path $Root "tools\npm-cache"

Set-Location (Join-Path $Root "backend")
& $Npm install --cache $Cache
& $Npm run prisma:generate

Set-Location (Join-Path $Root "frontend")
& $Npm install --cache $Cache
