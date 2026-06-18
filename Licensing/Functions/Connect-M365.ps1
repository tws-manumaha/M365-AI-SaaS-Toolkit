function Connect-M365 {

    Write-Host "==================================="
    Write-Host " Connecting to Microsoft 365..."
    Write-Host "==================================="

    try {

        # Microsoft Graph
        Write-Host "Connecting to Microsoft Graph..."
        Connect-MgGraph -Scopes "User.ReadWrite.All","Group.ReadWrite.All","Directory.ReadWrite.All"

        # Exchange Online
        Write-Host "Connecting to Exchange Online..."
        Import-Module ExchangeOnlineManagement
        Connect-ExchangeOnline

        # SharePoint Online
        Write-Host "Connecting to SharePoint Online..."
        $spoUrl = Read-Host "Enter SharePoint Admin URL (e.g. https://tenant-admin.sharepoint.com)"
        Connect-SPOService -Url $spoUrl

        # Microsoft Teams
        Write-Host "Connecting to Microsoft Teams..."
        Import-Module MicrosoftTeams
        Connect-MicrosoftTeams

        Write-Host "✅ Successfully Connected to ALL Services" -ForegroundColor Green

    } catch {

        Write-Host "❌ Connection Failed" -ForegroundColor Red
        Write-Host $_

    }
}