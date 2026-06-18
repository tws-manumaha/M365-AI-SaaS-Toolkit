param($UPN)
Get-InboxRule -Mailbox $UPN | Remove-InboxRule -Confirm:$false