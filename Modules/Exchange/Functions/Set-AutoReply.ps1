param($UPN,$Msg)
Set-MailboxAutoReplyConfiguration -Identity $UPN -AutoReplyState Enabled -InternalMessage $Msg