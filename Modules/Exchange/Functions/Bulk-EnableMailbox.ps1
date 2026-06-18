param($FilePath)
$users=Get-Content $FilePath
foreach($u in $users){try{Enable-Mailbox -Identity $u; Write-Host "SUCCESS: $u"}catch{Write-Host "FAILED: $u"}}