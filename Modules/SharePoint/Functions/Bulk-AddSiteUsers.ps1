param($FilePath,$SiteUrl)
$users=Get-Content $FilePath
foreach($u in $users){try{Set-SPOUser -Site $SiteUrl -LoginName $u -IsSiteCollectionAdmin $true; Write-Host "SUCCESS: $u"}catch{Write-Host "FAILED: $u"}}