param($FilePath)
$groups=Import-Csv $FilePath
foreach($g in $groups){New-MgGroup -DisplayName $g.Name -MailEnabled:$false -SecurityEnabled:$true -MailNickname $g.Name}