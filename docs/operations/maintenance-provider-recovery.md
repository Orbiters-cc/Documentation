---
title: Recover provider maintenance and shipping estimates
section: Operations
order: 145
audience: admin, dev
stage: beta
id: orbiters.operations.maintenance-provider-recovery
domain: website
type: runbook
owner: orbiters-platform
lastVerified: 2026-09-23
---

# Recover provider maintenance and shipping estimates

Commission request processing, media cleanup, privacy retention and Stripe revenue
synchronization run as independent maintenance steps. A failed step retries with
increasing delays from two minutes up to thirty minutes while other steps continue.
GitHub Project synchronization uses the same retry policy, in addition to its
configured polling interval. Logs identify the failed task and a safe error code.

## Connection failures

A Stripe connection error or GitHub transport failure does not establish that the
credentials are invalid. First inspect the integration's last successful sync and
stored error. If synchronization has resumed, avoid replacing valid credentials.

For repeated connection failures, check outbound HTTPS, DNS, certificate trust,
system time and proxy/firewall configuration on the backend host. GitHub requests
time out after fifteen seconds and report a safe network error. For explicit
authentication or permission failures, check the account, environment and granted
permissions in the relevant Admin integration settings.

Do not repeatedly restart the backend to defeat retry backoff. Keep previously
synchronized data available and watch for a successful retry. If a GitHub response
exceeds the bounded pagination limit, the sync aborts before replacing board data;
review the configured repository scope before retrying.

## Shipping provider failures

Configure any combination of EasyPost, UPS and FedEx through the global
[API Keys settings](../reference/04-api-keys-and-credentials.md). The shipping
estimator queries providers independently and retains successful public-rate
results when another provider fails. A partially available estimate identifies
the sources that supplied its rates. Never substitute a discounted account price
or invent a zero-cost quote when no public rate is available.

Production rating access and provider account approval must be verified separately
from fixture tests. The website environment selects credential scope; it does not
turn a carrier production endpoint into a sandbox. Use consented test addresses
and never purchase postage as a connectivity test.

## Release validation

Run backend tests on Node 22, including the maintenance startup regression. That
regression keeps the changed initializers real, stubs external dependencies and
checks HTTP readiness with external startup both enabled and disabled.

Shipping credential enum upgrades have an isolated fresh/populated database
regression. Run it against a disposable PostgreSQL instance only. Keep production
backup, cloned-data migration rehearsal, HTTP readiness and live integration checks
as separate gates. A database-only startup exit does not prove that workers or the
HTTP service started successfully.

After deployment, verify both frontend and backend release IDs, sample artwork and
finishes on desktop/mobile, quote sources/currencies, unpublished preview privacy,
and successful worker recovery. Observe at least one retry interval when a provider
was degraded, and retain sanitized evidence without credentials or postal addresses.
