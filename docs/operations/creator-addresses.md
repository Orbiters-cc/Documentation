---
title: Creator Addresses and Wildcard DNS
section: Operations
order: 107
audience: admin, dev
stage: stable
id: orbiters.operations.creator-addresses
domain: operations
type: runbook
owner: orbiters-operations
lastVerified: 2026-10-20
---

# Creator Addresses and Wildcard DNS

Creators can claim a short address such as `neonix.orbiters.cc` in the creator
dashboard (**Preferences > Personalization**, the **Profile address** strip under the
header, `/creator?tab=personalization`). Opening it redirects to their profile,
`https://orbiters.cc/user/<id>`. The owner's presentation page is served on its own
host, `enzodutra.orbiters.cc`. Both depend on one wildcard DNS record, created on
2026-10-20.

## How a request is routed

Cloudflare sends every `*.orbiters.cc` name through the tunnel. Named hosts keep their
own Caddy sites; every other name reaches the frontend server, which reads the `Host`
header (`frontend/server/creatorHosts.cjs`, rules in `frontend/src/metadata/siteHosts.js`).

| Host | Result |
|---|---|
| `orbiters.cc`, `api.`, `dev.`, `dev.api.` | Unchanged named sites |
| `<address>.orbiters.cc/<path>` | `302` to `https://orbiters.cc/user/<id>`; a language prefix in the path (`/ja`, `/fr`, `/es`, `/pt-br`) is kept |
| An address nobody holds | `302` to `https://orbiters.cc/<address>`, the website's not-found page |
| `www.orbiters.cc` | `301` to the same path on `orbiters.cc` |
| Reserved infrastructure names (`admin.`, `mail.`, `files.`...) | `302` to the same path on `orbiters.cc` |
| `enzodutra.orbiters.cc` | The presentation page: French at `/`, English at `/en` |

The frontend server looks addresses up with `GET https://api.orbiters.cc/profile-addresses/<address>`
and remembers answers for a minute (unknown addresses for ten seconds). When the API
cannot answer, the visitor lands on the website's home page instead of an error.

## Cloudflare setup

The wildcard record exists: a proxied `CNAME` named `*` pointing to
`c2b330e4-6f44-4805-bdb3-87d9e56f889e.cfargotunnel.com` (the tunnel ID from
`cloudflared/config.yml`). It was created on 2026-10-20 from the production host, inside
the `cloudflared` container, with the certificate stored there:

```bash
docker exec cloudflared cloudflared tunnel --origincert /home/nonroot/.cloudflared/cert.pem route dns orbiters "*.orbiters.cc"
```

Run the same command to recreate the record if it is deleted, or add it in the Cloudflare
dashboard (**DNS > Records**, type `CNAME`, name `*`, the target above, proxy status
**Proxied**). Explicit records (`mail`, `api`, `dev`...) keep priority over the wildcard.

TLS needs nothing: Cloudflare's Universal SSL certificate covers `orbiters.cc` and one
level of subdomains (`*.orbiters.cc`). Deeper names such as `a.b.orbiters.cc` are not
covered and are not used for addresses.

The wildcard ingress rule lives in `cloudflared/config.yml`. The tunnel reads that file
only at startup, so restart it after a release that changes it. The restart interrupts
all public traffic for a few seconds:

```bash
docker restart cloudflared
```

The release itself activates `Caddyfile.prod`, which contains the `*.orbiters.cc` site.
To apply a Caddy change without a release, run `scripts/caddy/activate-config.sh prod --reload`.

## Verify

Use an address that a creator has claimed:

```bash
curl -sI https://neonix.orbiters.cc/fr | grep -i '^location'
# location: https://orbiters.cc/fr/user/<id>
curl -s https://enzodutra.orbiters.cc/ | grep -o '<title>[^<]*</title>'
# <title>Enzo Dutra · Ingénieur logiciel</title>
```

A name that does not resolve means the wildcard DNS record is missing. A plain `404` from
Cloudflare means the tunnel still runs with its previous ingress rules (restart it). An
empty response means the active Caddyfile is not the current `Caddyfile.prod`.

## Setting-up state in the creator tools

A newly claimed address is shown as plain text with a progress bar and a remaining-time
estimate (about 20 seconds) until the backend confirms that it opens the profile. Only
then does it become a link. After two minutes the strip reads "This address does not
open your profile yet" with **Check again** and **Copy profile link**, and keeps checking
once a minute. A creator who reports an address stuck in that state usually points to a
missing DNS record or a tunnel running with old ingress rules: run the checks under
**Verify** with their address.

<audience include="dev">
The check lives in `backend/src/services/creatorTools/profileAddressLiveness.js`. An
address is live when `<slug>.<domain>` resolves (A, AAAA or CNAME) and a `HEAD` request to
`<slug>.<domain>/` (with the protocol of `FRONTEND_URL`) answers with a redirect to that member's `/user/<id>` (a language
prefix is accepted). The domain is the host of `FRONTEND_URL`. Answers are cached for ten
minutes when live and four seconds when not, and each address is probed once at a time.

- `GET /users/me/profile-address` returns the address with `live`, `reason` (`dns` or
  `http`), `checkedAt`, `pendingSince` and `serverTime`. It waits at most 1.5 seconds for the
  check; `live: null` means the answer is not known yet.
- `GET /users/me/profile-address/status` returns the same fields for the current address,
  waiting for the check (120 requests per minute per member). The page polls it with
  backoff up to every 10 seconds, then once a minute after two minutes.
- A claim or change returns `live: null` and restarts the estimate.

The backend container must be able to resolve and reach `https://<slug>.<domain>` itself,
over public DNS and the tunnel. The lookup uses `dns.resolve*`, which queries DNS servers
directly and ignores the hosts file, so `*.localhost` addresses on a local stack stay in the
setting-up state.
</audience>

## Address rules

- 3 to 30 lowercase letters, digits or single hyphens, starting and ending with a letter or
  digit, with at least one letter. Names of hosts, website routes, staff roles and anything
  containing "orbiters" are reserved (`backend/src/services/creatorTools/profileAddressRules.js`).
- Members with creator tools (or staff ranks) can claim one. The first address can be
  corrected once right away; after that an address can be changed or removed once every
  30 days.
- After a change or removal the old address keeps redirecting to the same profile for 30
  days and nobody else can claim it. Its owner can switch back during that time. Then it
  is released.
- Merging accounts moves the address to the kept account unless that account already has
  one. Merged accounts never resolve.

## Local testing

The development server treats `<address>.<site host>` the same way, where the site host
comes from `FRONTEND_URL` (or `REACT_APP_FRONTEND_URL`). Browsers resolve every
`*.localhost` name to the local machine, so with `FRONTEND_URL=http://localhost:3100`,
`http://neonix.localhost:3100` redirects to the profile and `http://enzodutra.localhost:3100`
shows the presentation page. On the website itself, `/enzodutra` and `/enzodutra/en` show
the same page for previews; their canonical address is the page's own host.
