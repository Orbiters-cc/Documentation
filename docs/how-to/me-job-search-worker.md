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
lastVerified: 2026-10-14
relations: orbiters.reference.job-search-worker-api, orbiters.decision.personal-agents-on-member-hardware
---

# Run your job search worker on a Raspberry Pi

The **Orb** workspace ([orbiters.cc/orb](https://orbiters.cc/orb), formerly Me) keeps your job search in
Orbiters: offers, lists, the Priority Quest, research queues, collection runs and the keys your agents use.
Orbiters never visits job sites itself. A worker on your own Raspberry Pi takes the queued work, runs the lookups
and sends the results back. The same workspace hosts Orb, your personal assistant; see
[Set up Orb, your personal business assistant](/documentation/orbiters.how-to.me-scout).

Until a worker is paired, the Orb page shows **Worker offline** and queued research waits.

## Before you start

- The `orb-workspace` feature (formerly `me-workspace`) is enabled for your account.
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

1. In Orbiters, open **Orb → Agents & keys** and choose **Pair** on **Job search worker**.
2. Copy the token. Orbiters shows it once.
3. On the Pi, run `sudo findings-worker-pair`, keep the suggested API address and paste the token.

The command checks the token as the worker account before saving it, so a success also proves the network
rules let the worker reach Orbiters. The token is stored in `/etc/findings-worker/env`, readable only by
root and the worker.

> Never paste the token into a website, a chat or a prompt. Pairing again replaces it.

## Check that it works

- The Orb page header shows **Worker online** within half a minute.
- **Settings → Home & commute → Find address** returns matching addresses.
- On the Pi, `journalctl -u findings-worker -f` lists each task as it runs.

## Add the keys some sources need

Keys live in Orbiters and are released only to the paired worker when a task needs them:

| Key | Where to add it | Used for |
| --- | --- | --- |
| France Travail client ID and secret | **Sources → France Travail** | The official offers API. |
| PRIM API key | **Settings → Home & commute** | Bike and transit times in Île-de-France. |

## Stop or remove the worker

- Choose **Unpair** in **Orb → Agents & keys** to revoke the token immediately. The worker stops getting work
  at its next request.
- On the Pi, `sudo systemctl disable --now findings-worker` stops it locally.

## Troubleshooting

| What you see | What to do |
| --- | --- |
| **Worker offline** after pairing | Run `systemctl status findings-worker`; a missing `/etc/findings-worker/env` means pairing did not finish. |
| Tasks stay **Queue paused** | The lane is paused in **Research**; choose **Resume**. |
| Many tasks wait on one website | That site asked the worker to slow down. Orbiters parks only that source and retries it later; other sources continue. |
| `Orbiters refused this worker` | The token was replaced or revoked. Pair again. |
