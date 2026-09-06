---
title: Request a Manual ReFit Commission
section: Creator Tools
order: 46
audience: user, creator, admin, dev
stage: stable
id: orbiters.how-to.request-refit-commission
domain: refit
type: how-to
owner: orbiters-product
lastVerified: 2026-09-05
---

# Request a Manual ReFit Commission

The jacket looks good standing still. Raise the avatar’s arm, though, and the sleeve cuts into the shoulder. That is the kind of concrete problem a manual ReFit request can help you explain to a creator.

Show where the fit fails, the pose that reveals it, and what you want to keep. A clear brief is more useful than asking the artist to guess what “not quite right” means.

> **Two separate prices:** Orbiters authorizes a **€2 request fee** and collects it
> only when a creator accepts. Agree on the **artist's price and payment directly
> with the artist**—the €2 does not pay for their work.

## Send your request

1. **Start in Unity.** After your ReFit, open **The ReFit doesn't look right?**,
   check the price ranges and click an artist card. ReFit captures and uploads four
   private views of your avatar wearing the refitted accessory, then opens the
   website with that artist selected. No mesh or scene file is uploaded automatically.
2. **Choose who to ask.** In the browser, arrange creators in preference order
   and choose their response limits (two days each by default).
3. **Review your request.** The asset, avatars and blendshape are already filled in.
   Review the captured images under **Attachments**, remove any you do not want to
   share, and optionally add reference files or images. Review the receipt and choose **Next**.
4. **Authorize €2 in Stripe.** Return to Orbiters to follow the request.

## Preview images and attachments

ReFit captures front, three-quarter, side and elevated views without changing the
scene. Its captured copy has the primary refit blendshape at 100%; other blendshapes
and the pose use their current scene values. Set the body and matching clothing
blendshapes to the state you want the artist to inspect before clicking a card.

Requests support **eight attachments total, up to 10 MB each**, including the four
automatic images. Uploaded JPEG, PNG and WebP images are saved as JPEG for opaque
images or PNG when transparency is present, at up to 1600 pixels per side.
Automatic avatar photos download as JPEG. Animated images and SVG previews are not supported. Other files are
downloadable attachments. Only share files you have permission to send. Do not open
untrusted downloaded files without checking them.

The client and creators with an active offer can view the private attachments.
The accepting creator keeps access. Waiting candidates do not get access until
their offer becomes active; closed, unaccepted offers lose access. Submitted
attachments are retained with the request. Unsubmitted uploads become eligible
for cleanup after 24 hours. If preview import fails, reload the request page to
retry before proceeding to checkout.

## What happens to the request fee?

The two amounts on a commission do different jobs. Try the moments below; the artist's €40 price is fictional, while the Orbiters request fee is €2.

```orbiters
{"kind":"commission-receipt"}
```

Stripe calls this separation [authorization and capture](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method): reserving funds and collecting them are different events. Your bank's display can make the distinction less obvious.


A card hold is temporary. The total request window is at most **six days**,
and may be shorter depending on the card's authorization deadline.

### Choose how creators receive the request

| Ask in preference order | Ask everyone at once |
| --- | --- |
| One creator receives the offer at a time. | All selected creators receive it together. |
| A decline or timeout moves to the next creator. | The first creator to accept gets the job. |

When someone accepts, other offers close. You receive an Orbiters notification,
plus push or Discord notifications when available. Open the request to find the
creator's profile and contact links.

## Give the artist something they can act on

> **Example brief · A sleeve that pinches**
>
> “The shoulder clips when the arm lifts sideways. I attached a front and side view in that pose. Please keep the loose cuff and the current chest fit; the shoulder is the part I want corrected.”

This names a visible defect, a way to reproduce it and two things to preserve. Review your captures before paying: a beautifully framed neutral pose may conceal the problem you are asking someone to fix.

## Follow the work

Open **My Account → My commissions**, or select a commission in your avatar menu.


These are milestones, **not a delivery countdown**. The creator updates the stage
and can add notes or delivery links. Completed or closed requests move to
**Past commissions**.

## Need help?

| What you see | What to do |
| --- | --- |
| Checkout was interrupted | Open the saved request and choose **Continue to payment** when ready. |
| **Release pending** | The provider has not confirmed release of the hold yet. |
| No creator accepted | Check whether the next creator is being asked or the request has expired. |
| The payment panel says **Paid** | The creator accepted and Orbiters collected the request fee. |

Before acceptance, creators see the offer, deadline and shared attachments, not
your account identity or technical asset fields. Images and files can themselves
contain identifying information: review them before submitting. Acceptance reveals
the remaining context to the accepting creator.

<audience include="creator, admin, dev">

**Are you a creator?** Read [Accept ReFit commissions](/documentation/orbiters.how-to.accept-refit-commissions).

</audience>
