param($TeamId)
Get-TeamUser -GroupId $TeamId | Where {$_.Role -eq "Owner"}