# FluentSaigon - Add Google Analytics to All Pages
# Run from: C:\Users\bobby\Documents\fluentsaigon
# Usage: .\add-analytics.ps1

$measurementId = "G-LN51VD3PC5"

$gaSnippet = @"
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=$measurementId"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '$measurementId');
  </script>
"@

$htmlFiles = @(
    "index.html",
    "pages/about.html",
    "pages/account.html",
    "pages/pricing.html",
    "pages/privacy.html",
    "pages/terms.html",
    "pages/success.html",
    "pages/upgrade.html",
    "pages/subjects.html",
    "pages/quiz-numbers.html",
    "pages/quiz-dates.html",
    "pages/quiz-phrases.html",
    "pages/quiz-alphabet.html",
    "pages/quiz-food.html",
    "pages/quiz-directions.html",
    "pages/quiz-market.html",
    "pages/quiz-cafe.html",
    "pages/quiz-colors.html",
    "pages/quiz-family.html",
    "pages/quiz-health.html",
    "pages/quiz-weather.html",
    "pages/cheatsheet-numbers.html",
    "pages/cheatsheet-dates.html",
    "pages/cheatsheet-phrases.html",
    "pages/cheatsheet-alphabet.html",
    "pages/cheatsheet-food.html",
    "pages/cheatsheet-directions.html",
    "pages/cheatsheet-market.html",
    "pages/cheatsheet-cafe.html",
    "pages/cheatsheet-colors.html",
    "pages/cheatsheet-family.html",
    "pages/cheatsheet-weather.html"
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$successCount = 0
$skipCount = 0

foreach ($relativePath in $htmlFiles) {
    $filePath = Join-Path $projectRoot $relativePath

    if (-not (Test-Path $filePath)) {
        Write-Host "SKIP (not found): $relativePath" -ForegroundColor Yellow
        $skipCount++
        continue
    }

    $content = Get-Content $filePath -Raw -Encoding UTF8

    if ($content -match "googletagmanager.com/gtag") {
        Write-Host "SKIP (already has GA): $relativePath" -ForegroundColor Cyan
        $skipCount++
        continue
    }

    $newContent = $content -replace '</head>', "$gaSnippet</head>"

    [System.IO.File]::WriteAllText($filePath, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host "DONE: $relativePath" -ForegroundColor Green
    $successCount++
}

Write-Host ""
Write-Host "============================" -ForegroundColor White
Write-Host "Done! $successCount updated, $skipCount skipped." -ForegroundColor White
Write-Host "============================" -ForegroundColor White
Write-Host "Next: git ship" -ForegroundColor Yellow
