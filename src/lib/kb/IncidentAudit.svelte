<script lang="ts">
  import raw from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, causeOf, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  const reports = uniqueById(raw as Report[]).filter(r => r.mergedInto === 4471);
  const mismatches = reports.filter(r => r.meta.intakeTag !== causeOf(r, tenantOf(r)));
  const old = reports.filter(r => r.receivedAt < '2026-07-01');
  const batch = reports.filter(r => r.mergedAt?.startsWith('2026-07-02'));
  const months = [...new Set(reports.map(r => r.receivedAt.slice(0,7)))].sort();
  const exceptions = reports.filter(r => notes.oneDayMove.includes(r.id));
</script>

<h2>Audit of the export</h2>
<p>{raw.length} export rows contain {reports.length} unique reports and {raw.length - reports.length} overlapping rows.
  {mismatches.length} unique reports disagree with their intake tag. Count each ID once; tenant locale and form version determine the exported classification.</p>
<h2>Arrival is not triage</h2>
<p>{old.length} reports arrived before July. {batch.length} reports were merged on July 2.
  A merge-date spike records the desk's work; it does not establish when the fault started. Reports continue after that batch.</p>
<table><thead><tr><th>Month</th><th>Received</th><th>Merged</th></tr></thead><tbody>
{#each months as month}<tr><td>{month}</td><td>{reports.filter(r => r.receivedAt.startsWith(month)).length}</td><td>{reports.filter(r => r.mergedAt?.startsWith(month)).length}</td></tr>{/each}
</tbody></table>
<h2>Timing exceptions to investigate</h2>
<p>{exceptions.length} reports are called out by the desk. The classifier places all of them under parser.
  Their bodies mention one-day shifts or unusual event ordering; classification is not proof of the underlying cause.
  Keep them within the parser count, preserve the IDs, and request original inputs, time zones, timestamps and invite payloads before diagnosing another defect.</p>
<table><thead><tr><th>Report</th><th>Tenant</th><th>Reported symptom</th></tr></thead><tbody>
{#each exceptions as r}<tr><td>{r.id}</td><td>{r.tenant}</td><td>{r.body}</td></tr>{/each}
</tbody></table>
