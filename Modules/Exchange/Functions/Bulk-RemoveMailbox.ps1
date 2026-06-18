param($FilePath)
$users=Get-Content $FilePath
foreach($u in $users){try{Remove-Mailbox -Identity $u; Write-Host "SUCCESS: $u"}catch{Write-Host "FAILED: $u"}}