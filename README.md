# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.


## S01E03 review deliverables

The exported source files are preserved. Decision 0002 is a signed **proposal**, pending support-desk adoption.

- [New decision source](src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx)
- [Rendered page](rendered/kb/decisions/0002-dedupe-by-cause/index.html)
- [Parser issue draft](issue-drafts/parser.md): 379 unique reports
- [Form-hint issue draft](issue-drafts/hint.md): 33 unique reports
- [Full count and membership audit](evidence/analysis.json)
- [Verification record](evidence/verification.json)

### Reproduce

Use Node.js 24 or later. Run `npm ci`, `npm run analyze`, then `npm run build`.
Run `npm run preview -- --port 4173` and visit
`http://127.0.0.1:4173/kb/decisions/0002-dedupe-by-cause/`.
The complete static site, including its interactive assets, is committed under `rendered/`.
Serve that directory over HTTP; GitHub's file viewer displays source HTML rather than the rendered page.

Counts follow the exported tenant-based classifier, not intake tags or subjects. Five timing exceptions remain within the parser count and are explicitly unresolved. The export is a snapshot of 4 October, not a live desk feed. Before changing issues, read their latest state and comments and reconcile work already done.
