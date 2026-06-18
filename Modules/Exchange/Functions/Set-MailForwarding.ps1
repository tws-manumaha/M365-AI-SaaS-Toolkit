param($UPN,$ForwardTo)
Set-Mailbox -Identity $UPN -ForwardingSMTPAddress $ForwardTo