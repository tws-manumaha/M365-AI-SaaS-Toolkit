while($true){
Write-Host "
=== TEAMS MENU ==="
Write-Host "1 Get Teams
2 New Team
3 Remove Team
4 Get Users
5 Add User
6 Remove User
7 Channels
8 Bulk Add Users
9 Bulk Remove Users
10 Bulk Create Teams
11 Exit"
$c=Read-Host "Choice"
switch($c){
"1"{Get-Team}
"2"{$n=Read-Host "Name"; New-Team -DisplayName $n -Visibility Private}
"3"{$t=Read-Host "TeamId"; Remove-Team -GroupId $t}
"4"{$t=Read-Host "TeamId"; Get-TeamUser -GroupId $t}
"5"{$t=Read-Host "TeamId";$u=Read-Host "User"; Add-TeamUser -GroupId $t -User $u}
"6"{$t=Read-Host "TeamId";$u=Read-Host "User"; Remove-TeamUser -GroupId $t -User $u}
"7"{$t=Read-Host "TeamId"; Get-TeamChannel -GroupId $t}
"8"{$t=Read-Host "TeamId";$f=Read-Host "File";$users=Get-Content $f;foreach($u in $users){Add-TeamUser -GroupId $t -User $u}}
"9"{$t=Read-Host "TeamId";$f=Read-Host "File";$users=Get-Content $f;foreach($u in $users){Remove-TeamUser -GroupId $t -User $u}}
"10"{$f=Read-Host "CSV File";$teams=Import-Csv $f;foreach($t in $teams){New-Team -DisplayName $t.Name -Visibility Private}}
"11"{break}
}
}