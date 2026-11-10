import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyProductionSource } from './verify-production-source.mjs';

const current = 'a'.repeat(40);
const old = 'b'.repeat(40);
const production = { VERCEL_ENV: 'production', VERCEL_GIT_COMMIT_REF: 'main', VERCEL_GIT_COMMIT_SHA: current };
const git = (checkout = current, remote = `${current}\trefs/heads/main\n`) => args => args[0] === 'rev-parse' ? checkout : remote;
test('preview and local builds do not require production access', () => {
  for (const env of [{}, { VERCEL_ENV: 'preview' }]) assert.match(verifyProductionSource(env, () => { throw new Error('unexpected network'); }), /skipped/);
});
test('latest main commit is accepted', () => assert.match(verifyProductionSource(production, git()), /verified/));
test('stale source is rejected, including after main advances during a build', () => assert.throws(() => verifyProductionSource({ ...production, VERCEL_GIT_COMMIT_SHA: old }, git(old)), /Outdated/));
test('other branches cannot promote to production', () => assert.throws(() => verifyProductionSource({ ...production, VERCEL_GIT_COMMIT_REF: 'develop' }, git()), /main branch/));
test('missing or invalid identities fail closed', () => {
  for (const value of [undefined, '', 'main', 'a'.repeat(7)]) assert.throws(() => verifyProductionSource({ ...production, VERCEL_GIT_COMMIT_SHA: value }, git()), /identity/);
});
test('checkout must match Vercel metadata', () => assert.throws(() => verifyProductionSource(production, git(old)), /Checkout/));
test('malformed remote responses fail closed', () => {
  for (const response of ['', `${current} refs/heads/develop`, `${current} refs/heads/main extra`]) assert.throws(() => verifyProductionSource(production, git(current, response)), /Cannot verify/);
});
test('network errors stop a production build', () => assert.throws(() => verifyProductionSource(production, args => {
  if (args[0] === 'rev-parse') return current;
  throw new Error('Network unavailable');
}), /Network unavailable/));
