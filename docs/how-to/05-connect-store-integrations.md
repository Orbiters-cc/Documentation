---
title: Connect Store Integrations
section: Creator Tools
order: 41
audience: creator, admin, dev
stage: stable
---

# Connect Store Integrations

Store integrations let creators connect outside stores to Orbiters. Orbiters can import products, verify license keys, mirror sales, and receive sale or license events where the provider supports it.

## Supported Providers

- **Gumroad**: product sync, license verification, sale webhooks, and sales backfill.
- **Jinxxy**: product sync, license lookup, license backfill, and webhook support when available.
- **Payhip**: license verification through creator-provided product secret keys.
- **Lemon Squeezy**: product sync, license validation, webhook signing, and license backfill.

## Connect A Store

1. Open **Creator**.
2. Open **Integrations**.
3. Choose the store provider.
4. Enter the provider credentials.
5. Save the integration.
6. Run a sync if the first sync does not start automatically.
7. Link imported products to Orbiters assets.

## Provider Credentials

### Gumroad

Use a Gumroad access token. Orbiters can import products and register sale webhooks.

### Jinxxy

Use a Jinxxy Creator API key. Enter a webhook signing secret if Jinxxy provides one for your account.

### Payhip

Payhip license checks are product-secret based. Enter product data as JSON:

```json
[
  {
    "productKey": "example-product",
    "productSecretKey": "example-secret",
    "name": "Avatar Pack",
    "url": "https://payhip.com/b/example"
  }
]
```

### Lemon Squeezy

Use a Lemon Squeezy API key. Store ID and webhook signing secret are optional. If no store ID is entered, Orbiters uses the first store returned by Lemon Squeezy.

## Integration Status

- `ACTIVE`: usable by sync, redemption, and webhook flows.
- `NEEDS_KEY`: no active creator credential resolved, or the provider rejected credentials.
- `ERROR`: the integration hit an error that needs attention or background retry.
- `DISABLED`: not used by runtime flows.

<audience include="dev">

Integrations store no foreign key to API key rows. Credentials are resolved at call time through `apiCredentialService` by `(type, ownerId)`. Key rotation should not break an integration; missing keys move the integration to `NEEDS_KEY`.

</audience>

