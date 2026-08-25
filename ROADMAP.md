# M365-AI-SaaS-Toolkit — Development Roadmap

> **Branch:** `development/v2`
> **Created:** 25 August 2026
> **Base:** `main` (early skeleton — NOT the source of truth)
> **Source of truth:** Uploaded V10 codebase (`M365_PLATFORM_SKELETON_V10`)
> **Goal:** Transform the V10 skeleton into a fully functional, deployable M365 management platform with zero stubs or placeholders.

---

## 1. Project Overview

The M365-AI-SaaS-Toolkit is a PowerShell-based M365 management platform with:
- **8 modules** — Users, Licensing, Exchange, Groups, Teams, SharePoint, Security, Recovery
- **Node.js/Express API layer** — 49 REST endpoints with session validation and RBAC
- **AI-powered copilot** — LLM-based natural language interface (DeepSeek/OpenAI)
- **Web UI** — Single-page application with device-code login
- **Enterprise features** — Audit logging, rate limiting, multi-tenant auth

The current V10 codebase is assessed at **60-70% production readiness**. The platform skeleton and real PowerShell functions are strong, but critical gaps prevent it from being a working application.

---

## 2. Current State (Verified by Code Review)

### What Works (V10)

| Component | Status | Detail |
|---|---|---|
| 90 real PowerShell functions | ✅ | Proper CmdletBinding, input validation, try/catch, structured PSCustomObject output |
| Azure AD device-code auth | ✅ | `azureAuth.js` — MSAL integration, device code flow, session management |
| AI service | ✅ | `aiService.js` — LLM-powered, conversation history, action mapping |
| 49 REST API endpoints | ✅ | `moduleRoutes.js` — full routes with session validation and RBAC |
| 8 Node.js module wrappers | ✅ | Each builds PS commands and calls secure runner |
| Web UI (SPA) | ✅ | `index.html` (36.7KB) — device-code login, API testing panels |
| Audit logger | ✅ | `auditLogger.js` — DB-backed with proper schema |
| RBAC | ✅ | `rbac.js` — 8 roles, Azure AD group mapping |
| Secure PS runner | ⚠️ | Queuing, timeout, WhatIf — but token not passed through |
| Deployment config | ✅ | nginx.conf, pm2.config.js, tenant-setup.ps1 |

### What Does NOT Work

| Issue | Severity | Detail |
|---|---|---|
| Auth-to-PowerShell disconnect | CRITICAL | `azureAuth.js` obtains token but `securePowerShellRunner._connectToTenant()` calls non-existent `Get-AzureToken` |
| Recursive function names | CRITICAL | Stubs like `New-Team` call `New-Team` (shadows real cmdlet) |
| 108 stub PS files | HIGH | Under 200 bytes, no real logic |
| 60 Invoke-Task template files | HIGH | 30 Security + 30 Recovery, no M365 cmdlets |
| 31 Licensing .txt files | MEDIUM | One-liner descriptions, not code |
| 29 SharePoint_Module_FIXED duplicates | MEDIUM | Duplicate directory |
| 3 empty service files | HIGH | `copilotService.js`, `loggingService.js`, `memoryService.js` — 18 bytes each |
| Database not connected | HIGH | `schema.sql` has 2 tables; `auditLogger.js` references `audit_logs` (mismatch); `server.js` doesn't import DB |
| `server.js` vs `server-with-DB.js` | MEDIUM | package.json points to `server.js` (no DB); enhanced version unused |
| Legacy code | MEDIUM | `copilotRoutes.js`, `powershellPool.js` still present |
| No standard output contract | HIGH | Some scripts return PSCustomObject; others bare cmdlet output |
| Cross-platform | MEDIUM | `powershell.exe` only; no `pwsh` for Linux |
| No tests | HIGH | Zero test files |
| `.env` placeholders | MEDIUM | `AZURE_CLIENT_ID=your_client_id`, `JWT_SECRET=SuperSecureKey` |
| Empty frontend stubs | LOW | `public/app.js` (26 bytes), `public/styles.css` (25 bytes) |

---

## 3. Development Phases

### Phase 1: Audit & Clean (Foundation)

**Goal:** Remove all dead code and establish a clean baseline.

- Delete 60 `Invoke-*Task1-30.ps1` stub files (30 Security, 30 Recovery)
- Delete 29 `SharePoint_Module_FIXED/` duplicate files
- Delete 31 `Licensing/*.txt` description files
- Delete `copilotRoutes.js` (superseded by `aiRoutes.js`)
- Delete `powershellPool.js` (superseded by `securePowerShellRunner.js`)
- Delete `azureAuth-original.js` (reference only)
- Identify and remove any other empty/placeholder files
- Result: A clean codebase with only real implementations

**Exit criteria:** No file under 200 bytes remains. No duplicate directories. No legacy routes.

---

### Phase 2: Fix the Auth Chain (Critical)

**Goal:** Connect the MSAL token from `azureAuth.js` through to PowerShell sessions.

- Modify `securePowerShellRunner.js` to accept and use the access token from `azureAuth.getSession()`
- Replace `Get-AzureToken` placeholder in `_connectToTenant()` with actual token passed from session
- Implement `Connect-MgGraph -AccessToken $token` in the PS session initialization
- Implement `Connect-ExchangeOnline` with token-based auth
- Implement `Connect-MicrosoftTeams` with token-based auth
- Handle token expiry and refresh in the PS session lifecycle
- Test: Verify a PS session can call `Get-MgUser` after device-code auth completes

**Exit criteria:** A user authenticates via device code, and the PS session can execute `Get-MgUser` using the obtained token.

---

### Phase 3: Standardize PowerShell Functions

**Goal:** Every real function follows the same quality pattern.

Required pattern for all functions:
- `[CmdletBinding(SupportsShouldProcess=$true)]` for destructive operations
- `begin/process/end` block structure
- Input validation (UPN regex, GUID format, etc.)
- Pre-existence checks before create/modify operations
- `try/catch` with structured `[PSCustomObject]@{ Success; Message; Data }` return
- `Write-Verbose` for diagnostics
- `Export-ModuleMember -Function`
- `-WhatIf` support for all destructive operations
- No recursive naming (function name must differ from the cmdlet it calls)

Functions to review and standardize (all 90 real functions across 8 modules):
- Users (29) — most complete, use as the reference pattern
- Licensing (15) — convert any remaining `.txt` to `.ps1` if needed
- Recovery (15) — verify undo operations store pre-state
- Groups (11) — standardize existing
- Exchange (7) — standardize existing
- Security (5) — standardize existing
- Teams (4) — standardize existing
- SharePoint (4) — standardize existing

**Exit criteria:** Every `.ps1` file passes a pattern check. Consistent output contract across all modules.

---

### Phase 4: Implement Missing Functions

**Goal:** Fill in all stub functions with real, working M365 cmdlet calls.

Priority order (by number of missing functions):

#### 4a. Teams Module (27 functions)
- `New-Team` (fix recursion — call `New-Team` from MicrosoftTeams module, not self)
- `New-TeamChannel`, `Set-TeamSettings`, `Archive-Team`, `Unarchive-Team`
- `Remove-Team`, `Add-TeamUser`, `Remove-TeamUser`, `Add-TeamOwner`, `Remove-TeamOwner`
- `Get-TeamApps`, `Add-TeamApp`, `Remove-TeamApp`
- `Get-EmptyTeams`, `Get-LargeTeams`, `Get-PrivateChannels`, `Get-StandardChannels`
- `Get-TeamGuestUsers`, `Remove-TeamGuestUsers`
- `Bulk-CreateTeams`, `Bulk-AddTeamUsers`, `Bulk-RemoveTeamUsers`
- `Clone-Team`, `Restore-Team`, `Export-TeamReport`
- Uses: `Connect-MicrosoftTeams` cmdlets (`New-Team`, `Add-TeamUser`, etc.)

#### 4b. SharePoint Module (25 functions)
- `New-Site`, `Remove-Site`, `Restore-Site`
- `Add-SiteUser`, `Remove-SiteUser`, `Get-SitePermissions`, `Grant-SitePermission`, `Revoke-SitePermission`
- `Get-SharingSettings`, `Set-SharingSettings`
- `Get-Lists`, `New-List`, `Remove-List`, `Get-Documents`, `Upload-File`, `Download-File`
- `Get-EmptySites`, `Get-LargeSites`
- `Bulk-CreateSites`, `Bulk-AddSiteUsers`, `Bulk-RemoveSiteUsers`
- `Remove-DeletedSite`, `Export-SitesReport`, `Set-SiteStorage`
- Uses: `Get-SPOSite`, `New-SPOSite`, `Set-SPOSite` (SharePoint Online module)

#### 4c. Exchange Module (23 functions)
- `New-Mailbox` (fix recursion), `New-SharedMailbox`, `Remove-SharedMailbox`
- `Enable-Mailbox`, `Disable-Mailbox`, `Remove-Mailbox`, `Remove-MailboxPermission`
- `Get-MailboxRules`, `Remove-MailboxRules`
- `Get-AutoReply`, `Set-AutoReply`, `Remove-AutoReply`
- `Get-MailForwarding`, `Set-MailForwarding`, `Remove-MailForwarding`
- `Get-TransportRules`
- `Enable-MailboxAudit`, `Get-MailboxAudit`, `Export-MailboxReport`
- `Bulk-EnableMailbox`, `Bulk-DisableMailbox`, `Bulk-RemoveMailbox`
- Uses: `ExchangeOnlineManagement` cmdlets

#### 4d. Groups Module (16 functions)
- `Update-Group`, `Get-GroupSettings`, `Get-GroupTypes`, `Get-GroupsByName`
- `Get-GuestsInGroups`, `Get-LargeGroups`, `Get-O365Groups`, `Get-OrphanGroups`, `Get-SecurityGroups`
- `Clean-EmptyGroups`, `Clone-Group`, `Transfer-Ownership`, `Remove-GuestUsers`
- `Group-ActivityReport`, `Export-GroupReport`
- `Bulk-CreateGroups`, `Bulk-AddMembers`, `Bulk-RemoveMembers`
- Uses: Microsoft Graph Groups API (`Get-MgGroup`, `New-MgGroup`, etc.)

#### 4e. Security Module (expand beyond 5 read-only functions)
- `Block-RiskyUser`, `Dismiss-RiskyUser`, `Confirm-CompromisedUser`
- `Set-MFAEnforcement`, `Get-MFAStatus`
- `New-ConditionalAccessPolicy`, `Update-ConditionalAccessPolicy`, `Remove-ConditionalAccessPolicy`
- `Get-PrivilegedRoles`, `Get-PrivilegedRoleAssignments`
- `Export-SecurityReport`
- Uses: `Get-MgRiskyUser`, `Set-MgRiskyUser`, Graph API

#### 4f. Recovery Module (expand beyond 15 functions)
- `Restore-DeletedSite` (verify implementation)
- `Undo-RemoveGroupMember`, `Undo-RemoveSiteUser`, `Undo-RemoveTeamUser` (verify pre-state capture)
- `Undo-MailboxPermission` (verify)
- `Get-RecoveryHistory`, `Export-RecoveryReport`
- Uses: `Get-MgDirectoryDeletedItem`, `Restore-MgDirectoryDeletedItem`

**Exit criteria:** Every function listed in the module manifests has a real `.ps1` implementation with proper cmdlets.

---

### Phase 5: Wire Up the Database

**Goal:** PostgreSQL is connected, schema is complete, audit logs persist.

- Expand `database/schema.sql` with full table set:
  - `users` — app users (local auth fallback)
  - `audit_logs` — matches `auditLogger.js` schema (session_id, tenant_id, user_id, action, target, result, details, ip, created_at)
  - `sessions` — session storage (session_id, tenant_id, user_id, access_token, refresh_token, expires_at, created_at)
  - `action_history` — for recovery/undo operations (action, target, pre_state, post_state, timestamp)
  - `system_config` — runtime configuration (key, value, updated_at)
- Update `config/db.js` — ensure connection pool works
- Switch `package.json` to use `server-with-DB.js` (or merge DB into `server.js`)
- Call `auditLogger.createTable()` on server startup
- Move session storage from in-memory Maps to DB (with in-memory cache for performance)
- Persist action history for undo/recovery operations

**Exit criteria:** Server starts with DB connected. Audit logs persist across restarts. Sessions survive server restart.

---

### Phase 6: Fill Node.js Stubs & Clean Up Services

**Goal:** Every `.js` file has real implementation or is removed.

- `copilotService.js` — Either implement (wrapping `aiService.js` for the copilot route) or remove if `aiService.js` covers everything
- `loggingService.js` — Implement as a winston-based structured logger, or remove if `logger.js` covers it
- `memoryService.js` — Implement as DB-backed conversation memory, or remove if `aiService.js` conversation history is sufficient
- `validator.js` — Implement real input sanitization (UPN, GUID, string escaping, command injection prevention)
- `workflows.js` — Implement multi-step workflow support or remove
- `public/app.js` — Implement as the SPA's JavaScript entry point
- `public/styles.css` — Implement proper styles for the SPA
- `memoryRoutes.js` (147 bytes) — Implement or remove

**Exit criteria:** No file contains `module.exports={};`. No empty stubs.

---

### Phase 7: Cross-Platform Support

**Goal:** Works on Windows (primary) and Linux (secondary).

- Update `securePowerShellRunner.js` to detect OS and use `pwsh` on Linux/macOS, `powershell.exe` on Windows
- Document PowerShell 7 installation requirement for Linux
- Test Node.js server startup on Linux
- Update deployment docs for both platforms

**Exit criteria:** Server starts and can execute PowerShell commands on both Windows and Linux.

---

### Phase 8: Tests

**Goal:** Confidence that functions work correctly.

- Unit tests for PowerShell functions (PSScriptAnalyzer + Pester)
- Unit tests for Node.js module wrappers (Jest/Mocha)
- Integration tests for API endpoints
- Auth flow test (mock device-code)
- AI service test (mock LLM responses)

**Exit criteria:** Test suite runs and passes. Critical paths covered.

---

### Phase 9: Configuration & Documentation

**Goal:** A new admin can install and configure the toolkit.

- Real `.env` template with documentation (not placeholder values)
- Azure AD app registration guide (step-by-step)
- PowerShell module installation guide
- Database setup guide
- Deployment guide (Windows + Linux)
- API documentation (all 49 endpoints)
- Architecture documentation

**Exit criteria:** A new user can follow the docs to get a working installation.

---

## 4. Architecture Reference (V10)

```
M365 Platform V10
|
+-- app/
|   +-- server.js                    # Express entry point
|   +-- server-with-DB.js            # Enhanced version (DB + helmet)
|   +-- auth/
|   |   +-- azureAuth.js             # MSAL device-code flow
|   |   +-- rbac.js                  # Role-based access control
|   +-- config/
|   |   +-- db.js                    # PostgreSQL connection pool
|   +-- engine/
|   |   +-- securePowerShellRunner.js # Per-session PS runner
|   +-- middleware/
|   |   +-- authMiddleware.js        # JWT verification
|   +-- routes/
|   |   +-- moduleRoutes.js          # 49 REST endpoints
|   |   +-- aiRoutes.js              # AI copilot routes
|   |   +-- authRoutes.js            # Device-code auth routes
|   +-- modules/                     # Node.js wrappers (8 modules + common + reports + admin)
|   +-- services/
|   |   +-- aiService.js             # LLM-powered AI assistant
|   +-- utils/
|       +-- auditLogger.js           # DB-backed audit logging
|       +-- logger.js                # File-based logging
|
+-- modules/                         # PowerShell scripts (8 modules)
+-- public/
|   +-- index.html                   # Full SPA
+-- database/schema.sql              # Database schema
+-- deployment/                      # nginx, pm2, ssl, tenant-setup
+-- .env                             # Environment configuration
```

## 5. Design Principles (from V6 Master Guide)

1. Always use Microsoft Graph (no legacy modules like MSOnline)
2. No passwords stored or used directly
3. MFA enforced through modern authentication
4. All actions must be logged
5. Access must be validated before execution
6. Risky operations require user confirmation (human-in-the-loop)
7. All destructive operations support `-WhatIf`

## 6. Related Projects

- **GitHub repo:** https://github.com/tws-manumaha/M365-AI-SaaS-Toolkit
- **SysWatch:** https://github.com/tws-manumaha/SysWatch_v2.1 (future integration target — NOT in scope for this phase)

---

*This roadmap is a living document. Update it as phases complete and scope evolves.*
