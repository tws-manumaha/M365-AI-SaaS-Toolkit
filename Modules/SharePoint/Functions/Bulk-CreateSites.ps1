param($FilePath)
$sites=Import-Csv $FilePath
foreach($s in $sites){New-SPOSite -Title $s.Title -Url $s.Url -Owner admin@tenant.onmicrosoft.com}