# Gather: free event discovery site (Next.js + Google Sheets)

Events live in a Google Sheet. A tiny Google Apps Script returns **published rows only** as JSON. Next.js builds SEO-friendly, server-rendered pages from it. There is no database, no user accounts, no custom chat and no paid API.

```
Google Sheet (private) -> Apps Script (read-only JSON, whitelisted columns) -> Next.js (pages regenerate every 10 min) -> Vercel
```

## 1. Create the sheet
1. Create a Google Sheet, rename the first tab to **Events**.
2. File > Import > upload `sheet-template/events-template.csv` > "Replace current sheet". (Or paste these headers in row 1.)

| Column | Notes |
|---|---|
| id | Any unique value, never reused |
| slug | URL part, e.g. `pune-web-dev-meetup`. Leave blank to auto-generate. **Don't change after publishing** (it is the permanent URL) |
| title, description | Description supports line breaks |
| category | Technology, Business, Networking, Workshops, Sports, Music, Social (others also work) |
| city, venue | For online events use city `Online` or a venue starting with `Online` |
| start_datetime, end_datetime | Format cells as Date time. End is optional |
| image_url | Public `https://` image, ideally 1200x630 |
| price | `Free`, `0` or blank = free; anything else is shown as typed (e.g. `₹500`) |
| organizer_name, registration_url | Registration is an external link; no tickets are sold here |
| contact_url | `https://wa.me/91XXXXXXXXXX` or `mailto:name@example.com` |
| **contact_public** | Tick/enter `TRUE` only if the organizer agreed to publish `contact_url`. Otherwise it is never sent to the site |
| group_url | Optional WhatsApp/Telegram/Discord community link |
| status | Only `published` rows appear. Use `draft` or anything else to hide |

To add, edit or unpublish an event, just edit the sheet. Changes show up within ~10 minutes.

## 2. Deploy the Apps Script
1. In the sheet: **Extensions > Apps Script**. Paste `apps-script/Code.gs`.
2. (Recommended) **Project Settings > Script properties > Add** `API_TOKEN` = a long random string.
3. **Deploy > New deployment > Web app**: Execute as **Me**, Who has access **Anyone**. Authorize and copy the `/exec` URL.
4. Test: open `<exec URL>?token=<your token>` in a browser; you should see `{"events":[...]}`.

The sheet stays private. The script is read-only and returns only the whitelisted columns. Be aware the web app URL is publicly reachable; the token is a basic guard against casual scraping, not strong security, so **never put anything confidential in the sheet's public columns**. If you change the script, use Deploy > Manage deployments > Edit > New version.

## 3. Run locally
```bash
cp .env.example .env.local   # fill in APPS_SCRIPT_URL / APPS_SCRIPT_TOKEN
npm install
npm run dev                  # http://localhost:3000
```
Without `APPS_SCRIPT_URL` the site shows built-in demo events (`lib/sample.js`).

## 4. Deploy free (Vercel)
1. Push this folder to a GitHub repository.
2. At vercel.com, **Add New > Project**, import the repo (framework is auto-detected).
3. Add environment variables from `.env.example`. Set `NEXT_PUBLIC_SITE_URL` to your final URL (e.g. `https://your-project.vercel.app`) and redeploy once it is known.
4. Done. Every `git push` redeploys; sheet edits go live via background regeneration (ISR) within ~10 minutes.

Free-tier notes (check current limits, they change): Vercel's Hobby plan is for **non-commercial/personal use** and has monthly bandwidth, build and function-invocation caps; uptime isn't guaranteed. Google Apps Script has daily execution and URL-fetch quotas. This site calls the script at most about once per 10 minutes per region, far below typical quotas, but it is not unlimited. Netlify or Cloudflare Pages can host Next.js too, but ISR support differs, so test before relying on them.

## 5. SEO checklist
- Unique URL per event: `/events/<slug>`; city pages `/city/<city>`; category pages `/category/<category>`.
- Unique title/description, canonical URL and Open Graph tags per page; server-rendered HTML.
- Schema.org `Event` JSON-LD on every event page; `/sitemap.xml` and `/robots.txt` generated automatically.
- Google Search Console: add your URL as a property, choose "HTML tag" verification, put the `content` value in `NEXT_PUBLIC_GSC_TOKEN`, redeploy, verify, then submit `/sitemap.xml`.
- Images are loaded lazily at fixed aspect ratios. They are served from wherever you host them, so compress them (WebP/JPEG, under ~200 KB).

## 6. Connecting people (what exists and what doesn't)
- **Exists:** Contact organizer button (WhatsApp/email with a prefilled message), community group link, WhatsApp/email/copy-link sharing.
- **Doesn't exist:** in-site chat, attendee lists or attendee-to-attendee messaging. Attendees meet through the organizer's group and share their own contact only by choice. The site collects no personal data.

## Known limitations
- New events and edits take up to ~10 minutes to appear (tune `revalidate` in the pages).
- Past events keep their page (marked "ended") so URLs don't break; they're hidden from listings.
- Client-side filtering is fine up to a few hundred events; beyond that, add server-side pagination.
# Gather-The-Event-Listing-App
