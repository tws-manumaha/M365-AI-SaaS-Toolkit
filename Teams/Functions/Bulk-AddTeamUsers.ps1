param($FilePath,$TeamId)
$users=Get-Content $FilePath
foreach($u in $users){try{Add-TeamUser -GroupId $TeamId -User $u; Write-Host "SUCCESS: $u"}catch{Write-Host "FAILED: $u"}}