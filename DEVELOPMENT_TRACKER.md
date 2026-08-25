# M365-AI-SaaS-Toolkit — Development Tracker

> **Branch:** `development/v2`
> **Created:** 25 August 2026
> **Last Updated:** 25 August 2026
> **Legend:** `[ ]` Not Started · `[~]` In Progress · `[x]` Done · `[!]` Blocked

---

## Phase 1: Audit & Clean

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Delete 60 `Invoke-*Task1-30.ps1` stubs (30 Security + 30 Recovery) | [ ] | Pure templates, no M365 cmdlets |
| 1.2 | Delete 29 `SharePoint_Module_FIXED/` duplicate files | [ ] | Duplicates of SharePoint/Functions/ |
| 1.3 | Delete 31 `Licensing/*.txt` description files | [ ] | One-liner descriptions, not code |
| 1.4 | Delete `copilotRoutes.js` (legacy keyword copilot) | [ ] | Superseded by `aiRoutes.js` |
| 1.5 | Delete `powershellPool.js` (legacy PS pool) | [ ] | Superseded by `securePowerShellRunner.js` |
| 1.6 | Delete `azureAuth-original.js` (reference only) | [ ] | Older version of azureAuth.js |
| 1.7 | Remove `memoryRoutes.js` if not needed (147 bytes) | [ ] | Stub — evaluate before removing |
| 1.8 | Audit remaining files for any other empty/placeholder content | [ ] | Check for files < 50 bytes |
| 1.9 | Document the clean baseline (file count, module count) | [ ] | Record state after cleanup |

**Phase 1 Exit Criteria:** No file under 200 bytes. No duplicate directories. No legacy routes.

---

## Phase 2: Fix the Auth Chain

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Modify `securePowerShellRunner.js` to accept sessionId from route handler | [ ] | Currently creates sessions without token |
| 2.2 | Retrieve access token from `azureAuth.getSession(sessionId)` in PS runner | [ ] | Token exists in session but not passed to PS |
| 2.3 | Replace `Get-AzureToken` placeholder in `_connectToTenant()` | [ ] | Currently calls non-existent function |
| 2.4 | Implement `Connect-MgGraph -AccessToken $token` in PS init | [ ] | Graph API connection |
| 2.5 | Implement `Connect-ExchangeOnline` with token-based auth | [ ] | Exchange Online connection |
| 2.6 | Implement `Connect-MicrosoftTeams` with token-based auth | [ ] | Teams connection |
| 2.7 | Handle token expiry and refresh in PS session lifecycle | [ ] | Tokens expire ~1hr; need proactive refresh |
| 2.8 | Pass sessionId through moduleRoutes → module wrapper → PS runner | [ ] | Trace the full call chain |
| 2.9 | Test: Auth flow → PS session → `Get-MgUser` returns real data | [ ] | End-to-end verification |

**Phase 2 Exit Criteria:** User authenticates via device code, PS session executes `Get-MgUser` with the obtained token.

---

## Phase 3: Standardize PowerShell Functions

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Define and document the standard function pattern | [ ] | CmdletBinding, begin/process/end, try/catch, PSCustomObject |
| 3.2 | Standardize Users module (29 functions) | [ ] | Reference pattern — most complete |
| 3.3 | Standardize Licensing module (15 functions) | [ ] | Convert any .txt to .ps1 if needed |
| 3.4 | Standardize Recovery module (15 functions) | [ ] | Verify undo operations capture pre-state |
| 3.5 | Standardize Groups module (11 functions) | [ ] | |
| 3.6 | Standardize Exchange module (7 functions) | [ ] | |
| 3.7 | Standardize Security module (5 functions) | [ ] | |
| 3.8 | Standardize Teams module (4 functions) | [ ] | |
| 3.9 | Standardize SharePoint module (4 functions) | [ ] | |
| 3.10 | Fix recursive function naming across all stubs | [ ] | `New-Team` calls `New-Team` → infinite recursion |
| 3.11 | Verify consistent output contract (`{ Success; Message; Data }`) | [ ] | Backend expects JSON `{ success, message, data }` |
| 3.12 | Run PSScriptAnalyzer across all .ps1 files | [ ] | Lint check |

**Phase 3 Exit Criteria:** Every .ps1 file follows the standard pattern. Consistent output contract across all modules.

---

## Phase 4: Implement Missing Functions

### 4a. Teams Module (27 functions)

| # | Function | Status | Notes |
|---|----------|--------|-------|
| 4a.1 | `New-Team` | [ ] | Fix recursion — call MicrosoftTeams `New-Team` cmdlet |
| 4a.2 | `New-TeamChannel` | [ ] | `New-TeamChannel -TeamId -DisplayName` |
| 4a.3 | `Set-TeamSettings` | [ ] | `Set-Team -GroupId` |
| 4a.4 | `Archive-Team` | [ ] | `Set-TeamArchived -GroupId` |
| 4a.5 | `Unarchive-Team` | [ ] | `Set-TeamArchived -GroupId -Archived:$false` |
| 4a.6 | `Remove-Team` | [ ] | `Remove-Team -GroupId` |
| 4a.7 | `Add-TeamUser` | [ ] | `Add-TeamUser -GroupId -User` |
| 4a.8 | `Remove-TeamUser` | [ ] | `Remove-TeamUser -GroupId -User` |
| 4a.9 | `Add-TeamOwner` | [ ] | `Add-TeamUser -Role Owner` |
| 4a.10 | `Remove-TeamOwner` | [ ] | `Remove-TeamUser -Role Owner` |
| 4a.11 | `Get-TeamApps` | [ ] | `Get-TeamApp -GroupId` |
| 4a.12 | `Add-TeamApp` | [ ] | `Add-TeamApp -GroupId -AppId` |
| 4a.13 | `Remove-TeamApp` | [ ] | `Remove-TeamApp -GroupId -AppId` |
| 4a.14 | `Get-EmptyTeams` | [ ] | Filter teams with no members/channels |
| 4a.15 | `Get-LargeTeams` | [ ] | Filter teams with >N members |
| 4a.16 | `Get-PrivateChannels` | [ ] | `Get-TeamChannel -MembershipType Private` |
| 4a.17 | `Get-StandardChannels` | [ ] | `Get-TeamChannel -MembershipType Standard` |
| 4a.18 | `Get-TeamGuestUsers` | [ ] | Filter guest users in team |
| 4a.19 | `Remove-TeamGuestUsers` | [ ] | Bulk remove guests |
| 4a.20 | `Bulk-CreateTeams` | [ ] | CSV input → loop New-Team |
| 4a.21 | `Bulk-AddTeamUsers` | [ ] | CSV input → loop Add-TeamUser |
| 4a.22 | `Bulk-RemoveTeamUsers` | [ ] | CSV input → loop Remove-TeamUser |
| 4a.23 | `Clone-Team` | [ ] | Copy team structure |
| 4a.24 | `Restore-Team` | [ ] | Restore deleted team |
| 4a.25 | `Export-TeamReport` | [ ] | CSV/HTML report |

### 4b. SharePoint Module (25 functions)

| # | Function | Status | Notes |
|---|----------|--------|-------|
| 4b.1 | `New-Site` | [ ] | `New-SPOSite -Title -Url -Owner` |
| 4b.2 | `Remove-Site` | [ ] | `Remove-SPOSite -Url` |
| 4b.3 | `Restore-Site` | [ ] | `Restore-SPODeletedSite -Url` |
| 4b.4 | `Add-SiteUser` | [ ] | Add user to site permissions |
| 4b.5 | `Remove-SiteUser` | [ ] | Remove user from site |
| 4b.6 | `Get-SitePermissions` | [ ] | List site permissions |
| 4b.7 | `Grant-SitePermission` | [ ] | Grant specific permission level |
| 4b.8 | `Revoke-SitePermission` | [ ] | Remove permission level |
| 4b.9 | `Get-SharingSettings` | [ ] | `Get-SPOSite -Url | Select SharingCapability` |
| 4b.10 | `Set-SharingSettings` | [ ] | `Set-SPOSite -SharingCapability` |
| 4b.11 | `Get-Lists` | [ ] | Get lists on a site |
| 4b.12 | `New-List` | [ ] | Create list |
| 4b.13 | `Remove-List` | [ ] | Delete list |
| 4b.14 | `Get-Documents` | [ ] | List documents in library |
| 4b.15 | `Upload-File` | [ ] | Upload to document library |
| 4b.16 | `Download-File` | [ ] | Download from document library |
| 4b.17 | `Get-EmptySites` | [ ] | Filter sites with no content |
| 4b.18 | `Get-LargeSites` | [ ] | Filter sites by storage usage |
| 4b.19 | `Bulk-CreateSites` | [ ] | CSV input → loop New-SPOSite |
| 4b.20 | `Bulk-AddSiteUsers` | [ ] | CSV input → loop |
| 4b.21 | `Bulk-RemoveSiteUsers` | [ ] | CSV input → loop |
| 4b.22 | `Remove-DeletedSite` | [ ] | Permanently delete from recycle bin |
| 4b.23 | `Export-SitesReport` | [ ] | CSV/HTML report |
| 4b.24 | `Set-SiteStorage` | [ ] | `Set-SPOSite -StorageMaximumLevel` |

### 4c. Exchange Module (23 functions)

| # | Function | Status | Notes |
|---|----------|--------|-------|
| 4c.1 | `New-Mailbox` | [ ] | Fix recursion — use Exchange cmdlet |
| 4c.2 | `New-SharedMailbox` | [ ] | `New-Mailbox -Shared` |
| 4c.3 | `Remove-SharedMailbox` | [ ] | `Remove-Mailbox` |
| 4c.4 | `Enable-Mailbox` | [ ] | Enable mailbox for existing user |
| 4c.5 | `Disable-Mailbox` | [ ] | Disable mailbox |
| 4c.6 | `Remove-Mailbox` | [ ] | Delete mailbox |
| 4c.7 | `Remove-MailboxPermission` | [ ] | `Remove-MailboxPermission` |
| 4c.8 | `Get-MailboxRules` | [ ] | `Get-InboxRule` |
| 4c.9 | `Remove-MailboxRules` | [ ] | `Remove-InboxRule` |
| 4c.10 | `Get-AutoReply` | [ ] | `Get-MailboxAutoReplyConfiguration` |
| 4c.11 | `Set-AutoReply` | [ ] | `Set-MailboxAutoReplyConfiguration` |
| 4c.12 | `Remove-AutoReply` | [ ] | Disable auto-reply |
| 4c.13 | `Get-MailForwarding` | [ ] | Check forwarding settings |
| 4c.14 | `Set-MailForwarding` | [ ] | Set forwarding address |
| 4c.15 | `Remove-MailForwarding` | [ ] | Clear forwarding |
| 4c.16 | `Get-TransportRules` | [ ] | `Get-TransportRule` |
| 4c.17 | `Enable-MailboxAudit` | [ ] | `Set-Mailbox -AuditEnabled $true` |
| 4c.18 | `Get-MailboxAudit` | [ ] | `Search-MailboxAuditLog` |
| 4c.19 | `Export-MailboxReport` | [ ] | CSV/HTML report |
| 4c.20 | `Bulk-EnableMailbox` | [ ] | CSV input → loop |
| 4c.21 | `Bulk-DisableMailbox` | [ ] | CSV input → loop |
| 4c.22 | `Bulk-RemoveMailbox` | [ ] | CSV input → loop |

### 4d. Groups Module (16 functions)

| # | Function | Status | Notes |
|---|----------|--------|-------|
| 4d.1 | `Update-Group` | [ ] | `Update-MgGroup` |
| 4d.2 | `Get-GroupSettings` | [ ] | Group settings |
| 4d.3 | `Get-GroupTypes` | [ ] | Filter by type (Unified, Security, etc.) |
| 4d.4 | `Get-GroupsByName` | [ ] | Search by display name |
| 4d.5 | `Get-GuestsInGroups` | [ ] | Find guest users across groups |
| 4d.6 | `Get-LargeGroups` | [ ] | Groups with >N members |
| 4d.7 | `Get-O365Groups` | [ ] | Filter unified groups |
| 4d.8 | `Get-OrphanGroups` | [ ] | Groups with no owners |
| 4d.9 | `Get-SecurityGroups` | [ ] | Filter security groups |
| 4d.10 | `Clean-EmptyGroups` | [ ] | Remove/archive empty groups |
| 4d.11 | `Clone-Group` | [ ] | Copy group structure |
| 4d.12 | `Transfer-Ownership` | [ ] | Change group owner |
| 4d.13 | `Remove-GuestUsers` | [ ] | Remove guests from all groups |
| 4d.14 | `Group-ActivityReport` | [ ] | Activity metrics |
| 4d.15 | `Export-GroupReport` | [ ] | CSV/HTML report |
| 4d.16 | `Bulk-CreateGroups` | [ ] | CSV input → loop |
| 4d.17 | `Bulk-AddMembers` | [ ] | CSV input → loop |
| 4d.18 | `Bulk-RemoveMembers` | [ ] | CSV input → loop |

### 4e. Security Module (expand)

| # | Function | Status | Notes |
|---|----------|--------|-------|
| 4e.1 | `Block-RiskyUser` | [ ] | Remediate risky user |
| 4e.2 | `Dismiss-RiskyUser` | [ ] | Dismiss risk alert |
| 4e.3 | `Confirm-CompromisedUser` | [ ] | Confirm compromise |
| 4e.4 | `Set-MFAEnforcement` | [ ] | Enforce MFA for user |
| 4e.5 | `Get-MFAStatus` | [ ] | Check MFA registration |
| 4e.6 | `New-ConditionalAccessPolicy` | [ ] | Create CA policy |
| 4e.7 | `Update-ConditionalAccessPolicy` | [ ] | Update CA policy |
| 4e.8 | `Remove-ConditionalAccessPolicy` | [ ] | Delete CA policy |
| 4e.9 | `Get-PrivilegedRoles` | [ ] | List privileged role assignments |
| 4e.10 | `Export-SecurityReport` | [ ] | Comprehensive security report |

### 4f. Recovery Module (expand)

| # | Function | Status | Notes |
|---|----------|--------|-------|
| 4f.1 | `Restore-DeletedSite` | [ ] | Verify implementation |
| 4f.2 | `Undo-MailboxPermission` | [ ] | Verify pre-state capture |
| 4f.3 | `Get-RecoveryHistory` | [ ] | History of recovery actions |
| 4f.4 | `Export-RecoveryReport` | [ ] | CSV/HTML report |

### 4g. Node.js Module Wrappers

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4g.1 | Update `teams.js` with 27 new operations | [ ] | Add wrappers for all new functions |
| 4g.2 | Update `sharepoint.js` with 25 new operations | [ ] | Add wrappers for all new functions |
| 4g.3 | Update `exchange.js` with 23 new operations | [ ] | Add wrappers for all new functions |
| 4g.4 | Update `groups.js` with 16 new operations | [ ] | Add wrappers for all new functions |
| 4g.5 | Update `security.js` with new operations | [ ] | Add wrappers for new functions |
| 4g.6 | Add new routes to `moduleRoutes.js` | [ ] | Register all new endpoints |

**Phase 4 Exit Criteria:** Every function in the module manifests has a real .ps1 implementation. Every function has a Node.js wrapper and API endpoint.

---

## Phase 5: Wire Up the Database

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | Expand `database/schema.sql` with full table set | [ ] | audit_logs, sessions, action_history, system_config |
| 5.2 | Fix `audit_logs` table to match `auditLogger.js` schema | [ ] | Currently mismatched |
| 5.3 | Update `config/db.js` — verify connection pool | [ ] | |
| 5.4 | Merge `server-with-DB.js` into `server.js` or switch package.json | [ ] | Currently uses server.js (no DB) |
| 5.5 | Call `auditLogger.createTable()` on startup | [ ] | Auto-create tables |
| 5.6 | Move session storage from Maps to DB (with cache) | [ ] | azureAuth sessions currently in-memory |
| 5.7 | Persist action history for undo/recovery | [ ] | action_history table |
| 5.8 | Add DB health check to `/health` endpoint | [ ] | |
| 5.9 | Test: Restart server → sessions and audit logs persist | [ ] | |

**Phase 5 Exit Criteria:** Server starts with DB connected. Audit logs persist across restarts.

---

## Phase 6: Fill Node.js Stubs

| # | Task | Status | Notes |
|---|------|--------|-------|
| 6.1 | `copilotService.js` — implement or remove | [ ] | 18 bytes currently |
| 6.2 | `loggingService.js` — implement or remove | [ ] | 18 bytes; logger.js may cover this |
| 6.3 | `memoryService.js` — implement or remove | [ ] | 18 bytes; aiService has conversation history |
| 6.4 | `validator.js` — implement real sanitization | [ ] | UPN, GUID, string escaping, injection prevention |
| 6.5 | `workflows.js` — implement or remove | [ ] | 18 bytes |
| 6.6 | `public/app.js` — implement SPA JS | [ ] | 26 bytes currently |
| 6.7 | `public/styles.css` — implement styles | [ ] | 25 bytes currently |
| 6.8 | `memoryRoutes.js` — implement or remove | [ ] | 147 bytes |

**Phase 6 Exit Criteria:** No file contains `module.exports={};`. No empty stubs.

---

## Phase 7: Cross-Platform Support

| # | Task | Status | Notes |
|---|------|--------|-------|
| 7.1 | Detect OS and select `pwsh` vs `powershell.exe` | [ ] | In securePowerShellRunner.js |
| 7.2 | Document PowerShell 7 installation for Linux | [ ] | |
| 7.3 | Test server startup on Linux | [ ] | |
| 7.4 | Update deployment docs for both platforms | [ ] | |

**Phase 7 Exit Criteria:** Server starts and executes PS commands on both Windows and Linux.

---

## Phase 8: Tests

| # | Task | Status | Notes |
|---|------|--------|-------|
| 8.1 | PSScriptAnalyzer rules + Pester tests for PS functions | [ ] | |
| 8.2 | Jest/Mocha unit tests for Node.js modules | [ ] | |
| 8.3 | Integration tests for API endpoints | [ ] | |
| 8.4 | Auth flow test (mock device-code) | [ ] | |
| 8.5 | AI service test (mock LLM responses) | [ ] | |
| 8.6 | Add test script to package.json | [ ] | `npm test` |

**Phase 8 Exit Criteria:** Test suite runs and passes.

---

## Phase 9: Configuration & Documentation

| # | Task | Status | Notes |
|---|------|--------|-------|
| 9.1 | Real `.env.example` with documented values | [ ] | Not placeholder values |
| 9.2 | Azure AD app registration guide | [ ] | Step-by-step |
| 9.3 | PowerShell module installation guide | [ ] | Microsoft.Graph, ExchangeOnlineManagement, etc. |
| 9.4 | Database setup guide | [ ] | PostgreSQL installation + schema |
| 9.5 | Deployment guide (Windows + Linux) | [ ] | |
| 9.6 | API documentation (all endpoints) | [ ] | |
| 9.7 | Architecture documentation | [ ] | |
| 9.8 | Update README.md | [ ] | |

**Phase 9 Exit Criteria:** New user can follow docs to a working installation.

---

## Summary Statistics

| Phase | Tasks | Completed | In Progress | Blocked |
|-------|-------|-----------|-------------|---------|
| 1. Audit & Clean | 9 | 0 | 0 | 0 |
| 2. Auth Chain | 9 | 0 | 0 | 0 |
| 3. Standardize PS | 12 | 0 | 0 | 0 |
| 4. Implement Functions | 100+ | 0 | 0 | 0 |
| 5. Database | 9 | 0 | 0 | 0 |
| 6. Fill Stubs | 8 | 0 | 0 | 0 |
| 7. Cross-Platform | 4 | 0 | 0 | 0 |
| 8. Tests | 6 | 0 | 0 | 0 |
| 9. Documentation | 8 | 0 | 0 | 0 |
| **Total** | **165+** | **0** | **0** | **0** |

---

*Update this tracker after completing each task. Move the status from `[ ]` to `[x]` and add notes.*
