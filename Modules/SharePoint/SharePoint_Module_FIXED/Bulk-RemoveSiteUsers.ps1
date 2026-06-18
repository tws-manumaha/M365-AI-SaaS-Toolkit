param($FilePath,$SiteUrl)
$users=Get-Content $FilePath
foreach($u in $users){try{Remove-SPOUser -Site $SiteUrl -LoginName $u; Write-Host "SUCCESS: $u"}catch{Write-Host "FAILED: $u"}}