// Run with: node tests/planner.test.js
// Extracts the planner logic from the single-file index.html and checks it.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/\/\* PLANNER:START \*\/([\s\S]*?)\/\* PLANNER:END \*\//);
assert(m, 'planner block not found');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(m[1] + '\nthis.buildPlan = buildPlan;', ctx);
const { buildPlan } = ctx;
const sum = p => p.steps.reduce((a, s) => a + s.min, 0);

const tests = {
  'empty task asks for a task': () => assert.strictEqual(buildPlan('  ', 'Low').status, 'need_task'),
  'missing energy asks for energy': () => assert.strictEqual(buildPlan('study', '').status, 'need_energy'),
  'Low plan: 3 steps totalling 25': () => { const p = buildPlan('Write lab report intro', 'Low'); assert.strictEqual(p.steps.length, 3); assert.strictEqual(sum(p), 25); },
  'energy changes the plan': () => assert.notStrictEqual(buildPlan('Fix login bug', 'Low').steps[0].text, buildPlan('Fix login bug', 'High').steps[0].text),
  'High energy starts with hardest part': () => assert(/hardest|toughest/i.test(buildPlan('Read chapter 4', 'High').steps[0].text)),
  'deadline under 10 min is impossible but gives a slice': () => { const p = buildPlan('Finish my whole thesis', 'High', 5); assert.strictEqual(p.status, 'impossible'); assert(sum(p) <= 5 && p.steps.length >= 1); assert(p.note.length > 0); },
  'big task with 15 min left is impossible': () => { const p = buildPlan('Complete the entire project', 'Medium', 15); assert.strictEqual(p.status, 'impossible'); assert.strictEqual(sum(p), 15); },
  'normal deadline caps at 25': () => assert.strictEqual(sum(buildPlan('Study notes', 'Medium', 500)), 25),
  'burnout recommends a break only': () => { const p = buildPlan("I'm exhausted and overwhelmed", 'Low'); assert.strictEqual(p.status, 'burnout'); assert.strictEqual(p.steps.length, 1); },
  'task input is capped at 200 chars': () => assert(buildPlan('x'.repeat(500), 'Low').task.length <= 200),
  'zero deadline does not crash': () => assert.strictEqual(buildPlan('Write email', 'Low', 0).status, 'impossible'),
};

let failed = 0;
for (const [name, fn] of Object.entries(tests)) {
  try { fn(); console.log('PASS', name); } catch (e) { failed++; console.log('FAIL', name, '-', e.message); }
}
console.log(failed ? `\n${failed} failed` : '\nAll tests passed');
process.exit(failed ? 1 : 0);
