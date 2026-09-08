---
title: Community event delivery
section: Community
order: 156
audience: dev
stage: beta
id: orbiters.community.event-delivery
domain: website
type: reference
owner: orbiters-docs
lastVerified: 2026-09-08
---

# Community event delivery

The `/community-events` API stores event drafts, destination communities and
community-specific website grants. JWT authentication and human-account checks
apply throughout. Event and community list/detail routes read local state;
team lists and member searches check current provider authority, as do privileged
actions and authorized delivery jobs.

## Persistence and authorization

`EventCommunity` binds a Discord server or VRChat group to a server-controlled
connection. VRChat connections retain their encrypted service-state key and
original account ID internally. Replacing an account does not transfer authority
over its event destinations. The public serializer excludes connection keys and
session material.

`EventCommunityGrant` assigns website admin/moderator access. Provider-native
authority is checked before mutations. Delegation records its originating native
administrator; their current authority is checked when a delegate acts.
Team reads and member searches require management authority through the same
check. A saved admin grant alone is insufficient after its native authority is lost.

## Banner retention and refresh timing

Banner uploads are private File records. Every five minutes, a bounded cleanup
scan checks uploads older than 24 hours. Any saved event reference protects its
banner, regardless of event status. Saving an event and cleanup lock the same
File row: cleanup cannot race a save into deleting the newly referenced image.

Unreferenced uploads become inactive before deletion. Cleanup removes their local
and Orbiters object-storage copies, then the File record to release upload quota.
A storage failure retains the inactive record for retry and still counts against
quota. This does not remove images already delivered to VRChat's gallery.

The Events page refreshes every five seconds while work is busy or due. A future
scheduled action sets a timer for its due time instead of polling throughout the
wait. Hidden tabs pause automatic refresh; returning resumes it. The backend
worker continues independently of whether anyone has the page open.

`CommunityEvent` contains a creator, revision, event data and per-step delivery
receipts. Reads and edits are creator-scoped. Revisions reject stale edits.
The client submission UUID prevents duplicate drafts. Named indexes and separate
tables avoid alterations to populated user tables. New models sync without alter.

The editor retains the ID and revision returned by a successful save before
requesting publication. If publication fails or its response is lost, it reads
the event to reconcile the outcome. A confirmed publication is not resubmitted;
an unavailable reconciliation must succeed before another write. A draft changed
by another editor requires reopening rather than silently adopting its revision.

## Delivery

The worker scans locally for due work every ten seconds. A conditional database
claim gives one worker a ten-minute lease. Every step records `sending` before its
provider mutation, then persists the returned ID and `done` state. Interrupted
`sending` steps become `uncertain`; they are not automatically recreated.

Workers and manual recovery reserve provider IDs under a PostgreSQL transaction
advisory lock before saving their receipts. The lookup includes all other events
in the same community and delivery kind; instance IDs also include the world in
their scope. Existing receipts cannot be reassigned to another event. Recovery
checks scheduled start/end times for calendar and Discord records, and the
generated schedule text for announcements.

Account closure clears the event schedule and invalidates its lease token in the
same transaction. A worker holding the old token cannot persist another step or
restore the schedule. An already-sent provider request may finish, but the worker
stops when its next lease-checked write fails.

| Step | Provider operation |
| --- | --- |
| VRChat calendar | Create `POST /calendar/{groupId}/event`; edit `PUT /calendar/{groupId}/{calendarId}/event` |
| Discord scheduled event | External guild event through the designated discord.js client; edit the saved event ID |
| VRChat announcement | Create `POST /groups/{groupId}/posts`; edit the saved post ID |
| VRChat instance | `POST /instances` with group owner ID, world, region, audience and `calendarEntryId` |

VRChat requests reuse the existing account session, serialized transport, pacing
and rate-limit backoff. Group permission validation shares one live group response
per worker pass. Existing profile/group websockets continue to update their
snapshots; navigating Events does not start additional provider polling.

Reference contracts were checked against the upstream
[calendar specification](https://github.com/vrchatapi/specification/blob/master/openapi/components/paths/calendar.yaml),
[instance request schema](https://github.com/vrchatapi/specification/blob/master/openapi/components/requests/CreateInstanceRequest.yaml)
and [Discord scheduled events API](https://docs.discord.com/developers/resources/guild-scheduled-event).
The Discord external-event location field is limited to 100 characters, so long
instance links go in the description. VRChat calendar update requests omit
creation-only access fields and disable repeat creation notifications.

Cancellation uses the same durable steps. New instances are never created while
cancelling. Failed operations require explicit retry; uncertain operations require
provider inspection, verification of an existing ID, or explicit retry authorization.
Cancellation permission checks cover only pending operations with an existing
provider ID, so an absent instance does not require instance-management access.

## Validation and release boundary

Deterministic tests cover payloads, timing, revisions, creator isolation,
delegation revocation, partial failure, worker claims and cancellation. Isolated
PostgreSQL checks boot fresh and populated schemas twice and preserve pre-existing
rows and partially created community tables. UI fixtures verify that browsing
and opening editors cause no provider writes.

These are local tests with simulated providers. A release still needs a controlled
live check using authorized Discord and VRChat communities; automated tests do not
establish compatibility with future changes to VRChat's unofficial API.
