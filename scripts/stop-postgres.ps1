$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$PgCtl = Join-Path $Root "tools\postgres\pgsql\bin\pg_ctl.exe"
$Data = Join-Path $Root "tools\postgres\data"

& $PgCtl -D $Data stop
