param($SiteUrl,$File)
Get-PnPFile -Url $File -Path . -FileName $File -AsFile