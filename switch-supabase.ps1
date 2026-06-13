# Bascule les .env du projet Netodash vers ton propre Supabase (Windows).
#
# Usage:
#   .\switch-supabase.ps1 `
#     -Url "https://kycehzweexbutkxygcpc.supabase.co" `
#     -Anon "eyJ..." `
#     -Service "eyJ..."

param(
  [Parameter(Mandatory = $true)][string]$Url,
  [Parameter(Mandatory = $true)][string]$Anon,
  [Parameter(Mandatory = $true)][string]$Service,
  [string]$ProjectId = "",
  [switch]$DryRun
)

if (-not $ProjectId) {
  if ($Url -match "https?://([^.]+)\.") { $ProjectId = $Matches[1] }
  else { throw "Impossible de déduire project_id depuis l'URL" }
}

$envContent = @"
# Migré vers ton propre Supabase ($(Get-Date -Format o))
SUPABASE_PROJECT_ID="$ProjectId"
SUPABASE_URL="$Url"
SUPABASE_PUBLISHABLE_KEY="$Anon"
VITE_SUPABASE_PROJECT_ID="$ProjectId"
VITE_SUPABASE_URL="$Url"
VITE_SUPABASE_PUBLISHABLE_KEY="$Anon"
"@

$envLocalContent = @"
# SECRETS — ne jamais commiter. Chargés par le runtime serveur.
SUPABASE_SERVICE_ROLE_KEY="$Service"
"@

Write-Host "→ project_id : $ProjectId"
Write-Host "→ url        : $Url"
Write-Host "→ anon       : $($Anon.Substring(0, [Math]::Min(20, $Anon.Length)))..."
Write-Host "→ service    : $($Service.Substring(0, [Math]::Min(20, $Service.Length)))... (vers .env.local)"

if ($DryRun) {
  Write-Host "--- .env ---"; Write-Host $envContent
  Write-Host "--- .env.local ---"; Write-Host $envLocalContent
  exit 0
}

if (Test-Path ".env") {
  Copy-Item ".env" ".env.lovable-cloud.bak" -Force
  Write-Host "✓ Backup: .env.lovable-cloud.bak"
}

Set-Content -Path ".env" -Value $envContent -Encoding utf8
Write-Host "✓ Écrit: .env"
Set-Content -Path ".env.local" -Value $envLocalContent -Encoding utf8
Write-Host "✓ Écrit: .env.local"

if (Test-Path ".gitignore") {
  $gi = Get-Content ".gitignore" -Raw
  if ($gi -notmatch '(?m)^\.env\.local$') {
    Add-Content ".gitignore" "`n.env.local"
    Write-Host "✓ Ajouté .env.local à .gitignore"
  }
}

Write-Host @"

Prochaines étapes:
  1. Recharge le dev server (bun dev) pour prendre en compte les nouvelles vars.
  2. Vérifie que tu peux te connecter sur /auth avec un user de ton nouveau Supabase.
  3. Recopie les secrets côté serveur (Stripe, Unitech, Shopify, OpenAI) dans ton hébergement.
  4. Reconfigure les webhooks externes vers ta nouvelle URL.
"@
