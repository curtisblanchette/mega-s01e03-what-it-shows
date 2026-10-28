## Problem

booking-v3 displays MM/DD/YYYY to day-first tenants, while the form reads input in tenant order. This is a separate hint/reader contract defect; a shared-parser repair alone will not fix it.

**Reports covered: 33 unique reports** from original ticket #4471, across 3 tenants, received 2026-04-17 through 2026-09-22. Snapshot: support KB export of 2026-10-04.

## Evidence and counting

Run `npm ci && npm run analyze`. The audit deduplicates the 427 source rows by report ID, checks repeated copies agree, filters `mergedInto === 4471`, and executes the exported `causeOf` logic with tenant locale and booking form. There are 412 unique reports in total, partitioned into 379 parser and 33 hint reports. Intake tags are not the grouping rule.

This group was tagged parser: 15, hint: 18. The full membership is in `evidence/analysis.json` and listed below.

## Representative reports

- **R-41230**, copper.studio, form: My client came on 1 June instead of 6 January. We sorted it out.
- **R-41241**, alder.physio, form: We had two people show up on 8 June. They were booked for 6 August.
- **R-41251**, pale.harbour, form: Wednesday 7 January showed as Wednesday 1 July. I moved it myself.

## Expected repair and acceptance

Align the displayed date format, validation and reader for booking-v3. Test Alder Physio (de-DE), Copper Studio (es-ES), and Pale Harbour (pt-PT); app/email reports from those tenants remain on the parser path. Verify entered dates round-trip unchanged, and include month-first controls.

## Coordination

Before acting, read the latest issue state and comments and search the current queue for an existing cause ticket. Link or update that ticket rather than duplicating work. No fix or live-queue refresh is claimed here. The proposal and rendered page are in `src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx` and `rendered/kb/decisions/0002-dedupe-by-cause/index.html`.

<details>
<summary>Covered report IDs</summary>

R-41230, R-41241, R-41251, R-41259, R-41262, R-41275, R-41294, R-41305, R-41308, R-41366, R-41372, R-41384, R-41387, R-41396, R-41400, R-41406, R-41415, R-41416, R-41418, R-41428, R-41439, R-41441, R-41449, R-41453, R-41456, R-41460, R-41472, R-41485, R-41493, R-41539, R-41572, R-41582, R-41584

</details>
