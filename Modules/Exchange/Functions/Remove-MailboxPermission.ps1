param($UPN,$User)
Remove-MailboxPermission -Identity $UPN -User $User -AccessRights FullAccess