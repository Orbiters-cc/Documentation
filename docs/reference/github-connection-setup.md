---
title: GitHub Connection Setup Reference
section: Reference
order: 79
audience: dev
stage: alpha
id: orbiters.reference.github-connection-setup
domain: website
type: reference
owner: orbiters-engineering
lastVerified: 2026-07-13
relations: orbiters.decision.github-connection-separation, orbiters.development.boards-proposals-and-forecasts, orbiters.reference.api-keys-and-credentials
---

# GitHub Connection Setup Reference

Configure identity OAuth and project operations deliberately. The [GitHub connection guide](/documentation/orbiters.development.github-connections) explains their separate responsibilities and runtime synchronization.

## OAuth Application Configuration

Store OAuth application configuration through the existing API key management
system using the `GITHUB_OAUTH_APP` type. Each runtime environment record needs:

- `GITHUB_CLIENT_ID`;
- `GITHUB_CLIENT_SECRET`;
- `GITHUB_CALLBACK_URL`.

GitHub OAuth applications accept one callback URL. Use separate development and
production registrations when their callbacks differ, and store each record with
the matching `environment`. The backend resolves the active runtime environment and
rejects attempts to authorize the other environment. Never reuse a production client
secret in a developer database.

Leave **Enable Device Flow** disabled when registering both OAuth applications.
Orbiters uses the normal browser redirect and callback flow; it does not request or
poll GitHub device codes.

The **Connect GitHub** button can start authorization only after GitHub has issued
the client ID and secret; those values cannot be discovered by an OAuth redirect.
When configuration is missing, the admin GitHub tab therefore shows a one-time
setup card with links to GitHub OAuth App registration and Orbiters API Keys, plus a
copyable exact callback URL. The development callback is
`https://dev.api.orbiters.cc/github/oauth/callback`; production uses
`https://api.orbiters.cc/github/oauth/callback`. Register those as separate OAuth
Apps, then add the three environment-matched values before connecting.

OAuth state is random, stored as a SHA-256 hash, expires after ten minutes, is bound
to the initiating user, connection kind, and environment, and can be consumed only
once. The callback is `/github/oauth/callback`.

## Administrator Project Connection

The admin flow begins at `POST /admin/github/connect` and requires the
`admin-github` feature. It requests only `read:project`, then stores the access token
and optional refresh token as encrypted credentials on a secret `GITHUB_PROJECT`
API key for the current `dev` or `prod` runtime. Tokens are separate by environment
and are never returned by connection-status endpoints.

The Orbiters repository is private. The Project link deliberately does not request
classic `repo` scope. Configure a `GITHUB_REPOSITORY_READ` API key for each
environment with a fine-grained token limited to `blackorbit1/Orbiters`. Choose
**Only select repositories**, select `Orbiters`, and grant only **Metadata:
Read-only** and **Issues: Read-only** under Repository permissions. Its credentials
are `GITHUB_REPOSITORY_READ_TOKEN`, `GITHUB_OWNER`, and `GITHUB_REPOSITORY`. The
OAuth credential reads the user-owned Project; the fine-grained token lists private
issues. Without the repository credential, private issue sync fails with an
explicit configuration error instead of broadening OAuth silently.

Creating issues uses a third, deliberately separate `GITHUB_REPOSITORY_WRITE`
credential. Its fine-grained token is bound to the configured owner and repository
and receives only **Metadata: Read-only** plus **Issues: Read and write**. It is not
used for Project synchronization or normal issue reads. This split keeps the
default synchronization path read-only and makes issue creation an explicit
operator choice.

Seeing only `read:project` on the administrator OAuth connection is expected. It is
not evidence of missing repository scopes. The admin GitHub tab reports OAuth and
repository-read readiness separately and disables synchronization until both
credentials match the active environment and configured repository.

Repository readiness includes a direct one-item Issues API probe against the
configured owner and repository. A saved fine-grained token is therefore not marked
valid merely because all three fields are present. The safe status can include the
GitHub HTTP status and request ID for diagnosis, but never includes the token or a
raw authorization header.

Administrative operations are:

- `GET /admin/github/connection` to inspect safe OAuth and repository-credential
  readiness without returning either token;
- `POST /admin/github/validate` to confirm the token and refresh identity/scopes;
- `POST /admin/github/sync` to fetch the Project and repository issues;
- `GET /admin/github/project` to read the latest local Project snapshot;
- `GET /admin/github/issues` to page through locally synchronized issues;
- `DELETE /admin/github/connection` to disable the credential and mark the
  connection revoked.

Revoking an integration disables local access before calling GitHub's revocation
endpoint. A failed remote revocation returns `202`, leaves a disabled
`revocationPending` record for follow-up, and cannot be used for synchronization.
Successful revocation removes the ciphertext. Reauthorization disables and
best-effort revokes the previous environment token before storing a new one. An
expiring access token is refreshed shortly before expiry when a refresh token is
available.

Every scheduled synchronization first retries inactive pending revocations for its
runtime environment. OAuth failures after code exchange also attempt immediate
revocation; if GitHub is unavailable, the encrypted token is persisted inactive for
the same cleanup loop instead of being lost outside Orbiters' lifecycle tracking.
