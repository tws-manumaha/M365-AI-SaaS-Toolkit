param($FilePath,$TeamId)
$users=Get-Content $FilePath
foreach($u in $users){try{Remove-TeamUser -GroupId $TeamId -User $u; Write-Host "SUCCESS: $u"}catch{Write-Host "FAILED: $u"}}