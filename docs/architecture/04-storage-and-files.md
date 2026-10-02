---
title: Storage and Files
section: Architecture
order: 93
audience: admin, dev
stage: stable
id: orbiters.architecture.storage-and-files
domain: website
type: explanation
owner: orbiters-engineering
lastVerified: 2026-10-02
---

# Storage and Files

Orbiters stores uploaded and generated files through a storage layer that can use local disk, Cloudflare R2, or fallback behavior.

## R2 Configuration

R2 configuration is loaded from a global `R2` API key. Important fields include:

- public bucket S3 API URL,
- private bucket S3 API URL,
- access key ID,
- secret access key,
- public files base URL,
- fallback threshold,
- free storage and operation limits.

Public file delivery checks that the CDN hostname resolves before redirecting a
browser. DNS checks are shared between requests, bounded to one second, and cached
for five minutes on success or one minute on failure. An unresolved hostname uses
the existing signed R2 URL, or the local mirror when R2 delivery is disabled.
Thumbnail and PNG requests retain their selected variant. This protects blog covers
and other API-served images from a missing CDN DNS record; it does not replace
configuring a working public domain in `FILES_PUBLIC_BASE_URL`.

## Usage Counters

The backend writes hourly aggregate rows to `file_usage_hourly`, grouped by hour, provider, bucket, and metric.

Main metrics:

- `class_a_ops`: writes, deletes, and listings.
- `class_b_ops`: reads, checks, and URL generation.
- `private_presigned_urls`: generated private URLs.
- `client_reports`: browser-side reports for known public file URLs.
- `bytes_served`: bytes served from local disk fallback.
- `egress_bytes`: reserved, not currently populated from trusted R2 billing data.

## Storage Summary

The periodic monitor builds usage summaries and saves snapshots. In normal mode, R2 storage bytes are estimated from local file metadata. A remote refresh lists bucket objects directly and costs R2 Class A operations.

## Health Check

The R2 health check verifies config, backend egress IP, public bucket write/read/delete, private bucket write/read/delete, and private presigned URL fetch behavior.
