param($FilePath)
$teams=Import-Csv $FilePath
foreach($t in $teams){New-Team -DisplayName $t.Name -Visibility Private}