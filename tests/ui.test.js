// UI tests: loads the real index.html in jsdom and drives it like a user.
const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function open() {
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
  const { document } = dom.window;
  const $ = id => document.getElementById(id);
  const visible = id => !$(id).classList.contains('hidden');
  const submit = () => $('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  return { dom, document, $, visible, submit };
}

describe('planner form', () => {
  test('empty task shows an accessible error and no plan', () => {
    const { $, visible, submit, dom } = open();
    submit();
    assert.match($('err').textContent, /task/i);
    assert.strictEqual($('task').getAttribute('aria-invalid'), 'true');
    assert.strictEqual(visible('plan-card'), false);
    dom.window.close();
  });

  test('valid input renders a 3-step plan for the chosen energy', () => {
    const { $, document, visible, submit, dom } = open();
    $('task').value = 'Write the intro of my lab report';
    document.getElementById('e-low').checked = true;
    submit();
    assert.strictEqual(visible('plan-card'), true);
    assert.strictEqual($('plan-steps').children.length, 3);
    assert.match($('plan-energy').textContent, /Low/);
    assert.match($('plan-len').textContent, /25/);
    assert.strictEqual($('task').hasAttribute('aria-invalid'), false);
    dom.window.close();
  });

  test('impossible deadline shows a warning note and a shorter sprint', () => {
    const { $, submit, dom } = open();
    $('task').value = 'Finish my whole thesis';
    $('deadline').value = '5';
    submit();
    assert.ok($('plan-note').textContent.length > 0);
    assert.ok(!$('plan-note').classList.contains('hidden'));
    assert.match($('plan-len').textContent, /5-minute/);
    dom.window.close();
  });
});

describe('sprint and parking lot', () => {
  test('starting a sprint shows the timer at full time and hides setup', () => {
    const { $, visible, submit, dom } = open();
    $('task').value = 'Revise chapter 3';
    submit();
    $('start').click();
    assert.strictEqual(visible('sprint-card'), true);
    assert.strictEqual(visible('setup'), false);
    assert.strictEqual($('clock').textContent, '25:00');
    assert.strictEqual($('sprint-steps').children[0].className, 'now');
    $('reset').click();
    dom.window.close();
  });

  test('pause toggles to Resume and back', () => {
    const { $, submit, dom } = open();
    $('task').value = 'Debug the API';
    submit();
    $('start').click();
    $('pause').click();
    assert.strictEqual($('pause').textContent, 'Resume');
    $('pause').click();
    assert.strictEqual($('pause').textContent, 'Pause');
    $('reset').click();
    dom.window.close();
  });

  test('parked ideas are added as plain text, never as HTML', () => {
    const { $, document, submit, dom } = open();
    $('task').value = 'Study notes';
    submit();
    $('start').click();
    $('park-in').value = '<img src=x onerror=alert(1)>';
    $('park-form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    assert.strictEqual($('lot').children.length, 1);
    assert.strictEqual($('lot').textContent, '<img src=x onerror=alert(1)>');
    assert.strictEqual(document.querySelectorAll('img').length, 0);
    assert.strictEqual($('park-in').value, '');
    $('reset').click();
    dom.window.close();
  });

  test('stopping returns to setup and clears the sprint view', () => {
    const { $, visible, submit, dom } = open();
    $('task').value = 'Study notes';
    submit();
    $('start').click();
    $('reset').click();
    assert.strictEqual(visible('setup'), true);
    assert.strictEqual(visible('sprint-card'), false);
    dom.window.close();
  });
});

describe('accessibility and security markup', () => {
  test('every form control has a visible-to-assistive-tech label', () => {
    const { document, dom } = open();
    const controls = document.querySelectorAll('input[type=text], input[type=number], input[type=radio]');
    assert.ok(controls.length >= 6);
    for (const input of controls) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      assert.ok(label, `missing label for #${input.id}`);
      assert.ok(!label.classList.contains('hidden'), `label for #${input.id} is display:none`);
    }
    dom.window.close();
  });

  test('page has lang, a single h1, main landmark, skip link, timer role and live region', () => {
    const { document, dom } = open();
    assert.strictEqual(document.documentElement.lang, 'en');
    assert.strictEqual(document.querySelectorAll('h1').length, 1);
    assert.ok(document.querySelector('main'));
    assert.ok(document.querySelector('a.skip[href="#app"]'));
    assert.strictEqual(document.getElementById('clock').getAttribute('role'), 'timer');
    assert.ok(document.getElementById('live').getAttribute('aria-live'));
    dom.window.close();
  });

  test('ships a strict CSP, loads nothing external and never uses innerHTML', () => {
    const csp = html.match(/Content-Security-Policy" content="([^"]+)"/);
    assert.ok(csp && /default-src 'none'/.test(csp[1]));
    assert.doesNotMatch(html, /(src|href)=["']https?:/i);
    assert.doesNotMatch(html, /innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(/);
  });
});
