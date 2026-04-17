# FluentSaigon - Add Meta Tags + Open Graph to All Pages
# Run from: C:\Users\bobby\Documents\fluentsaigon
# Usage: .\add-meta-tags.ps1

$baseUrl = "https://fluentsaigon.com"
$ogImage = "https://fluentsaigon.com/images/og-image.jpg"
$siteName = "FluentSaigon"

$pages = @{
    "index.html" = @(
        "FluentSaigon - Speak Vietnamese Like a Local",
        "Stop sounding like a tourist. FluentSaigon teaches street-level Vietnamese the way people in Saigon actually talk. Free to start."
    )
    "pages/subjects.html" = @(
        "All Subjects - FluentSaigon",
        "Choose your Vietnamese subject. Numbers, Dates, Phrases, and Alphabet are free. Unlock Food, Getting Around, Markets, Cafe Culture, and more with Pro."
    )
    "pages/pricing.html" = @(
        "Pricing - FluentSaigon Pro",
        "Start free, upgrade when you're ready. FluentSaigon Pro unlocks all subjects, all difficulty levels, audio pronunciation, and progress tracking."
    )
    "pages/about.html" = @(
        "About - FluentSaigon",
        "FluentSaigon teaches Vietnamese the way it is actually spoken in Saigon, Hanoi, and Hoi An - with logic-first lessons and zero fluff."
    )
    "pages/account.html" = @(
        "My Account - FluentSaigon",
        "Manage your FluentSaigon account, subscription, and learning progress."
    )
    "pages/privacy.html" = @(
        "Privacy Policy - FluentSaigon",
        "FluentSaigon privacy policy - how we collect, use, and protect your data."
    )
    "pages/terms.html" = @(
        "Terms and Conditions - FluentSaigon",
        "FluentSaigon terms and conditions of use."
    )
    "pages/success.html" = @(
        "Welcome to Pro - FluentSaigon",
        "You are now a FluentSaigon Pro member. All subjects, all levels, and audio pronunciation are unlocked."
    )
    "pages/upgrade.html" = @(
        "Upgrade to Pro - FluentSaigon",
        "Unlock every Vietnamese subject, every difficulty level, and audio pronunciation. Start your 7-day free trial today."
    )
    "pages/quiz-numbers.html" = @(
        "Vietnamese Numbers Quiz - FluentSaigon",
        "Master Vietnamese numbers from 1 to 1,000,000. The foundation of dates, times, prices, and addresses. Free quiz with 3 difficulty levels."
    )
    "pages/quiz-dates.html" = @(
        "Vietnamese Dates and Times Quiz - FluentSaigon",
        "Learn to say days, months, and full dates in Vietnamese. Once you see the pattern, it clicks forever. Free quiz with 3 difficulty levels."
    )
    "pages/quiz-phrases.html" = @(
        "Vietnamese Phrases and Greetings Quiz - FluentSaigon",
        "How locals actually say hello, thank you, and everything in between - not the tourist phrases every app teaches. Free quiz."
    )
    "pages/quiz-alphabet.html" = @(
        "Vietnamese Alphabet and Tones Quiz - FluentSaigon",
        "Vietnamese has 6 tones. This is where most learners give up. Free quiz - master the tones that change everything."
    )
    "pages/quiz-food.html" = @(
        "Vietnamese Food and Street Eats Quiz - FluentSaigon",
        "Order off-menu, ask what is fresh, eat where locals eat - not the tourist traps. Pro quiz with 45 questions across 3 levels."
    )
    "pages/quiz-directions.html" = @(
        "Vietnamese Getting Around Quiz - FluentSaigon",
        "Motorbikes, Grab, xe om - navigate Vietnamese cities without looking lost. Pro quiz covering directions, transport, and travel phrases."
    )
    "pages/quiz-market.html" = @(
        "Vietnamese Markets and Bargaining Quiz - FluentSaigon",
        "Stop paying tourist prices. Learn to negotiate at the market like you mean it. Pro quiz with full bargaining vocabulary."
    )
    "pages/quiz-cafe.html" = @(
        "Vietnamese Cafe Culture Quiz - FluentSaigon",
        "Vietnamese coffee culture is serious. Order ca phe sua da like a local. Pro quiz with 45 questions across 3 levels."
    )
    "pages/quiz-colors.html" = @(
        "Vietnamese Colors and Descriptions Quiz - FluentSaigon",
        "Describe what you see, what you want, what does not fit quite right. Pro quiz covering colors, adjectives, and descriptive phrases."
    )
    "pages/quiz-family.html" = @(
        "Vietnamese Family and People Quiz - FluentSaigon",
        "Vietnamese address terms are unique - getting them right shows real respect. Pro quiz covering the full pronoun and family system."
    )
    "pages/quiz-health.html" = @(
        "Vietnamese Health and Emergencies Quiz - FluentSaigon",
        "The vocabulary you hope you never need, but absolutely should have. Pro quiz covering medical phrases and emergency Vietnamese."
    )
    "pages/quiz-weather.html" = @(
        "Vietnamese Weather and Seasons Quiz - FluentSaigon",
        "Vietnam has two seasons, not four. Know what is coming and how to talk about it. Pro quiz covering weather, climate, and travel phrases."
    )
    "pages/cheatsheet-numbers.html" = @(
        "Vietnamese Numbers Cheat Sheet - FluentSaigon",
        "Complete Vietnamese numbers reference from 1 to 1,000,000 - dates, times, prices, and addresses. Free printable cheat sheet."
    )
    "pages/cheatsheet-dates.html" = @(
        "Vietnamese Dates and Times Cheat Sheet - FluentSaigon",
        "Days, months, telling time, and full dates in Vietnamese. Free printable reference guide with pronunciation."
    )
    "pages/cheatsheet-phrases.html" = @(
        "Vietnamese Phrases and Greetings Cheat Sheet - FluentSaigon",
        "Essential Vietnamese phrases for travelers and expats - greetings, thanks, apologies, and the pronoun system. Free cheat sheet."
    )
    "pages/cheatsheet-alphabet.html" = @(
        "Vietnamese Alphabet and Tones Cheat Sheet - FluentSaigon",
        "All 6 tones, special consonants, vowels, North vs South differences, and reading practice. The foundation of Vietnamese pronunciation."
    )
    "pages/cheatsheet-food.html" = @(
        "Vietnamese Food and Street Eats Cheat Sheet - FluentSaigon",
        "Order food like a local - dishes, drinks, ingredients, and how to ask what is fresh. Pro cheat sheet with pronunciation guide."
    )
    "pages/cheatsheet-directions.html" = @(
        "Vietnamese Getting Around Cheat Sheet - FluentSaigon",
        "Directions, transport types, Grab phrases, and navigation vocabulary. Everything you need to get around Vietnamese cities."
    )
    "pages/cheatsheet-market.html" = @(
        "Vietnamese Markets and Bargaining Cheat Sheet - FluentSaigon",
        "Full bargaining script, price phrases, and market vocabulary. Stop paying tourist prices at Vietnamese markets."
    )
    "pages/cheatsheet-cafe.html" = @(
        "Vietnamese Cafe Culture Cheat Sheet - FluentSaigon",
        "How to order Vietnamese coffee, tea, and drinks like a local. Ca phe sua da, bac xiu, and everything in between."
    )
    "pages/cheatsheet-colors.html" = @(
        "Vietnamese Colors and Descriptions Cheat Sheet - FluentSaigon",
        "Colors, adjectives, and descriptive phrases in Vietnamese with grammar rules for how adjectives work in sentences."
    )
    "pages/cheatsheet-family.html" = @(
        "Vietnamese Family and People Cheat Sheet - FluentSaigon",
        "The complete Vietnamese pronoun and family term system - the most unique and important part of the language. Pro cheat sheet."
    )
    "pages/cheatsheet-weather.html" = @(
        "Vietnamese Weather and Seasons Cheat Sheet - FluentSaigon",
        "Vietnam two-season system, weather vocabulary, regional climate differences, useful phrases, and travel tips by region."
    )
}

function Get-MetaBlock {
    param($title, $description, $url, $ogImage, $siteName)
    $lines = @(
        "  <!-- SEO + Open Graph -->",
        "  <meta name=`"robots`" content=`"index, follow`">",
        "  <meta name=`"author`" content=`"FluentSaigon`">",
        "  <meta name=`"keywords`" content=`"learn Vietnamese, Vietnamese phrases, Vietnamese for travelers, Vietnamese language, speak Vietnamese`">",
        "  <link rel=`"canonical`" href=`"$url`">",
        "  <meta property=`"og:type`" content=`"website`">",
        "  <meta property=`"og:site_name`" content=`"$siteName`">",
        "  <meta property=`"og:title`" content=`"$title`">",
        "  <meta property=`"og:description`" content=`"$description`">",
        "  <meta property=`"og:url`" content=`"$url`">",
        "  <meta property=`"og:image`" content=`"$ogImage`">",
        "  <meta property=`"og:image:width`" content=`"1200`">",
        "  <meta property=`"og:image:height`" content=`"630`">",
        "  <meta property=`"og:image:alt`" content=`"FluentSaigon - Speak Vietnamese Like a Local`">",
        "  <meta name=`"twitter:card`" content=`"summary_large_image`">",
        "  <meta name=`"twitter:title`" content=`"$title`">",
        "  <meta name=`"twitter:description`" content=`"$description`">",
        "  <meta name=`"twitter:image`" content=`"$ogImage`">"
    )
    return $lines -join "`n"
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$successCount = 0
$skipCount = 0

foreach ($relativePath in $pages.Keys) {
    $filePath = Join-Path $projectRoot $relativePath
    $pageData = $pages[$relativePath]
    $title = $pageData[0]
    $description = $pageData[1]

    if ($relativePath -eq "index.html") {
        $canonicalUrl = $baseUrl + "/"
    } else {
        $cleanPath = $relativePath -replace "^pages/", "/pages/"
        $canonicalUrl = $baseUrl + $cleanPath
    }

    if (-not (Test-Path $filePath)) {
        Write-Host "SKIP (not found): $relativePath" -ForegroundColor Yellow
        $skipCount++
        continue
    }

    $content = Get-Content $filePath -Raw -Encoding UTF8

    if ($content -match 'property="og:title"') {
        Write-Host "SKIP (already done): $relativePath" -ForegroundColor Cyan
        $skipCount++
        continue
    }

    $metaBlock = Get-MetaBlock -title $title -description $description -url $canonicalUrl -ogImage $ogImage -siteName $siteName
    $newContent = $content -replace '(<meta name="description"[^>]+>)', "`$1`n$metaBlock"
    $newContent = $newContent -replace '<title>[^<]+</title>', "<title>$title</title>"

    [System.IO.File]::WriteAllText($filePath, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host "DONE: $relativePath" -ForegroundColor Green
    $successCount++
}

Write-Host ""
Write-Host "============================" -ForegroundColor White
Write-Host "Done! $successCount updated, $skipCount skipped." -ForegroundColor White
Write-Host "============================" -ForegroundColor White
Write-Host "Next: git ship" -ForegroundColor Yellow
