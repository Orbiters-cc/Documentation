---
title: Run your job search worker on a Raspberry Pi
section: Account
order: 37
audience: admin, dev
stage: alpha
id: orbiters.how-to.me-job-search-worker
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-11-02
relations: orbiters.how-to.n4n0-job-search, orbiters.reference.job-search-worker-api, orbiters.decision.personal-agents-on-member-hardware
---

# Run your job search worker on a Raspberry Pi

The **N4N0** workspace ([orbiters.cc/n4n0/workspace](https://orbiters.cc/n4n0/workspace), formerly Me) keeps your job search in
Orbiters: offers, lists and their Quests, your profile, research queues, collection runs and the keys your agents use.
Orbiters never visits job sites itself. A worker on your own Raspberry Pi takes the queued work, runs the lookups
and sends the results back. The same workspace hosts N4N0, your personal assistant; see
[Set up N4N0, your personal business assistant](/documentation/orbiters.how-to.me-scout). To use the job search
itself, see [Search for jobs with your profile in N4N0](/documentation/orbiters.how-to.n4n0-job-search).

Your Pi is your Hermes machine. Until it (or N4N0) is paired, the job search, research, profile and N4N0 agent pages
show **Pair your Hermes machine**; only the free **Talk to N4N0** chat works without it. Once paired, the page header
shows **Worker online** or **Worker offline**, and queued research waits while the worker is offline.

## Before you start

- The `n4n0-workspace` feature (formerly `me-workspace`) is enabled for your account. Without it, Orbiters refuses the
  worker's requests too, even with a valid token.
- A Raspberry Pi 4 or newer with Raspberry Pi OS Bookworm (64-bit), 2 GB of free memory and SSH access.
- A copy of `agents/job-worker` from the Orbiters repository on that Pi.

## Install the worker

On the Pi, from the folder that contains `job-worker`:

```bash
sudo bash job-worker/install/install.sh
```

The installer:

- creates the `findings` system account and installs the worker in `/opt/findings-worker`;
- installs Python packages and the Chromium build used for public offer pages;
- keeps the cache in `/var/lib/findings-worker`;
- loads the `findings-egress` network rules. The worker can use DNS and the internet, but nothing on your
  local network (router, NAS, other computers).

Run the same command again to update the worker. Updating keeps the pairing and the cache.

## Pair it with your account

1. In Orbiters, open **N4N0 → Settings → Agents & keys** and choose **Pair** on **Job search worker**.
2. Copy the token. Orbiters shows it once.
3. On the Pi, run `sudo findings-worker-pair`, keep the suggested API address and paste the token.

The command checks the token as the worker account before saving it, so a success also proves the network
rules let the worker reach Orbiters. The token is stored in `/etc/findings-worker/env`, readable only by
root and the worker.

> Never paste the token into a website, a chat or a prompt. Pairing again replaces it.

## Check that it works

- The job search pages open instead of **Pair your Hermes machine**, and the header shows **Worker online** within
  half a minute.
- **Settings → Home & commute → Find address** returns matching addresses.
- On the Pi, `journalctl -u findings-worker -f` lists each task as it runs.

## Add the keys some sources need

Keys live in Orbiters and are released only to the paired worker when a task needs them:

| Key | Where to add it | Used for |
| --- | --- | --- |
| USAJOBS API key and account email | **Sources → Source keys** | U.S. federal jobs. |
| Adzuna app ID and app key | **Sources → Source keys** | Adzuna's listings in the chosen country. |
| Jooble API key | **Sources → Source keys** | Jooble's listings (500 requests per free key, in total). |
| The Muse API key (optional) | **Sources → Source keys** | A higher hourly limit for The Muse. |
| France Travail client ID and secret | **Sources → France Travail** | The official French offers API. |
| PRIM API key | **Settings → Home & commute** | Bike and transit times in Île-de-France. |

**Source keys** lists the keys of the sources you selected. Each source's terms are summarised in
[Search for jobs with your profile in N4N0](/documentation/orbiters.how-to.n4n0-job-search#sources-and-their-keys).

## Search outside France

The worker searches the country chosen in **Sources**. Google searches made for office and company research are in
French by default; for a worker that mostly researches US or other English-language offers, add
`FINDINGS_SEARCH_LANGUAGE=en` to `/etc/findings-worker/env` and restart it with
`sudo systemctl restart findings-worker`. Home addresses outside France are found through OpenStreetMap's Photon.

## Stop or remove the worker

- Choose **Unpair** in **N4N0 → Settings → Agents & keys** to revoke the token immediately. The worker stops getting
  work at its next request. If no N4N0 agent is paired either, the job search pages show **Pair your Hermes machine**
  again; your data is kept.
- On the Pi, `sudo systemctl disable --now findings-worker` stops it locally.

## Troubleshooting

| What you see | What to do |
| --- | --- |
| **Worker offline** after pairing | Run `systemctl status findings-worker`; a missing `/etc/findings-worker/env` means pairing did not finish. |
| Tasks stay **Queue paused** | The lane is paused in **Research**; choose **Resume**. |
| Many tasks wait on one website | That site asked the worker to slow down. Orbiters parks only that source and retries it later; other sources continue. |
| `Orbiters refused this worker` | The token was replaced or revoked. Pair again. |
| `Orbiters refused this worker: This account does not have N4N0's Hermes features.` | The `n4n0-workspace` feature is not enabled on your account (any request answers `403`). Ask an admin to enable it, then pair again. |
| **Pair your Hermes machine** although the worker was paired | The token expired or was revoked. Pair again. |
| A source's tile says **Needs a key** | Add its key under **Sources → Source keys**. |
