function Invoke-SecurityTask13 {
    param(
        [string]$InputFile
    )

    if ($InputFile) {
        if ($InputFile -like "*.csv") {
            $data = Import-Csv $InputFile
        } else {
            $data = Get-Content $InputFile
        }

        foreach ($item in $data) {
            Write-Output "Processing: $item"
        }
    }
    else {
        Write-Output "Invoke-SecurityTask13 executed"
    }
}
