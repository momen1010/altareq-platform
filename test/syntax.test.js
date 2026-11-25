// Browser files are not imported by the server tests, so a typo in one would only show up on the live site.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const walk = dir => readdirSync(dir).flatMap(f => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));

test('every browser, demo and api script parses', () => {
  const files = ['public', 'demo', 'api'].flatMap(walk).filter(f => f.endsWith('.js'));
  assert.ok(files.length > 20);
  for (const f of files) {
    const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
    assert.equal(r.status, 0, `${f}\n${r.stderr}`);
  }
});
