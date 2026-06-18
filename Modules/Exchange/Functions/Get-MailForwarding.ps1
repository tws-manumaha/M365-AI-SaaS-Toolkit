param($UPN)
Get-Mailbox -Identity $UPN | Select ForwardingAddress