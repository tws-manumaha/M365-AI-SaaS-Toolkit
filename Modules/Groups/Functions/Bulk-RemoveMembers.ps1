param($FilePath,$GroupId)
$users=Get-Content $FilePath
foreach($u in $users){try{Remove-MgGroupMember -GroupId $GroupId -DirectoryObjectId $u; Write-Host "SUCCESS: $u"}catch{Write-Host "FAILED: $u"}}