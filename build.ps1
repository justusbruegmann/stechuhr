$ErrorActionPreference = "Stop"

  Set-Location -Path $PSScriptRoot

  Write-Host "Backend build"
  Push-Location backend
  try {
      npm install
      if ($LASTEXITCODE -ne 0) { throw "npm install (backend) fehlgeschlagen" }
      npx tsc
      if ($LASTEXITCODE -ne 0) { throw "npx tsc fehlgeschlagen" }
  } finally {
      Pop-Location
  }

  Write-Host "Frontend Build"
  Push-Location frontend
  try {
      npm install
      if ($LASTEXITCODE -ne 0) { throw "npm install (frontend) fehlgeschlagen" }
      npm run build
      if ($LASTEXITCODE -ne 0) { throw "npm run build fehlgeschlagen" }
  } finally {
      Pop-Location
  }

  Write-Host "done"