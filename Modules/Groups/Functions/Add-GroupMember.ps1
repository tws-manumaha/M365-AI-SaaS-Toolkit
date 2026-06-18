param($GroupId,$UserId)
New-MgGroupMember -GroupId $GroupId -DirectoryObjectId $UserId