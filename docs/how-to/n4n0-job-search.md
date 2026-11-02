---
title: Search for jobs with your profile in N4N0
section: Account
order: 37
audience: admin, dev
stage: alpha
id: orbiters.how-to.n4n0-job-search
domain: website
type: how-to
owner: orbiters-product
lastVerified: 2026-11-02
relations: orbiters.how-to.me-job-search-worker, orbiters.how-to.me-scout, orbiters.reference.job-search-worker-api, orbiters.decision.personal-agents-on-member-hardware
---

# Search for jobs with your profile in N4N0

**Job search** in the N4N0 workspace ([orbiters.cc/n4n0/workspace](https://orbiters.cc/n4n0/workspace)) turns your CV
into a profile, collects offers that match it in the country you choose, and gives every offer list its own Quest. Its
tabs are **Offers**, **Profile**, **Quest** and **Sources**. The lookups run on your own machine, never on Orbiters: see
[Run your job search worker on a Raspberry Pi](/documentation/orbiters.how-to.me-job-search-worker).

## Before you start

- The `n4n0-workspace` feature is enabled for your account.
- A Hermes machine is paired: the job search worker or N4N0 installed on your own computer or Raspberry Pi and paired in
  **N4N0 → Settings → Agents & keys**, with a token that has not expired.

**Talk to N4N0**, the chat, needs neither: every signed-in member can use it. Everything that runs on your machine does:
job search, its research lanes, the profile, N4N0's agent tabs (**Assistant**, **Reports**) and the **General**,
**Owner brief** and **Research** settings.

Until a machine is paired, those pages and the Overview show **Pair your Hermes machine** with a **Pair a machine**
button that opens **Settings → Agents & keys**. Pairing and the keys stay available there without a machine, since that
is where you pair one. Unpairing the last machine, or letting its token expire, closes the pages again; your offers,
lists, profile and progress are kept.

## Build your profile from your documents

1. Open **Job search → Profile**.
2. Under **Documents**, add your CV, résumé, cover letters or LinkedIn export: PDF, Word (`.docx`), Markdown, text or
   CSV, up to 4 MB each, 12 files and 20 MB in total. Re-upload a file with the same name to replace it. These are the
   same documents N4N0 reads in **Assistant**.
3. Every time a document is added, replaced or removed, the profile is read again in two steps:
   - Orbiters reads the text at once (English and French CVs) and shows a first profile.
   - Your Hermes machine then reads the documents with your planning model. The chip says **N4N0 is reading**, then
     **Read by N4N0**, and the model's reading replaces the first one. If it fails, or has not answered after three
     hours, the chip says **N4N0 could not read them** and the first reading stays. This step needs N4N0 on the
     machine; with only the job worker, the profile keeps Orbiters' reading.

The profile holds target roles, skills, tools, seniority, languages, industries, locations, the country to search in,
a work mode (remote, hybrid, on-site or no preference), a stated salary and a short summary. A PDF without text (a scan)
is listed as unreadable: Orbiters cannot read it, N4N0 on your machine may (it uses `pdftotext`), or add a text version.

### Correct it

Choose **Edit**, change any field and **Save profile**. Fields you change stay as you wrote them when your documents
change and the profile is read again. **Read again** reads the documents now and keeps your edits. **Reset edits**
(shown once you edited something) reads the documents again and gives every field the documents' value.

## Search with your profile

1. Open **Job search → Sources** (or **Search with my profile** under the profile).
2. Turn on **Use my profile**. Every keyword and criterion of your profile appears as a chip, grouped as Roles, Skills,
   Tools, Industries, Languages, Level, Locations and Work mode.
3. Remove the chips you do not want and add your own in any group except Work mode. **Restore all** brings back the
   profile's chips.
4. Choose the country and sources (see below), then start the collection.

The research runs with exactly the chips you kept:

| Chips | What they do |
| --- | --- |
| Roles | Each one is a search (up to 6). Without a role chip, your skills and tools are searched instead. |
| Locations | Where to search (the first 3). A location naming a country, such as `Austin, TX` or `Lyon, France`, sets the country. |
| Each role × each location | Searched separately, at most 8 searches per collection. The run history labels each source with its role and place. |
| Skills, tools, industries, languages, level | An offer is kept only when its title or description mentions at least one of them. |
| Work mode | Keeps remote, hybrid or on-site offers only. Without this chip, the form's **Work mode** applies. |

Keep a role, skill or tool chip: the research needs something to search for. The chips are saved with the run:
**Activity** marks it **from your profile** and lists the chips it searched with. Without **Use my profile**, the collection searches the **Search terms** you type, in
the place you enter.

## Choose a country

Every search targets one country, chosen in **Sources → Country**, then a city, state or region in it (`Austin, TX`,
`Lyon`) or the country's name to search all of it, and a work mode.

- A new workspace starts on the **United States**: USAJOBS, The Muse, Remote OK and the Greenhouse, Lever and Ashby
  boards of a few US employers.
- **France** keeps its own defaults (Welcome to the Jungle and French employer boards), and France Travail and its
  department filter are offered there. Searches saved before countries existed are French searches and continue where
  they stopped.
- Other countries start with remote and employer-board sources. Switching country drops the sources that have no offers
  there and replaces a place that named the previous country.

The country also sets the rest of the page: the map opens on it (US offers that only name a state get a point in that
state), salaries default to its currency (US salaries are read as USD), and the meal-voucher and transport filters
appear only for France. Office research looks first at offers in the place you search instead of Paris. Your home
address can be anywhere; bike and transit times exist for Île-de-France only, and elsewhere an offer shows the
straight-line distance from home.

## Sources and their keys

The Sources grid lists only the sources that have offers in the chosen country. Some need a free key of your own:
a source's tile says **Needs a key** or **Key saved**; choose the source, then add the key under **Source keys**. Keys are stored encrypted and only your job worker reads
them; the page never shows a saved key again.

| Source | Where | Key | Terms to know |
| --- | --- | --- | --- |
| USAJOBS | US federal jobs | API key and the account email it was requested with ([developer.usajobs.gov](https://developer.usajobs.gov/apirequest/)) | The email is sent with each request, as the API requires. |
| Adzuna | US, UK, Canada, most of Europe, Australia, New Zealand, India, Singapore, Brazil, Mexico | App ID and app key ([developer.adzuna.com](https://developer.adzuna.com/signup)) | Offers keep their Adzuna link. |
| The Muse | US and flexible or remote | Optional key: raises the limit from 500 to 3,600 requests an hour | No keyword search: offers are matched on your worker. Links point back to The Muse. |
| Remote OK | Remote, worldwide | None | Offers link back to Remote OK, as its terms ask. Regional restrictions in an offer still apply. |
| Jooble | US and international | API key ([jooble.org](https://jooble.org/api/about)) | A free key allows 500 requests in total: keep **Pages per source** low. |
| SmartRecruiters | Any country | None | Employer boards by company ID (**SmartRecruiters company IDs**), filtered to the country. |
| France Travail | France | Client ID and secret, in its own card | Official French offers API; department filter. |

Indeed and Glassdoor search the chosen country's site, and Himalayas and Jobicy its remote offers. They need no key.

## Follow a Quest for each list

Every offer list has its own Quest, built from the offers saved in it: a mission joins the Quest when an offer in the
list asks for it, and missions you already started stay. Open **Job search → Quest** and pick the list in **Quest for
the list**; each list shows its offer count and how many missions are cleared. Links to a list's Quest use
`?tab=quest&list=<list id>`.

- Without a list, the Quest asks you to create one; an empty list asks you to add offers.
- When no mission matches a list's offers yet, the Quest says so. Missions cover software, data, AI, cloud and mobile
  roles.
- Progress belongs to the list. The progress of the former Priority Quest stays with your **Priority shortlist**, and
  without a list chosen the Quest opens that list (else the first list with offers). Deleting a list deletes its Quest
  progress, except the Priority shortlist's, which a new list of that name finds again.
