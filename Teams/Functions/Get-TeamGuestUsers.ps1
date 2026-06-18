param($TeamId)
Get-TeamUser -GroupId $TeamId | Where {$_.UserType -eq "Guest"}