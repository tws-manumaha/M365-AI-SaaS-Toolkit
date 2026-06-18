param($SiteUrl,$User)
Set-SPOUser -Site $SiteUrl -LoginName $User -IsSiteCollectionAdmin $true