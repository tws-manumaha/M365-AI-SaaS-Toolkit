param($Name)
New-MgGroup -DisplayName $Name -MailEnabled:$false -SecurityEnabled:$true -MailNickname $Name