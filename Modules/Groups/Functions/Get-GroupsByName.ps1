param($Name)
Get-MgGroup -Filter "startswith(DisplayName,'$Name')"