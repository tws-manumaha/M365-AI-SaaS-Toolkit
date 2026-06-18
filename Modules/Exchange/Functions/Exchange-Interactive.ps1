while($true){
Write-Host "
=== EXCHANGE MENU ==="
Write-Host "1 Get Mailboxes
2 New Mailbox
3 Remove Mailbox
4 Shared Mailboxes
5 Mailbox Permissions
6 Mail Forwarding
7 Bulk Disable Mailbox
8 Bulk Enable Mailbox
9 Bulk Remove Mailbox
10 Exit"
$c=Read-Host "Choice"
switch($c){
"1"{Get-Mailbox}
"2"{$n=Read-Host "Name";$u=Read-Host "UPN";New-Mailbox -Name $n -UserPrincipalName $u}
"3"{$u=Read-Host "UPN";Remove-Mailbox -Identity $u}
"4"{Get-Mailbox -RecipientTypeDetails SharedMailbox}
"5"{$u=Read-Host "UPN";Get-MailboxPermission -Identity $u}
"6"{$u=Read-Host "UPN";Get-Mailbox -Identity $u | Select ForwardingAddress}
"7"{$f=Read-Host "File";$users=Get-Content $f;foreach($u in $users){Disable-Mailbox -Identity $u}}
"8"{$f=Read-Host "File";$users=Get-Content $f;foreach($u in $users){Enable-Mailbox -Identity $u}}
"9"{$f=Read-Host "File";$users=Get-Content $f;foreach($u in $users){Remove-Mailbox -Identity $u}}
"10"{break}
}
}