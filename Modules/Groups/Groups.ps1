
$functionPath = Join-Path $PSScriptRoot "functions"
Get-ChildItem $functionPath -Filter "*.ps1" | ForEach-Object {
 . $_.FullName
}
