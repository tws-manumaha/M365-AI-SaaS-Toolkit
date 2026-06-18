param($UPN)
Set-Mailbox -Identity $UPN -ForwardingSMTPAddress $null