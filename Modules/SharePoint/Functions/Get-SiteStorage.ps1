param($SiteUrl)
Get-SPOSite -Identity $SiteUrl | Select StorageUsageCurrent