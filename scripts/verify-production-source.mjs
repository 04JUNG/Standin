import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const repository = 'https://github.com/04JUNG/Standin.git';
const shaPattern = /^[a-f0-9]{40}$/;

export function verifyProductionSource(env, git) {
  if (env.VERCEL_ENV !== 'production') return 'Non-production build: source guard skipped.';
  if (env.VERCEL_GIT_COMMIT_REF !== 'main') throw new Error('Production requires the main branch.');
  const commit = env.VERCEL_GIT_COMMIT_SHA;
  if (!shaPattern.test(commit ?? '')) throw new Error('Production commit identity is missing or invalid.');
  const checkout = git(['rev-parse', 'HEAD']).trim();
  if (checkout !== commit) throw new Error('Checkout does not match the deployment commit.');
  const remote = git(['ls-remote', '--exit-code', repository, 'refs/heads/main']).trim();
  const [head, ref, extra] = remote.split(/\s+/);
  if (!shaPattern.test(head ?? '') || ref !== 'refs/heads/main' || extra) throw new Error('Cannot verify the latest main commit; production build stopped.');
  if (head !== commit) throw new Error('Outdated production source. Deploy the latest main commit instead of redeploying an old build.');
  return `Production source verified: ${commit}`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    console.log(verifyProductionSource(process.env, args => execFileSync('git', args, {
      encoding: 'utf8', timeout: 30_000, stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    })));
  } catch (error) {
    console.error(`Production source guard: ${error.message}`);
    process.exitCode = 1;
  }
}
