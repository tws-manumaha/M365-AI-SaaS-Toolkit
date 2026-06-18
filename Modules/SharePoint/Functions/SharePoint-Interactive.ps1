while($true){
Write-Host "
=== SHAREPOINT MENU ==="
Write-Host "1 Get Sites
2 New Site
3 Remove Site
4 Get Users
5 Add User
6 Remove User
7 Bulk Add Users
8 Bulk Remove Users
9 Bulk Create Sites
10 Exit"
$c=Read-Host "Choice"
switch($c){
"1"{Get-SPOSite}
"2"{$t=Read-Host "Title";$u=Read-Host "URL";New-SPOSite -Title $t -Url $u}
"3"{$u=Read-Host "URL";Remove-SPOSite -Identity $u}
"4"{$u=Read-Host "URL";Get-SPOUser -Site $u}
"5"{$u=Read-Host "URL";$usr=Read-Host "User";Set-SPOUser -Site $u -LoginName $usr -IsSiteCollectionAdmin $true}
"6"{$u=Read-Host "URL";$usr=Read-Host "User";Remove-SPOUser -Site $u -LoginName $usr}
"7"{$u=Read-Host "URL";$f=Read-Host "File";$users=Get-Content $f;foreach($x in $users){Set-SPOUser -Site $u -LoginName $x -IsSiteCollectionAdmin $true}}
"8"{$u=Read-Host "URL";$f=Read-Host "File";$users=Get-Content $f;foreach($x in $users){Remove-SPOUser -Site $u -LoginName $x}}
"9"{$f=Read-Host "CSV";$s=Import-Csv $f;foreach($i in $s){New-SPOSite -Title $i.Title -Url $i.Url}}
"10"{break}
}
}