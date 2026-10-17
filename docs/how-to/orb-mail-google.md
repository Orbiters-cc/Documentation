---
title: Give Orb your email and Google Workspace
section: Account
order: 39
audience: admin, dev
stage: alpha
id: orbiters.how-to.orb-mail-google
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-10-17
relations: orbiters.how-to.me-scout, orbiters.reference.scout-agent-api
---

# Give Orb your email and Google Workspace

Orb can read up to two mailboxes and, separately, your Google Calendar, Drive, Docs and Sheets. It reads freely,
summarises important new mail in the daily digest, and asks you before anything that sends, replies, deletes, moves,
flags or edits. Everything is set up in **Orb → Settings → Agents & keys → Email & Google**, except the Google sign-in,
which you do once on the Pi.

## How Orb is kept in check

Orb's chat normally has no terminal. The mail and Google skills need one, so while an account or Google Workspace is
set up the chat gets a terminal that runs only `himalaya` (mail) and the `google-workspace` skill's scripts, one plain
command at a time. A guard on the Pi (`/usr/local/bin/orb-guard`) checks every command before it runs:

- Reading runs at once. Reading a message never marks it as read.
- Sending, replying, forwarding, moving, deleting or flagging mail, creating or deleting calendar events, editing Docs or
  Sheets and sharing or uploading files stop at an approval prompt on Telegram or Discord that shows the exact command.
  Approve only what you asked for in the chat. Scheduled jobs (digest, planner) can never approve.
- Anything else (other programs, pipes, redirections, variables) is refused, and Orb's file tools may not change the
  files the terminal loads.

Mail is written by strangers: Orb treats it as data, never as instructions, and tells you when a message looks like
phishing or an attempt to steer it.

## Add a Gmail account

1. Turn on 2-Step Verification for the Google account if it is not on yet.
2. Create an app password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) (name it
   `Orb`). Google shows 16 letters once.
3. In **Email & Google**, enter the address and select **Add**, then paste the app password and select **Save**.

Gmail's servers are filled in for `gmail.com` addresses. For another provider, check the IMAP and SMTP servers with the
servers button: port 993 (IMAP) and 465 (SMTP) use TLS, other ports use STARTTLS. Removing an account deletes its app
password. The Pi applies changes within a minute: it writes `~/.config/himalaya/config.toml` for the `hermes` user (the
passwords sit in separate `0600` files next to it) and removes it when no account is left.

Install or upgrade Orb on the Pi once after this feature arrives (`sudo bash install/install.sh` from your copy of
`agents/orb`): it installs `himalaya` 1.2.0 (checksum-pinned) and the guard. Until then Orb keeps its terminal off.

## Connect Google Workspace

Hermes' `google-workspace` skill uses your own Google Cloud OAuth client. It works for one Google account.

### Create the OAuth client (once, about 10 minutes)

1. Create a project at [console.cloud.google.com/projectcreate](https://console.cloud.google.com/projectcreate), for
   example `orb-assistant`.
2. In **APIs & Services → Library**, enable: **Gmail API**, **Google Calendar API**, **Google Drive API**,
   **Google Sheets API**, **Google Docs API** and **People API**.
3. In **Google Auth Platform → Branding**, set the app name (`Orb`) and your email as support and developer contact.
4. In **Google Auth Platform → Audience**:
   - A Google Workspace (company) account: choose **Internal**. Nothing else is needed.
   - A personal `gmail.com` account: choose **External**, add your account under **Test users**, then select
     **Publish app** (status **In production**). An app left in **Testing** gets sign-ins that expire after 7 days.
     Google does not need to verify an app only you use; when you sign in it warns that the app is unverified: choose
     **Advanced → Go to Orb**.
5. In **Google Auth Platform → Clients**, select **Create client**, type **Desktop app**, name `Orb on the Pi`, then
   **Download JSON**.

### Sign in on the Pi (as the `hermes` user)

Copy the JSON file to the Pi and hand it to Hermes:

```bash
scp client_secret_*.json pi:/tmp/orb-google-client.json
ssh pi
sudo install -o hermes -g hermes -m 0600 /tmp/orb-google-client.json /home/hermes/orb-google-client.json && rm /tmp/orb-google-client.json
sudo -u hermes -H bash
cd ~ && source ~/.hermes/hermes-agent/activate
GSETUP="python ~/.hermes/skills/productivity/google-workspace/scripts/setup.py"
$GSETUP --client-secret ~/orb-google-client.json && rm ~/orb-google-client.json
$GSETUP --auth-url --services all --format json
```

Open the `auth_url` it prints in a browser on your computer, sign in with the Google account Orb should use and accept.
The browser then fails to open `http://localhost:1/...`: that is expected. Copy the whole address from the address bar
and finish on the Pi:

```bash
$GSETUP --auth-code "http://localhost:1/?state=...&code=...&scope=..." --format json
$GSETUP --check
exit
```

`--check` prints `AUTHENTICATED`. The token is kept in `/home/hermes/.hermes/google_token.json` and renews itself. To
grant fewer services, use for example `--services calendar,drive,docs,sheets` in the `--auth-url` step.

### Turn it on in Orbiters

In **Email & Google**, turn on **Google Workspace** and choose the account you signed in with. Within a minute Orb keeps
the skill and knows which account it reads.

To disconnect, turn it off in Orbiters and run `$GSETUP --revoke` on the Pi as above, or remove the app's access at
[myaccount.google.com/connections](https://myaccount.google.com/connections).

## Troubleshooting

| What you see | What to do |
| --- | --- |
| The account says **Add an app password** | Paste the app password and select **Save**; Orb ignores an account without one. |
| Orb says it cannot log in to Gmail | Create a new app password (they stop working when you change the Google password) and save it. |
| The digest says an account could not be read | The message after the account name is himalaya's error: usually a wrong password or server. |
| `NOT_AUTHENTICATED` or `REFRESH_FAILED` from Google | Repeat **Sign in on the Pi**. An app left in **Testing** expires every 7 days: publish it. |
| `Error 403: access_denied` while signing in | Add the account under **Audience → Test users**, or publish the app. |
| `HttpError 403: Access Not Configured` | Enable the API it names in **APIs & Services → Library**. |
| Orb answers "Blocked by Orb" | The guard refused a command; Orb rephrases it. If it keeps happening, tell Orb what you wanted done. |
