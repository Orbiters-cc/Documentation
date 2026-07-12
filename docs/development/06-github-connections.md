---
title: GitHub Connections and Read-Only Sync
section: Development
order: 65
audience: dev
stage: alpha
id: orbiters.development.github-connections
domain: website
type: reference
owner: orbiters-engineering
lastVerified: 2026-07-12
relations: orbiters.decision.github-connection-separation, orbiters.development.boards-proposals-and-forecasts, orbiters.reference.api-keys-and-credentials
---

# GitHub Connections and Read-Only Sync

Orbiters has two independent GitHub OAuth connections. A user connection proves
account identity. An administrator connection reads the delivery Project. The
private Orbiters repository uses a separate read credential because a classic OAuth
app has no read-only private-repository scope. Sharing credentials between these
purposes would grant unnecessary access and make environment revocation ambiguous.

The alpha integration calls GitHub REST and GraphQL APIs directly from the backend.
The `gh` command is not part of the production request path.

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

## User Identity Connection

The account flow begins at `POST /github/account/connect` and requests `read:user`.
It records the stable GitHub numeric ID and node ID plus login and avatar snapshots
on the Orbiters user and `GitHubConnection`. The numeric ID, not the mutable login,
matches imported issue authors to Orbiters accounts.

`GET /github/account` returns safe connection status. `DELETE /github/account`
removes the identity connection and clears the GitHub identity snapshots. Orbiters
stores the temporary user credential only as an encrypted, inactive cleanup record
inside the identity transaction, then revokes it and deletes the ciphertext. A
failed remote revocation remains inactive and marked `revocationPending`; it is
never used to read the Project or repository.

Only a normal authenticated human account can start this flow. Agent users cannot
use Discord or human OAuth login.

## Administrator Project Connection

The admin flow begins at `POST /admin/github/connect` and requires the
`admin-github` feature. It requests only `read:project`, then stores the access token
and optional refresh token as encrypted credentials on a secret `GITHUB_PROJECT`
API key for the current `dev` or `prod` runtime. Tokens are separate by environment
and are never returned by connection-status endpoints.

The Orbiters repository is private. GitHub's classic `repo` OAuth scope includes
write-capable access, so the Project link deliberately does not request it. Configure
a `GITHUB_REPOSITORY_READ` API key for each environment with a fine-grained token
limited to `blackorbit1/Orbiters`, Issues read access, and Projects read access. Its
credentials are `GITHUB_REPOSITORY_READ_TOKEN`, `GITHUB_OWNER`, and
`GITHUB_REPOSITORY`. The backend prefers OAuth for Project reads, can retry the
Project read with the fine-grained token, and uses the fine-grained token for private
issue listing. Without it, private issue sync fails with an explicit configuration
error instead of broadening OAuth silently.

Administrative operations are:

- `GET /admin/github/connection` to inspect safe status;
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

## Synchronization Contract

ProjectV2 fields and items are fetched through GraphQL. Repository issues are fetched
through paginated REST calls. A successful synchronization persists:

- the Project node ID, title, URL, fields, options, items, and sync time;
- issue node ID, number, title, URL, state, labels, and author identity;
- Project item node ID and stable Status field/option node IDs;
- the matched Orbiters user ID when the GitHub numeric author ID is linked;
- synchronization status and safe error text.

The default Orbiters Board copies its columns from the Project Status options. A
linked issue becomes a `github-issue` Board item. Local status uses the stable option
ID as `columnKey` and keeps the display name as delivery status. If GitHub replaces
or renames a column, local Proposal cards are remapped by key or normalized title,
then fall back to the first current column instead of disappearing.

The scheduler runs once when external startup services begin and then every five
minutes by default. `GITHUB_PROJECT_SYNC_INTERVAL_MS` accepts values from one minute
to 24 hours; `GITHUB_PROJECT_SYNC_ENABLED=false` disables it. Concurrent runs are
skipped. Board responses expose last sync time, safe error state, and a stale flag
after two missed intervals. Manual validation and synchronization remain available
from the admin panel.

Synchronization reconciles removals as well as additions. Issues no longer present
in the configured repository or Project lose active Project placement. Private
repository issues remain staff-visible; only an issue whose Project repository is
explicitly public is exposed publicly.

## Source of Truth and Write Boundary

In the alpha release:

- Orbiters owns Proposals, local Board membership, submission policy, visibility,
  comments, decisions, and forecasts;
- GitHub owns issue bodies and issue state;
- GitHub Project owns the delivery status of linked issue items;
- synchronization from GitHub to Orbiters is read-only.

Attempting to move a GitHub-backed Board item to another column returns a conflict.
Granting `project` scope or adding write mutations requires a separate review after
read-only reconciliation is reliable. The current implementation does not create
GitHub issues automatically.

## Failure Handling

GitHub failures expose a bounded message and safe status. They do not log or return
the bearer token. Rate-limit and request identifiers may be retained for diagnosis.
A failed sync marks the connection as errored without replacing the last successful
snapshot. Revalidate the credential before retrying repeated authentication errors.

## Verification

1. Configure separate OAuth app records for development and production.
2. Link a user account and confirm the numeric GitHub ID is stored.
3. Connect the development admin integration and confirm `read:project` appears in
   the safe scope list without broader repository scope.
4. Configure the environment's repository-read token and verify its owner and
   repository binding.
5. Synchronize and compare issue count, Project columns, stable option IDs, and
   removal reconciliation.
6. Confirm a linked issue author resolves by numeric ID even after a login rename.
7. Confirm a local request cannot move a GitHub-backed Board item.
8. Revoke the integration and confirm validation and sync no longer work.
9. Shorten the scheduler interval in a test environment and confirm stale state and
   the single-run guard without calling production GitHub.
10. Force GitHub revocation to fail, confirm local access stops immediately, then
   confirm the cleanup loop removes the ciphertext after GitHub recovers.
