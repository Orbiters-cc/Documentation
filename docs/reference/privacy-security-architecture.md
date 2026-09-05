---
title: Privacy and Credential Security Architecture
section: Developer Reference
order: 92
audience: admin, dev
stage: alpha
id: orbiters.reference.privacy-security
domain: website
type: reference
owner: orbiters-engineering
lastVerified: 2026-09-05
---

# Privacy and Credential Security Architecture

The implementation is local development work awaiting application release. Public
privacy and seller controls use existing account and commission surfaces with
HeroUI disclosures, status messages and reduced-motion support.

## Service Boundaries

| Concern | Implementation |
| --- | --- |
| Purposes, legal text and version | `services/privacy/policyRegistry.js`, `legalDocuments.js` |
| Membership closure and provider unlinking | `accountLifecycle.js`, `providerCleanup.js` |
| Account credentials | `ExternalCredential`, `externalCredentialService.js`, `credentialCipherService.js` |
| Owner visibility and source identity | `contentVisibilityService.js`, `sourceVisibility.js` |
| Requests and streamed ZIP exports | `requestService.js`, `exportService.js`, `exportArchive.js` |
| Reports, appeals and fee refunds | `moderationService.js`, `feeRefundService.js` |
| Seller terms and conditional tax collection | `sellerService.js`, `sellerTaxService.js` |
| Reviewed records and retention | `governanceService.js`, `retentionService.js` |
| Startup migration and closure protection | `models/migrations/privacySchema.js`, `privacyGuards.js` |
| Restore reconciliation | `services/privacy/restoreLedger.js` |

Backend paths above are relative to `backend/src`. Routes use `/privacy`,
`/moderation`, `/seller` and existing commission endpoints without an `/api` prefix.
All private responses use authenticated access; privacy and tax responses disable caching.

## Credentials and Local Setup

A dedicated **API_CREDENTIAL_ENCRYPTION_KEY** is required before database initialization.
AES-256-GCM uses a random nonce per write; account/provider and seller-tax payloads
also bind authenticated context. Runtime reads never fall back to plaintext or the
JWT signing key. Empty credential objects contain no encrypted secret.

For local development, create `backend/.env.credentials.dev` with the key variable.
The file is ignored by Git and Docker build contexts. Local startup loads it before
ordinary development configuration. Development Compose loads it as the last backend
environment file. Do not add the key to an already tracked `.env.dev` file.

Generate a random key once into a new file from the repository root:

```powershell
node -e "require('fs').writeFileSync('backend/.env.credentials.dev', 'API_CREDENTIAL_ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex') + '\n', {flag:'wx', mode:0o600})"
```

Exclusive creation refuses to overwrite an existing key. Keep a secure independent
backup. File access controls on Windows must be managed with the host's ACLs.

## Production Deployment

Set **API_CREDENTIAL_ENCRYPTION_KEY** in the GitHub **production** environment secrets.
Use a separate production key. The deployment workflow transfers a mode-600 temporary
file to the server and installs `backend/.env.credentials.prod` before preflight.
Production Compose loads that file last. Neither the key nor its file contents are
printed by the workflow.

The installer permits an identical existing key and refuses a changed key. Automatic
rotation is intentionally absent. Losing or replacing this key makes encrypted
credentials unreadable. Back up the key independently of database archives and keep
the currently required JWT key available during the first migration of older data.

Startup transactionally converts old Discord User columns, previous encrypted API
credentials and service state. It validates readable ciphertext before dropping old
columns. Existing current ciphertext is preserved. A missing or wrong key fails
startup instead of clearing or replacing stored credentials. Fresh installs and
populated upgrades must both pass twice before release.

## Closure, Shared Data and Restore

Closure locks the account and makes its remaining actor row non-authenticating and
immutable. Shared foreign keys survive. Private account rows and credentials are
removed; provider revocation and eligible physical-file deletion use durable outbox
jobs. Stale private-owner writes are rejected by database guards. Exports cannot
become downloadable after closure.

Imported discussions use provider plus external user identity independently of
website membership. Source-image hiding uses the natural guild/message/attachment
identity, so deleting and rebuilding gallery rows does not remove the decision.
Only the verified source identity can change owner visibility. Staff restrictions
remain separate. Commission hiding is creator-only and preserves participant access.

The append-only, fsynced ledger is stored in `backend/privacy-state/tombstones.jsonl`,
or **PRIVACY_LEDGER_DIR**. It records closure intentions and ordered visibility
changes before database mutation. Startup replays it before serving users. Closure
entries include the actor creation time to avoid closing a reused numeric ID.

For a database restore, stop serving traffic and preserve the newest live ledger
independently of the older backup. Keep it at the configured path before starting
the restored backend. Never replace it with an older archive's ledger. Replicate
this private state and the encryption key to restricted independent recovery storage;
a database snapshot alone cannot recover later deletion decisions. During preflight,
reconciliation changes only the cloned database and skips export-file deletion.

## Session and User Experience Invariants

OAuth redirects carry a short-lived single-use code bound to an HttpOnly browser
proof cookie. The code exchange produces the access token; reusable JWTs are not
sent through OAuth redirect URLs. Refresh preserves the original authentication time.
Account closure requires a sign-in within ten minutes. The existing frontend access
token storage remains in use; this change does not replace every session mechanism.

Optional marketing is account-wide and opt-in. Necessary commerce and moderation
notifications remain available. No advertising or behavioural analytics SDK is
introduced. Future optional trackers must have a consent gate before initialization.
Seller and request terms are versioned snapshots; changing a listing cannot rewrite
an existing agreement. Creator payments remain direct, separate from the Stripe
Orbiters ReFit request fee.

## Validation

Run `npm test` in backend, the frontend test suite and the frontend production build.
The opt-in `test/privacyDatabase.test.js` creates a random database on an explicitly
provided localhost disposable PostgreSQL server. It validates fresh boots, populated
credential upgrades, source attribution, export redaction, creator-only hiding,
closure preservation, stale writes and repeated boots. Never point it at developer
or production data. Backend initialization tests use port 4200 or higher with
`ENV_COMMON=true`, `FAIL_FAST=true`, `EXIT_AFTER_DATABASE_INIT=true` and
`SKIP_EXTERNAL_STARTUP=true`.
