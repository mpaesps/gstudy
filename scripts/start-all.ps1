$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Npm = Join-Path $Root "tools\node-v24.15.0-win-x64\npm.cmd"
$PgCtl = Join-Path $Root "tools\postgres\pgsql\bin\pg_ctl.exe"
$Data = Join-Path $Root "tools\postgres\data"
$Log = Join-Path $Root "tools\postgres\postgres.log"

& $PgCtl -D $Data status *> $null
if ($LASTEXITCODE -ne 0) {
  & $PgCtl -D $Data -l $Log start
}

Start-Process -FilePath "cmd.exe" `
  -ArgumentList "/c", "`"$Npm`" run start:dev > backend-dev.log 2>&1" `
  -WorkingDirectory (Join-Path $Root "backend") `
  -WindowStyle Hidden

Start-Process -FilePath "cmd.exe" `
  -ArgumentList "/c", "`"$Npm`" run dev > frontend-dev.log 2>&1" `
  -WorkingDirectory (Join-Path $Root "frontend") `
  -WindowStyle Hidden

Write-Host "Gstudy iniciado:"
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend:  http://localhost:3333/api"
Write-Host "PostgreSQL: localhost:5432 / database gstudy"
