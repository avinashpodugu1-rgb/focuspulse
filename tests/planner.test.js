// Planner unit tests. Run: npm test   (uses Node's built-in test runner)
const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const block = html.match(/\/\* PLANNER:START \*\/([\s\S]*?)\/\* PLANNER:END \*\//);
assert.ok(block, 'planner block markers not found in index.html');
const ctx = vm.createContext({});
vm.runInContext(block[1] + '\nthis.api = { buildPlan, allocate, classify, parseDeadline, ENERGIES, TEMPLATES };', ctx);
const { buildPlan, allocate, classify, parseDeadline, ENERGIES, TEMPLATES } = ctx.api;

const total = plan => plan.steps.reduce((a, s) => a + s.min, 0);

describe('input validation', () => {
  test('empty or whitespace task asks for a task', () => {
    assert.strictEqual(buildPlan('   ', 'Low').status, 'need_task');
    assert.strictEqual(buildPlan(undefined, 'Low').status, 'need_task');
    assert.strictEqual(buildPlan(null, 'Low').status, 'need_task');
  });
  test('missing or invalid energy asks for energy', () => {
    assert.strictEqual(buildPlan('study', '').status, 'need_energy');
    assert.strictEqual(buildPlan('study', 'Extreme').status, 'need_energy');
    assert.strictEqual(buildPlan('study', undefined).status, 'need_energy');
  });
  test('task text is capped at 200 characters', () => {
    assert.ok(buildPlan('x'.repeat(500), 'Low').task.length <= 200);
  });
  test('markup in the task is returned as plain text (never executed by the app)', () => {
    const plan = buildPlan('<img src=x onerror=alert(1)>', 'Low');
    assert.strictEqual(plan.status, 'ok');
    assert.strictEqual(typeof plan.goal, 'string');
  });
});

describe('energy adaptation', () => {
  test('every energy returns 3 steps that total exactly 25 minutes', () => {
    for (const energy of ENERGIES) {
      const plan = buildPlan('Write lab report intro', energy);
      assert.strictEqual(plan.steps.length, 3, energy);
      assert.strictEqual(total(plan), 25, energy);
    }
  });
  test('different energies produce different plans and tone', () => {
    const low = buildPlan('Fix login bug', 'Low');
    const high = buildPlan('Fix login bug', 'High');
    assert.notStrictEqual(low.steps[0].text, high.steps[0].text);
    assert.notStrictEqual(low.pulse, high.pulse);
  });
  test('Low energy starts with a small setup step', () => {
    assert.ok(buildPlan('Study notes', 'Low').steps[0].min <= 5);
  });
  test('High energy tackles the hardest part first', () => {
    for (const task of ['Read chapter 4', 'Fix login bug', 'Write essay', 'Plan trip']) {
      assert.match(buildPlan(task, 'High').steps[0].text, /hardest|toughest|Attack|Start with the hardest/i);
    }
  });
});

describe('task classification', () => {
  test('routes tasks to the right template family', () => {
    assert.strictEqual(classify('Debug the API'), 'code');
    assert.strictEqual(classify('Write my essay'), 'write');
    assert.strictEqual(classify('Revise chapter 3'), 'read');
    assert.strictEqual(classify('Tidy my desk'), 'general');
  });
});

describe('deadlines and scope', () => {
  test('parseDeadline handles blanks, junk and large values', () => {
    assert.strictEqual(parseDeadline(''), null);
    assert.strictEqual(parseDeadline(null), null);
    assert.strictEqual(parseDeadline('abc'), null);
    assert.strictEqual(parseDeadline('90.9'), 90);
    assert.strictEqual(parseDeadline(99999999), 10000);
  });
  test('no deadline or a roomy one gives a full 25-minute sprint', () => {
    assert.strictEqual(total(buildPlan('Study notes', 'Medium')), 25);
    assert.strictEqual(total(buildPlan('Study notes', 'Medium', 500)), 25);
  });
  test('deadline under 10 minutes is impossible but still returns a slice', () => {
    const plan = buildPlan('Finish my whole thesis', 'High', 5);
    assert.strictEqual(plan.status, 'impossible');
    assert.ok(total(plan) <= 5 && plan.steps.length >= 1);
    assert.ok(plan.note.length > 0);
    assert.ok(plan.next.length > 0);
  });
  test('big task with under 25 minutes left is impossible and fits the time', () => {
    const plan = buildPlan('Complete the entire project', 'Medium', 15);
    assert.strictEqual(plan.status, 'impossible');
    assert.strictEqual(total(plan), 15);
  });
  test('zero and negative deadlines do not crash', () => {
    assert.strictEqual(buildPlan('Write email', 'Low', 0).status, 'impossible');
    assert.strictEqual(buildPlan('Write email', 'Low', -30).status, 'impossible');
  });
  test('a big task with a normal deadline is trimmed to one slice with next sprints', () => {
    const plan = buildPlan('Finish everything for the exam', 'Medium', 200);
    assert.strictEqual(plan.status, 'ok');
    assert.ok(plan.note.length > 0);
    assert.ok(plan.next.length > 0);
  });
});

describe('burnout', () => {
  test('burnout language recommends a 5-minute break and no work', () => {
    const plan = buildPlan("I'm exhausted and overwhelmed", 'Low');
    assert.strictEqual(plan.status, 'burnout');
    assert.strictEqual(plan.steps.length, 1);
    assert.strictEqual(total(plan), 5);
  });
});

describe('invariants across all combinations', () => {
  const tasks = ['Debug the API', 'Write my essay', 'Revise chapter 3', 'Tidy my desk', 'Finish the entire project'];
  const deadlines = [undefined, 0, 1, 2, 5, 9, 10, 12, 24, 25, 26, 60, 1000];
  test('minutes are positive integers, steps are non-empty, total never exceeds 25 or the deadline', () => {
    for (const task of tasks) for (const energy of ENERGIES) for (const dl of deadlines) {
      const plan = buildPlan(task, energy, dl);
      assert.ok(['ok', 'impossible'].includes(plan.status), `${task}/${energy}/${dl}`);
      assert.ok(plan.steps.length >= 1);
      for (const s of plan.steps) {
        assert.ok(Number.isInteger(s.min) && s.min >= 1, `${task}/${energy}/${dl}`);
        assert.ok(s.text.length > 0);
      }
      const cap = dl === undefined ? 25 : Math.max(2, Math.min(25, dl));
      assert.strictEqual(total(plan), cap, `${task}/${energy}/${dl}`);
    }
  });
  test('every template family defines all three energies', () => {
    for (const family of Object.values(TEMPLATES)) for (const energy of ENERGIES) {
      assert.ok(Array.isArray(family[energy]) && family[energy].length === 3);
    }
  });
});

describe('allocate', () => {
  test('keeps exact totals for awkward splits', () => {
    for (const t of [2, 3, 7, 11, 25]) {
      assert.strictEqual(allocate([3, 12, 10], t).reduce((a, b) => a + b, 0), t);
    }
  });
});
