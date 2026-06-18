param($TeamId)
Get-TeamChannel -GroupId $TeamId | Where {$_.MembershipType -eq "Standard"}