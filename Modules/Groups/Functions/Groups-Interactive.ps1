
while($true){
Write-Host "
=== GROUPS MENU ==="
Write-Host "1 Get Groups
2 New Group
3 Delete Group
4 Get Members
5 Add Member
6 Remove Member
7 Bulk Add Members
8 Bulk Remove Members
9 Bulk Create Groups
10 Exit"
$c=Read-Host "Choice"
switch($c){
"1"{Get-MgGroup}
"2"{$n=Read-Host "Name"; New-MgGroup -DisplayName $n -MailEnabled:$false -SecurityEnabled:$true -MailNickname $n}
"3"{$g=Read-Host "GroupId"; Remove-MgGroup -GroupId $g}
"4"{$g=Read-Host "GroupId"; Get-MgGroupMember -GroupId $g}
"5"{$g=Read-Host "GroupId";$u=Read-Host "UserId"; New-MgGroupMember -GroupId $g -DirectoryObjectId $u}
"6"{$g=Read-Host "GroupId";$u=Read-Host "UserId"; Remove-MgGroupMember -GroupId $g -DirectoryObjectId $u}
"7"{$g=Read-Host "GroupId";$f=Read-Host "File"; $users=Get-Content $f;foreach($u in $users){New-MgGroupMember -GroupId $g -DirectoryObjectId $u}}
"8"{$g=Read-Host "GroupId";$f=Read-Host "File"; $users=Get-Content $f;foreach($u in $users){Remove-MgGroupMember -GroupId $g -DirectoryObjectId $u}}
"9"{$f=Read-Host "CSV File";$groups=Import-Csv $f;foreach($g in $groups){New-MgGroup -DisplayName $g.Name -MailEnabled:$false -SecurityEnabled:$true -MailNickname $g.Name}}
"10"{break}
}
}
