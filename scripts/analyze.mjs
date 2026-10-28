import fs from 'node:fs';
import assert from 'node:assert/strict';
import { uniqueById, groupByCause, causeOf } from '../src/lib/kb/causes.ts';
import { deskRef } from '../src/lib/kb/desk-ref.ts';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const raw = read('src/lib/data/reports-4471.json');
const tenants = fs.readdirSync('src/lib/data/tenants').map(f => read('src/lib/data/tenants/' + f));
const tenantOf = r => tenants.find(t => t.handle === r.tenant);
const reports = uniqueById(raw).filter(r => r.mergedInto === 4471);
const groups = groupByCause(reports, tenantOf);
const seen = new Map();
for (const r of raw) { if (seen.has(r.id)) assert.deepEqual(r, seen.get(r.id), 'Conflicting duplicate ' + r.id); seen.set(r.id, r); }
const notes = read('src/lib/data/desk-notes.json').oneDayMove;
const monthCounts = field => Object.fromEntries(Object.entries(Object.groupBy(reports, r => r[field].slice(0,7))).map(([k,v]) => [k,v.length]));
const delays = reports.map(r => (Date.parse(r.mergedAt) - Date.parse(r.receivedAt))/86400000).sort((a,b)=>a-b);
const summary = {
  rawRows: raw.length, uniqueReports: reports.length, duplicateRows: raw.length-reports.length,
  intakeDisagreements: reports.filter(r => r.meta.intakeTag !== causeOf(r, tenantOf(r))).length,
  groups: groups.map(g => ({...g, reports: g.reports.length, reportIds: g.reports.map(r=>r.id), examples: g.reports.slice(0,3)})),
  deskNotes: notes.map(id => ({id, cause: causeOf(reports.find(r=>r.id===id),tenantOf(reports.find(r=>r.id===id)))})),
  receivedByMonth: monthCounts('receivedAt'), mergedByMonth: monthCounts('mergedAt'),
  beforeJuly: reports.filter(r=>r.receivedAt < '2026-07-01').length,
  mergedJuly2: reports.filter(r=>r.mergedAt.startsWith('2026-07-02')).length,
  lagDays: {max: delays.at(-1), median: (delays[205]+delays[206])/2},
  signature: 'Curtis Blanchette / Codex / S01E03', deskRef: deskRef('Curtis Blanchette / Codex / S01E03')
};
assert.equal(reports.length, 412);
assert.deepEqual(Object.fromEntries(groups.map(g=>[g.cause,g.reports.length])), {parser:379,hint:33});
assert.equal(new Set(groups.flatMap(g=>g.reports.map(r=>r.id))).size,reports.length);
fs.mkdirSync('evidence',{recursive:true});
fs.writeFileSync('evidence/analysis.json',JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({...summary,groups:summary.groups.map(({reportIds,examples,...g})=>g)},null,2));
